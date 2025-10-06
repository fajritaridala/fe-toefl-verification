import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import QRCode from 'qrcode';
import * as yup from 'yup';
import contractService from '@/services/contract.service';
import toeflService from '@/services/toefl.service';
import { InputPayload } from '@/utils/interfaces/Toefl';
import { generateCertificate } from '@/utils/libs/jspdf/generateCertificate';

const inputSchema = yup.object().shape({
  nilai_listening: yup.number().required('Nilai listening wajib diisi'),
  nilai_structure: yup.number().required('Nilai structure wajib diisi'),
  nilai_reading: yup.number().required('Nilai reading wajib diisi'),
});

type UseAddInputModalProps = {
  address: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

function useAddInputModal({
  address,
  onSuccess,
  onError,
}: UseAddInputModalProps) {
  async function inputService(payload: InputPayload, address: string) {
    try {
      // kirim data ke backend
      const result = await toeflService.input(payload, address);
      if (!result) throw new Error('Input gagal');
      const { peserta, toefl_hash } = result.data.data;

      // kirim data ke smart contract
      // await contractService.storedRecord(toefl_hash, peserta);

      // buat kode qr
      const qrCode = await QRCode.toDataURL(toefl_hash);
      

      // membuat sertifikat dengan data peserta dan QR code
      const certificate = await generateCertificate(peserta, qrCode); // true untuk langsung mengunduh sertifikat
      certificate.save(
        `${peserta.nomor_induk_mahasiswa}_${peserta.nama_lengkap}.pdf`
      );
      // const blob = certificate.output("blob")
      // const file = new File([blob], `${peserta.nama_lengkap}-${peserta.nomor_induk_mahasiswa}.pdf`)

      // kirim sertifikat ke backend
      // await toeflService.uploadCertificate(file, address);
      return result;
    } catch (error) {
      const err = error as unknown as Error;
      throw err;
    }
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inputSchema),
  });
  const { mutate: AddInputMutate } = useMutation({
    mutationFn: (payload: InputPayload) => inputService(payload, address),
    onSuccess: () => {
      onSuccess && onSuccess();
    },
    onError: (error) => {
      onError && onError(error);
      console.error('Input error:', error);
    },
  });

  function handleInput(payload: InputPayload) {
    AddInputMutate(payload);
  }

  return {
    control,
    handleSubmit,
    handleInput,
    errors,
  };
}

export default useAddInputModal;
