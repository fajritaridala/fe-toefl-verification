import { ethers } from 'ethers';
import ToeflRecordABI from '@/abi/ToeflRecord.json';
import { CONTRACT_ADDRESS, RPC_URL } from '@/utils/config/env';

interface ParamsType {
  hash: string;
  cid: string;
}

interface StoreResultType {
  transactionHash: string;
  blockNumber: number;
  success: boolean;
}

const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  message: string
): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(message)), ms)
  );
  return Promise.race([promise, timeout]);
};

const blockchainService = {
  store: async (params: ParamsType): Promise<StoreResultType> => {
    const { hash, cid } = params;
    try {
      // 1. Check contract address
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured');
      }

      // 2. Dynamic import MetaMask (only loaded when this function is called)
      const { default: metamask } = await import('@/lib/metamask/metamask');

      // 3. Connect MetaMask
      const { signer } = await metamask.connectAndSign();

      // 4. Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ToeflRecordABI.abi,
        signer
      );

      // 5. Convert hash string to bytes32
      const hashBytes32 = hash.startsWith('0x') ? hash : `0x${hash}`;

      // 6. Call store function with timeout (2 minutes)
      const tx = await withTimeout(
        contract.store(hashBytes32, cid),
        120000, // 2 minutes
        'Transaksi timeout. Silakan cek MetaMask dan coba lagi.'
      );

      // 7. Wait for confirmation
      const receipt = await tx.wait(1);

      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        success: true,
      };
    } catch (error) {
      const err = error as any;

      // Handle specific errors with user-friendly messages
      if (
        err.code === 4001 ||
        err.code === 'ACTION_REJECTED' ||
        err.message?.toLowerCase().includes('user rejected')
      ) {
        throw err;
      } else if (err.message?.toLowerCase().includes('insufficient funds')) {
        throw new Error('Saldo tidak cukup untuk membayar gas fee');
      } else if (
        err.message?.includes('already exists') ||
        err.message?.includes('Record already exists')
      ) {
        throw new Error('Sertifikat sudah tersimpan di blockchain');
      } else if (err.message?.includes('Contract address')) {
        throw new Error('Konfigurasi contract address tidak valid');
      } else if (err.message?.includes('timeout')) {
        throw new Error(err.message);
      } else {
        throw new Error(`Blockchain error: ${err.message || 'Unknown error'}`);
      }
    }
  },
  get: async (hash: string): Promise<string> => {
    try {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Konfigurasi contract address tidak valid');
      }

      // Use JsonRpcProvider for read-only access (no MetaMask needed)
      if (!RPC_URL) {
        throw new Error('RPC_URL tidak ditemukan');
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ToeflRecordABI.abi,
        provider
      );

      const cid = await contract.getRecord(hash);

      if (!cid || cid === '') {
        throw new Error('Sertifikat belum tercatat di Blockchain');
      }

      return cid;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Gagal mendapatkan record: ${err.message}`);
    }
  },
};

export default blockchainService;
