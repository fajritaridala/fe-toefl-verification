import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router"; // Fix: Use Pages Router
import * as Yup from "yup";
import authServices from "@features/auth/services/auth.service";
import randomize from "@/utils/config/randomize";
import { IRegister } from "@features/auth/types/auth.types";
import metamask from "@/lib/metamask/metamask";

const registerSchema = Yup.object().shape({
  username: Yup.string().required("Username wajib diisi"),
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  roleToken: Yup.string().optional(),
});

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAddress, setIsAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Mengambil addressQuery dari router.query
  const addressQuery = router.query.address as string;

  // Efek untuk mendekripsi address jika ada di URL
  useEffect(() => {
    const handleDecrypt = async () => {
      if (addressQuery && !isAddress) {
        try {
          // Decode URI component terlebih dahulu karena sering ter-encode di URL
          const decodedQuery = decodeURIComponent(addressQuery);
          const decrypted = await randomize.decrypt(decodedQuery);
          
          if (decrypted) {
            setIsAddress(decrypted);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Gagal mendekripsi alamat:", error);
          setAlertOpen(true);
          setAlertMessage("Tautan registrasi tidak valid atau kadaluarsa.");
        }
      }
    };

    if (router.isReady) {
      handleDecrypt();
    }
  }, [addressQuery, router.isReady, isAddress]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      roleToken: "",
    },
  });

  async function registerService(payload: IRegister) {
    try {
      const result = await authServices.register(payload);
      if (!result) {
        throw new Error("Tidak ada respons dari server.");
      }
      return result;
    } catch (error: any) {
      // Menangani error dari backend (misal: duplikat email/username)
      const errorMessage = error?.response?.data?.message || error.message || "Registrasi gagal";
      throw new Error(errorMessage);
    }
  }

  const { mutate: mutateRegister, isPending } = useMutation({
    mutationFn: registerService,
    async onSuccess(result) {
      const role = result?.data?.data?.role;
      try {
        // Auto login setelah register
        const signInResult = await signIn("credentials", {
          address: isAddress,
          redirect: false,
        });

        if (signInResult?.ok) {
          if (role === "admin") {
            await router.push("/admin/dashboard");
          } else {
            await router.push("/");
          }
          reset();
        } else {
            // Fallback jika auto-login gagal
             await router.push("/auth/login");
        }
      } catch {
        await router.push("/auth/login");
      }
    },
    onError(error) {
      setIsLoading(false);
      setAlertOpen(true);
      setAlertMessage(error.message);
    },
  });

  async function connectMetamask() {
    try {
      setIsLoading(true);
      const { address } = await metamask.connect();
      if (address) {
        setIsConnected(true);
        setIsAddress(address);
        setAlertOpen(false);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const err = error as Error;
      setAlertOpen(true);
      setAlertMessage(err.message);
    }
  }

  function handleRegister(data: Omit<IRegister, "address">) {
    if (!isAddress) {
      setAlertOpen(true);
      setAlertMessage("Alamat dompet tidak terdeteksi. Silakan hubungkan ulang MetaMask.");
      return;
    }

    setIsLoading(true);
    const payload = {
      address: isAddress,
      username: data.username,
      email: data.email,
      roleToken: data.roleToken || "",
    };

    mutateRegister(payload);
  }

  return {
    connectMetamask,
    handleRegister,
    handleSubmit,
    control,
    isPending,
    alertOpen,
    setAlertOpen,
    alertMessage,
    isLoading,
    isConnected,
    errors,
  };
}