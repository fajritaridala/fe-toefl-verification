import { ReactNode } from 'react';
import Header from '@/components/common/Header';

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
