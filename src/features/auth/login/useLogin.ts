import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import randomize from "@/utils/config/randomize";
import metamask from "@/lib/metamask/metamask";

const loginSchema = Yup.object().shape({
  address: Yup.string()
    .required("Alamat dompet diperlukan")
    .matches(/^0x[a-fA-F0-9]{40}$/, "Format alamat Ethereum tidak valid"),
});

export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [address, setAddress] = useState("");
  
  const callbackUrl = (router.query.callbackUrl as string) ?? "/";

  const loginService = async (address: string) => {
    console.log(address)
    const result = await signIn("credentials", {
      address,
      redirect: false,
      callbackUrl,
    });

    if (!result) {
      throw new Error("Tidak ada respons dari layanan masuk.");
    }
    
    if (!result.ok) {
      // Menangani error spesifik dari NextAuth atau Backend
      if (result.error === "CredentialsSignin") {
         // Ini biasanya terjadi jika authorize return null atau throw error
         throw new Error("Gagal Masuk: Akun tidak ditemukan atau terjadi kesalahan pada server.");
      }
      // Menampilkan pesan error asli jika ada
      throw new Error(result.error || "Login gagal! Mohon periksa kembali koneksi atau kredensial Anda.");
    }
    
    return result;
  };

  const { mutate: mutateLogin } = useMutation({
    mutationFn: loginService,
    async onSuccess() {
      async function waitForSession(maxTries = 5, delayMs = 200) {
        for (let attempt = 0; attempt < maxTries; attempt++) {
          const session = await getSession();
          if (session?.user) return session;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
        return await getSession();
      }

      const session = await waitForSession();
      const user = session?.user as
        | {
            address?: string;
            needsRegistration?: boolean;
            role?: string;
          }
        | undefined;

      if (user?.needsRegistration && user.address) {
        const encryptedAddress = await randomize.encrypt(user.address);
        await router.push(
          `/auth/register?address=${encodeURIComponent(encryptedAddress)}`
        );
        return;
      }

      switch (user?.role) {
        case "admin":
          await router.push("/admin/dashboard");
          break;
        case "peserta":
          await router.push("/");
          break;
        default:
          await router.push("/");
          break;
      }
    },
    onError(error) {
      setIsLoading(false);
      setAlertOpen(true);
      const err = error as Error;
      setAlertMessage(err.message || "Terjadi kesalahan yang tidak terduga");
    },
  });

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setAlertOpen(false);
      const { address } = await metamask.switchWallet();
      setAddress(address);
      await loginSchema.validate({ address });
      mutateLogin(address);
    } catch (error) {
      setIsLoading(false);
      const err = error as Error;
      setAlertOpen(true);
      setAlertMessage(err.message);
    }
  };

  return {
    handleLogin,
    alertOpen,
    setAlertOpen,
    alertMessage,
    isLoading,
    address,
  };
};
