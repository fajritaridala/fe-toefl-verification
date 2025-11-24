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
};

function DashboardLayoutSidebar(props: Props) {
  const { sidebarItems, isOpen } = props;
  const router = useRouter();
  return (
    <section
      className={cn(
        'max-w-sidebar-panel bg-bg-light z-40 h-screen w-full flex flex-col justify-between px-4 shadow-sm transition-all duration-200 lg:relative lg:flex',
        {
          'hidden lg:flex': !isOpen,
        }
      )}
    >
      <div>
        <div className="my-8 flex items-center-safe">
          <div className="bg-primary mr-3 flex h-10 w-10 items-center rounded-lg">
            <LuDatabase className="text-bg-light text-large w-full" />
          </div>
          <h1
            aria-label="Dashboard Panel"
            className="text-primary text-xlarge flex font-extrabold capitalize"
          >
            Simpeka
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
                className={cn(
                  'text-large data-[hover=true]:bg-primary/10 text-text-muted data-[hover=true]:text-primary mb-1 h-10 rounded-lg transition-all delay-75 duration-200',
                  {
                    'text-bg-light bg-primary font-bold': isActive,
                  }
                )}
                startContent={item.icon}
                textValue={item.label}
                aria-labelledby={item.label}
                aria-describedby={item.label}
                onPress={() => router.push(item.href)}
              >
                <p
                  className={cn('text-small', {
                    'font-bold': isActive,
                  })}
                >
                  {item.label}
                </p>
              </ListboxItem>
            );
          }}
        </Listbox>
      </div>
      <div className="hover:bg-danger/10 mb-8 rounded-lg transition-all delay-75 duration-250">
        <Button
          data-hover="false"
          startContent={<LuChevronLeft strokeWidth={3} />}
          className="text-danger bg-transparent"
          onPress={() => signOut({ callbackUrl: '/auth/login' })}
        >
          <p className="text-small font-bold">Logout</p>
        </Button>
      </div>
    </section>
  );
}

export default DashboardLayoutSidebar;
