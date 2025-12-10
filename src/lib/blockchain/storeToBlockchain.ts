import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '@/utils/config/env';
import ToeflRecordABI from '@/abi/ToeflRecord.json';
import metamask from '@/lib/metamask/metamask';

interface StoreToBlockchainParams {
  hash: string;
  cid: string;
}

interface StoreToBlockchainResult {
  transactionHash: string;
  blockNumber: number;
  success: boolean;
}

/**
 * Store certificate data to blockchain
 * @param hash - Hash from backend (hash of CID + crypto address)
 * @param cid - IPFS CID from Pinata
 * @returns Transaction details
 */
export async function storeToBlockchain({
  hash,
  cid,
}: StoreToBlockchainParams): Promise<StoreToBlockchainResult> {
  try {
    console.log('🔗 Starting blockchain transaction...');
    console.log('Hash:', hash);
    console.log('CID:', cid);

    // 1. Check contract address
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    console.log('Contract Address:', CONTRACT_ADDRESS);

    // 2. Connect MetaMask and get signer
    const { signer, provider } = await metamask.connectAndSign();
    const address = await signer.getAddress();
    console.log('Connected wallet:', address);

    // 3. Create contract instance
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ToeflRecordABI.abi,
      signer
    );

    // 4. Convert hash string to bytes32
    // Backend should send hash as hex string (0x...)
    const hashBytes32 = hash.startsWith('0x') ? hash : `0x${hash}`;
    console.log('Hash (bytes32):', hashBytes32);

    // 5. Check if record already exists (optional safety check)
    try {
      const existingRecord = await contract.getRecord(hashBytes32);
      if (existingRecord && existingRecord !== '') {
        throw new Error('Record already exists on blockchain');
      }
    } catch (error) {
      // If getRecord fails, it means record doesn't exist (which is good)
      console.log('Record does not exist yet (as expected)');
    }

    // 6. Call store function
    console.log('📝 Calling contract.store()...');
    const tx = await contract.store(hashBytes32, cid);
    console.log('Transaction sent:', tx.hash);

    // 7. Wait for confirmation
    console.log('⏳ Waiting for transaction confirmation...');
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!');
    console.log('Block number:', receipt.blockNumber);
    console.log('Transaction hash:', receipt.hash);

    // 8. Verify the record was stored
    const storedCid = await contract.getRecord(hashBytes32);
    console.log('Stored CID verification:', storedCid);

    if (storedCid !== cid) {
      throw new Error('CID verification failed');
    }

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      success: true,
    };
  } catch (error) {
    const err = error as Error;
    console.error('❌ Blockchain transaction failed:', err);

    // Handle specific errors
    if (err.message.includes('user rejected')) {
      throw new Error('Transaction ditolak oleh user');
    } else if (err.message.includes('insufficient funds')) {
      throw new Error('Saldo tidak cukup untuk membayar gas fee');
    } else if (err.message.includes('already exists')) {
      throw new Error('Sertifikat sudah tersimpan di blockchain');
    } else if (err.message.includes('Contract address')) {
      throw new Error('Konfigurasi contract address tidak valid');
    } else {
      throw new Error(`Blockchain error: ${err.message}`);
    }
  }
}

/**
 * Get record from blockchain by hash
 * @param hash - Certificate hash
 * @returns IPFS CID
 */
export async function getRecordFromBlockchain(hash: string): Promise<string> {
  try {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    // Connect to provider (read-only, no signer needed)
    const { provider } = await metamask.connectAndSign();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ToeflRecordABI.abi,
      provider
    );

    const hashBytes32 = hash.startsWith('0x') ? hash : `0x${hash}`;
    const cid = await contract.getRecord(hashBytes32);

    return cid;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to get record: ${err.message}`);
  }
}
