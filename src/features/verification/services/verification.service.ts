import instance from "@/lib/axios/instance";
import endpoints from "@/constants/endpoints";

const verificationService = {
  getVerification: (cid: string) =>
    instance.request({
      url: endpoints.VERIFICATIONS,
      method: "GET",
      data: { cid },
    }),
};

export default verificationService;
