import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, IP_PROVIDER, RPC_URL } from '@/utils/config/env';
import ToeflRecord from '@/abi/ToeflRecord.json';

const certificateBlockchain = {
  getCidFromContract: async (hash: string): Promise<string> => {
    try {
      console.log("hash", hash)
      if (!RPC_URL) throw new Error("RPC_URL tidak ditemukan.");
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      console.log("Using RPC:", RPC_URL);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ToeflRecord.abi,
        provider
      );
      if (!contract) throw new Error("Kontrak tidak ditemukan")
      console.log(contract)

      const cid = await contract.getRecord(hash);
      console.log(cid)
      
      if (!cid || cid === "") {
        throw new Error("Sertifikat belum tercatat di Blockchain (CID Kosong).");
      }

      return cid;

    } catch (error) {
      console.error("Blockchain Error (getCidFromContract):", error);
      throw error;
    }
  }
};

export default certificateBlockchain;