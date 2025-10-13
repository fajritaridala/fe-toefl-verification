import Header from '@/components/common/Header';
import TOEFLRegisterPage from '@/components/views/Peserta/TOEFL/Register';

export default function TOEFLLikeRegister() {
  return (
    <div className="bg-default-100">
      <Header title="Register" />
      <div className="scale-80">
        <TOEFLRegisterPage />
      </div>
    </div>
  );
}
