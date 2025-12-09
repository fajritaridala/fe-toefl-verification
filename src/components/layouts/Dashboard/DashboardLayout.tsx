'use client';

import { ReactNode, useState } from 'react';
import Header from '@/components/common/Header';
import { SIDEBAR_ADMIN } from './Dashboard.constans';
import DashboardLayoutSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
};

function DashboardLayout(props: Props) {
  const { title, children, description } = props;
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Header title={title} />
      <section className="max-w-screen-3xl 3xl:container bg-bg flex">
        <DashboardLayoutSidebar sidebarItems={SIDEBAR_ADMIN} isOpen={open} />
        <div className="h-screen w-full overflow-y-auto p-4">
          <DashboardNavbar 
            onMenuToggle={() => setOpen(!open)}
            description={description}
          />
          {children}
        </div>
      </section>
    </>
  );
}

export default DashboardLayout;
