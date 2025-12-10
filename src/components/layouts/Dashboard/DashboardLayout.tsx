'use client';

import { ReactNode, useState } from 'react';
import Header from '@/components/common/Header';
import { SIDEBAR_ADMIN } from './Dashboard.constans';
import DashboardNavbar from './DashboardNavbar';
import DashboardLayoutSidebar from './DashboardSidebar';

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
      <section className="max-w-screen-3xl 3xl:container bg-gray-100 flex">
        <DashboardLayoutSidebar sidebarItems={SIDEBAR_ADMIN} isOpen={open} />
        <div className="m-auto h-screen w-full overflow-y-auto bg-gray-100 p-6">
          <DashboardNavbar
            onMenuToggle={() => setOpen(!open)}
            description={description}
            heading={title}
          />
          {children}
        </div>
      </section>
    </>
  );
}

export default DashboardLayout;
