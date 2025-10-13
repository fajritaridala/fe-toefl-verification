import { ReactNode } from 'react';
import Header from '@/components/common/Header';

type Props = {
  children: ReactNode;
  title: string;
};

function MainLayout(props: Props) {
  const { children, title } = props;
  return (
    <div>
      <Header title={title} />
      {children}
    </div>
  );
}

export default MainLayout;
