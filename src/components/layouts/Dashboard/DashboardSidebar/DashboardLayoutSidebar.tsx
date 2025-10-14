import { JSX } from 'react';
import { LuChevronLeft, LuDatabase } from 'react-icons/lu';
import { Button, Listbox, ListboxItem, cn } from '@heroui/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export interface SidebarItem {
  key: string;
  label: string;
  href: string;
  icon: JSX.Element;
}

type Props = {
  sidebarItems: SidebarItem[];
  isOpen: boolean;
  panel: string;
};

function DashboardLayoutSidebar(props: Props) {
  const { sidebarItems, isOpen, panel } = props;
  const router = useRouter();
  return (
    <section
      className={cn(
        'fixed z-50 flex h-screen w-full max-w-[20rem] -translate-x-full flex-col justify-between bg-white px-4 py-6 shadow-sm transition-all duration-200 lg:relative lg:translate-x-0',
        { 'translate-x-0': isOpen }
      )}
    >
      <div>
        <div className="mb-4 flex h-[9vh] items-center-safe border-b-1 border-neutral-300">
          <h1
            aria-label="Dashboard Panel"
            className="text-primary-800 flex pl-[5%] text-3xl font-extrabold capitalize"
          >
            <LuDatabase className="mr-3 rounded-md" />
            {panel} panel
          </h1>
        </div>
        <Listbox
          items={sidebarItems}
          aria-label="Dashboard Sidebar"
          variant="flat"
        >
          {(item) => {
            const isActive =
              item.href === '/admin/participants'
                ? router.pathname === item.href
                : router.pathname.startsWith(item.href);
            return (
              <ListboxItem
                key={item.key}
                className={cn('my-1 h-12 pl-[10%] text-2xl font-semibold', {
                  'bg-primary-800 font-semibold text-white': isActive,
                })}
                startContent={item.icon}
                textValue={item.label}
                aria-labelledby={item.label}
                aria-describedby={item.label}
                onPress={() => router.push(item.href)}
              >
                <p>{item.label}</p>
              </ListboxItem>
            );
          }}
        </Listbox>
      </div>
      <div className="flex items-center p-1">
        <Button
          fullWidth
          variant="light"
          size="lg"
          className="text-primary-800 hover:!bg-primary-800 flex justify-start rounded-lg px-2 py-1.5 pl-[10%] font-semibold transition-all duration-300 hover:text-white"
          onPress={() => signOut({ callbackUrl: '/auth/login' })}
        >
          <LuChevronLeft size={24} />
          Logout
        </Button>
      </div>
    </section>
  );
}

export default DashboardLayoutSidebar;
