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
      {children}
    </>
  );
};

export default AuthLayout;
