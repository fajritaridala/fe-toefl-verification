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
      <section className="max-w-screen-3xl 3xl:container bg-bg-light flex">
        <DashboardLayoutSidebar sidebarItems={SIDEBAR_ADMIN} isOpen={open} />
        <div className="bg-gray-50 m-auto h-screen w-full overflow-y-auto">
          <DashboardNavbar
            onMenuToggle={() => setOpen(!open)}
            description={description}
            heading={title}
          />
          <main className="p-6">
            {children}
          </main>
        </div>
      </section>
    </>
  );
}

export default DashboardLayout;
