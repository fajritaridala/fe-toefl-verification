import Header from '@/components/common/Header';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title: string;
};

const BaseLayout = (props: Props) => {
  const { children, title } = props;
  return (
    <>
      <Header title={title} />
      {children}
    </>
  );
};

export default BaseLayout;
