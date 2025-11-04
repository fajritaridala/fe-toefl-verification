import { ethers } from 'ethers';
import contractAbi from '@/abi/ToeflRecord.json';
import { CONTRACT_ADDRESS, IP_PROVIDER, RPC_URL } from '@/utils/config/env';
import metamask from '../metamask/metamask';
import MMSDK from '../metamask/sdk';

const abi = contractAbi.abi;

export async function getContractWithSigner() {
  const { signer } = await metamask.connectAndSign();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  return { contract, signer };
}

export async function getContract() {
  if (!RPC_URL) throw new Error('RPC_URL tidak ditemukan');
  // const provider = new ethers.JsonRpcProvider(RPC_URL);
  const provider = new ethers.JsonRpcProvider(IP_PROVIDER); // utk dev, menggunakan provider langsung ke ip komputer
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  return { contract };
}
