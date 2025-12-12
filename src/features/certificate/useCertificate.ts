import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useQuery } from '@tanstack/react-query';
import { generateCertificate } from '@/lib/jspdf/generateCertificate';
import { CertificatePayload } from '@/types/certificate.type';
import certificateApi from './services/certificate.api';
import certificateBlockchain from './services/certificate.blockchain';

export const useCertificate = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Fetch Hash from Backend
  const { 
    data: hashData, 
    isLoading: isLoadingHash,
    error: hashError 
  } = useQuery({
    queryKey: ['certificateHash'],
    queryFn: certificateApi.getHash,
    retry: 1,
  });

  const hash = hashData?.data?.hash;

  // 2. Fetch CID from Blockchain (Dependent on Hash)
  const {
    data: cid,
    isLoading: isLoadingCid,
    error: cidError
  } = useQuery({
    queryKey: ['certificateCid', hash],
    queryFn: () => certificateBlockchain.getCidFromContract(hash!),
    enabled: !!hash, 
    retry: 1,
  });

  // 3. Fetch Data from IPFS (Dependent on CID)
  const {
    data: certificateData,
    isLoading: isLoadingIpfs,
    error: ipfsError
  } = useQuery({
    queryKey: ['certificateIpfs', cid],
    queryFn: () => certificateApi.getDataFromIpfs(cid!),
    enabled: !!cid,
    retry: 1,
  });

  console.log(certificateData)

  // 4. Generate PDF & QR saat data lengkap (Hash -> CID -> Data)
  useEffect(() => {
    const init = async () => {
      // Pastikan semua data tersedia
      if (!hash || !certificateData) return;

      try {
        setIsGenerating(true);
        
        // A. Generate QR dari Hash
        const qrUrl = await QRCode.toDataURL(hash);
        setQrCodeUrl(qrUrl);

        // B. Generate PDF Preview menggunakan Data IPFS Asli
        // Cast ke CertificatePayload untuk keamanan tipe
        const payload = certificateData?.content;
        const doc = await generateCertificate(payload, qrUrl);
        const blobUrl = doc.output('bloburl');
        setPdfBlobUrl(blobUrl.toString());

      } catch (err) {
        console.error('Failed to generate certificate preview', err);
      } finally {
        setIsGenerating(false);
      }
    };

    init();

    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, certificateData]); // Re-run jika hash atau data berubah

  const handleDownload = async () => {
    if (!qrCodeUrl || !certificateData) return;
    try {
      const payload = certificateData as CertificatePayload;
      const doc = await generateCertificate(payload, qrCodeUrl);
      doc.save(`Sertifikat-${payload.fullName}.pdf`);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  const isLoading = isLoadingHash || isLoadingCid || isLoadingIpfs || isGenerating;
  const error = hashError || cidError || ipfsError;

  return {
    certificateData: certificateData as CertificatePayload | undefined,
    isLoading,
    error,
    qrCodeUrl,
    pdfBlobUrl,
    handleDownload,
    hash,
    cid
  };
};
