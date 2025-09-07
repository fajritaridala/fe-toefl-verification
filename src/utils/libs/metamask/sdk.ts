import MetaMaskSDK from '@metamask/sdk';

let MMSDK: MetaMaskSDK | null = null;
if (typeof window !== 'undefined') {
  MMSDK = new MetaMaskSDK({
    dappMetadata: {
      name: 'TOEFL Verifications',
      url: window.location.href,
    },
  });
}
export default MMSDK;