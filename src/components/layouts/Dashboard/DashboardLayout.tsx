import Header from '@/components/common/Header';
import DashboardLayoutSidebar from './DashboardSidebar';
import { SIDEBAR_ADMIN, SIDEBAR_PESERTA } from './Dashboard.constans';
import { ReactNode, useState } from 'react';
import { Navbar, NavbarMenuToggle } from '@heroui/react';

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
      <section className="max-w-screen-3xl 3xl:container flex">
        <DashboardLayoutSidebar
          sidebarItems={type === 'admin' ? SIDEBAR_ADMIN : SIDEBAR_PESERTA}
          isOpen={open}
          panel={type}
        />
        <div className="h-screen w-full overflow-y-auto p-8">
          <Navbar
            isBordered
            className="flex justify-between px-0"
            classNames={{ wrapper: 'p-0' }}
          >
            <h1 className="text-3xl font-bold">{title}</h1>
            <NavbarMenuToggle
              className="lg:hidden"
              aria-label={open ? 'close menu' : 'open menu'}
              onClick={() => setOpen(!open)}
            />
          </Navbar>
          <p className="my-2.5">{description}</p>
          {children}
        </div>
      </section>
    </>
  );
}

export default DashboardLayout;
