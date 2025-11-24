import { ReactNode, useState } from 'react';
import { LuUser } from 'react-icons/lu';
import { Button, Navbar, NavbarMenuToggle } from '@heroui/react';
import Header from '@/components/common/Header';
import { SIDEBAR_ADMIN } from './Dashboard.constans';
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
      <section className="max-w-screen-3xl 3xl:container bg-bg flex">
        <DashboardLayoutSidebar sidebarItems={SIDEBAR_ADMIN} isOpen={open} />
        <div className="h-screen w-full overflow-y-auto p-4">
          <Navbar
            position="static"
            className="bg-bg-light shadow-small flex h-auto justify-between rounded-lg"
            classNames={{ wrapper: 'p-5' }}
          >
            <div className="flex flex-col">
              <h1 className="text-large font-bold capitalize">{title}</h1>
              {description && (
                <p className="text-small text-text-muted">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-small flex items-center">
                <LuUser
                  className="text-primary mx-2 text-base"
                  strokeWidth={2}
                />
                <h1 className="capitalize">user</h1>
              </div>
              <NavbarMenuToggle
                className="lg:hidden"
                aria-label={open ? 'close menu' : 'open menu'}
                onClick={() => setOpen(!open)}
              />
            </div>
          </Navbar>
          {children}
        </div>
      </section>
    </>
  );
}

export default DashboardLayout;
