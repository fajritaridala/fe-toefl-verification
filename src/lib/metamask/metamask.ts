import { ethers } from 'ethers';
import MMSDK from './sdk';

const metamask = {
  async connect() {
    if (!MMSDK) throw new Error('MetaMask tidak ditemukan');
    try {
      // ambil address dari metamask
      const provider = MMSDK.getProvider();
      if (!provider) throw new Error('Provider tidak tersedia');

      await provider.request({
        method: 'wallet_revokePermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[] | undefined;
      if (!accounts)
        throw new Error(
          'Akun tidak ditemukan. Pastikan kamu memiliki akun Metamask yang benar'
        );

      const address = accounts[0];
      return { address };
    } catch (error) {
      const err = error as Error;
      console.log('error di metamask connect', err.message);
      throw new Error(err.message);
    }
  },

  async connectAndSign() {
    try {
      await MMSDK?.connectAndSign({
        msg: 'konfirmasi input data',
      });
      const web3Provider = MMSDK?.getProvider();
      if (!web3Provider) {
        throw new Error('Web3 provider tidak tersedia');
      }
      const provider = new ethers.BrowserProvider(web3Provider);
      const signer = await provider.getSigner();

      return { signer, provider };
    } catch (error) {
      const err = error as Error;
      console.log(`error di metamask connectAndSign : ${err.message}`);
      throw new Error(err.message);
    }
  },
};

export default metamask;
