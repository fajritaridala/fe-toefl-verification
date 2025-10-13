import Header from '@/components/common/Header';

type Props = {
  title?: string;
  children: React.ReactNode;
};

const AuthLayout = (props: Props) => {
  const { title, children } = props;
  return (
    <>
      <Header title={title} />
      <main className="flex h-screen items-center justify-center bg-gray-100">
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
