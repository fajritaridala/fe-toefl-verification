import instance from '@/lib/axios/instance';
import endpoints from '@/constants/endpoints';

const certificateApi = {
  getHash: async () => {
    const { data } = await instance.get(`${endpoints.ENROLLMENTS}/hash`);
    return data;
  },
  
  getDataFromIpfs: async (cid: string) => {
    const GATEWAY = "https://gateway.pinata.cloud/ipfs";
    const response = await fetch(`${GATEWAY}/${cid}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch data from IPFS");
    }
    
    return await response.json();
  }
};

export default certificateApi;
