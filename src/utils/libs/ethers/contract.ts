import { ethers } from 'ethers';
import contractAbi from '@/abi/ToeflRecord.json';
import { CONTRACT_ADDRESS } from '@/utils/config/env';
import metamask from '../metamask/metamask';
import MMSDK from '../metamask/sdk';

const abi = contractAbi.abi;

export async function getContractWithSigner() {
  const { signer } = await metamask.connectAndSign();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  return { contract, signer };
}

export async function getContract() {
  // const { provider } = await metamask.connectAndSign();
  const web3Provider = MMSDK?.getProvider();
  if (!web3Provider) throw new Error('web3 provider tidak tersedia');
  const provider = new ethers.BrowserProvider(web3Provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  return { contract };
}
