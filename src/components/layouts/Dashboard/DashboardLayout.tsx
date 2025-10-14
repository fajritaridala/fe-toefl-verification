import { ReactNode, useState } from 'react';
import { Navbar, NavbarMenuToggle } from '@heroui/react';
import Header from '@/components/common/Header';
import { SIDEBAR_ADMIN } from './Dashboard.constans';
import DashboardLayoutSidebar from './DashboardSidebar';

type Props = {
  children: ReactNode;
  title?: string;
  type?: string;
  description?: string;
};

function DashboardLayout(props: Props) {
  const { title, children, description, type = 'admin' } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Header title={title} />
      <section className="max-w-screen-3xl 3xl:container bg-default-100 flex">
        <DashboardLayoutSidebar
          sidebarItems={SIDEBAR_ADMIN}
          isOpen={open}
          panel={type}
        />
        <div className="h-screen w-full overflow-y-auto p-8">
          <Navbar
            className="bg-default-50 flex justify-between px-0"
            classNames={{ wrapper: 'p-0' }}
          >
            <h1 className="text-3xl font-bold">{title}</h1>
            <NavbarMenuToggle
              className="lg:hidden"
              aria-label={open ? 'close menu' : 'open menu'}
              onClick={() => setOpen(!open)}
            />
          </Navbar>
          {children}
        </div>
      </section>
    </>
  );
}

export default DashboardLayout;
