import VerificationCard from "@/components/ui/Card/Verification";
import useVerificationResult from "./useVerificationResult";

const VerificationResult = () => {
  const { isPeserta, isScorePeserta, isLoading, isError, isVerified } = useVerificationResult();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memverifikasi Sertifikat...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500 font-bold">{isError}</div>;
  }

  return (
    <div className="bg-default-100 w-full flex flex-col items-center gap-4 py-8">
      {isVerified && (
        <div className="bg-green-100 border border-green-500 text-green-700 px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <span className="font-bold">Verifikasi Berhasil: Data Valid dari Blockchain</span>
        </div>
      )}

      <div className="scale-80 w-full max-w-4xl">
        <VerificationCard
          isPeserta={isPeserta}
          isScorePeserta={isScorePeserta}
        />
      </div>
    </div>
  );
};

export default VerificationResult;
