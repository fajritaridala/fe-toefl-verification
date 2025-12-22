import { ethers } from 'ethers';
import MMSDK from './sdk';

const metamask = {
  async connect() {
    if (!MMSDK) throw new Error('MetaMask tidak ditemukan');
    try {
      const provider = MMSDK.getProvider();
      if (!provider) throw new Error('Provider tidak tersedia');

      // Request accounts without revoking permissions first
      // This provides smoother UX for repeated operations
      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[] | undefined;

      if (!accounts || accounts.length === 0) {
        throw new Error(
          'Akun tidak ditemukan. Pastikan kamu memiliki akun Metamask yang benar'
        );
      }

      const address = accounts[0];
      return { address };
    } catch (error) {
      if (typeof window !== 'undefined') {
        alert((error as Error).message);
      }
      throw error;
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
      if (typeof window !== 'undefined') {
        alert((error as Error).message);
      }
      throw error;
    }
  },

  async switchWallet() {
    if (!MMSDK) throw new Error('MetaMask tidak ditemukan');
    try {
      const provider = MMSDK.getProvider();
      if (!provider) throw new Error('Provider tidak tersedia');

      // Revoke permissions to force account picker
      await provider.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });

      // Small delay to ensure revoke is processed
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Request new account selection
      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[] | undefined;

      if (!accounts || accounts.length === 0) {
        throw new Error('Akun tidak ditemukan');
      }

      return { address: accounts[0] };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message);
    }
  },
};

export default metamask;
