import { MetaMaskSDK } from '@metamask/sdk';

let MMSDK: MetaMaskSDK | null = null;
if (typeof window !== 'undefined') {
  try {
    MMSDK = new MetaMaskSDK({
      dappMetadata: {
        name: 'TOEFL Verifications',
        url: window.location.href,
      },
    });
  } catch (error) {
    console.error('Failed to initialize MetaMask SDK:', error);
  }
}
export default MMSDK;
