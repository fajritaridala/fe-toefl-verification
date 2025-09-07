import MMSDK from './sdk';

export const connectMetamaskWallet = async () => {
  try {
    if (!MMSDK) throw new Error('MetaMask not found');

    const provider = MMSDK.getProvider();
    if (!provider) throw new Error('MetaMask provider not found');

    // ambil address dari metamask
    const accounts = await MMSDK.connect();
    if (!accounts) {
      throw new Error(
        'No accounts found. Please ensure you have MetaMask account',
      );
    }
    const address = accounts[0];

    // message
    const date = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const message = `Sign message to enter the system.\n\nTimestamp: ${date}`;

    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, address],
    });

    return {
      address,
      message,
      signature,
    };
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
};
