import VerificationCard from "@/components/ui/Card/Verification";
import useVerificationResult from "./useVerificationResult";

const VerificationResult = () => {
  const { isPeserta, isScorePeserta } = useVerificationResult();
  return (
    <div className="bg-default-100 w-full">
      <div className="scale-80">
        <VerificationCard
          isPeserta={isPeserta}
          isScorePeserta={isScorePeserta}
        />
      </div>
    </div>
  );
};

export default VerificationResult;
