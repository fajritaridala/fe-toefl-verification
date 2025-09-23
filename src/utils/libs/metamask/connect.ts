import MMSDK from './sdk';

export async function connectMetamaskWallet() {
  try {
    if (!MMSDK) throw new Error('MetaMask not found');

    // ambil address dari metamask
    const accounts = await MMSDK.connect();
    if (!accounts) {
      throw new Error(
        'No accounts found. Please ensure you have MetaMask account'
      );
    }

    const address = accounts[0];
    return {
      address,
    };
  } catch (error) {
    const err = error as Error;
    console.log('error di metamask connect', err.message);
    throw new Error(err.message);
  }
}
