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
      <section className="flex h-[100vh] flex-wrap items-center justify-center-safe">
        {children}
      </section>
    </>
  );
};

export default AuthLayout;
