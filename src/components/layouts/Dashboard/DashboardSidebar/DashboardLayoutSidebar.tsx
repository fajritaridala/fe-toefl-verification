import { Button, cn, Listbox, ListboxItem } from '@heroui/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { JSX } from 'react';
import { BiSolidFlame, BiSolidGroup, BiSolidLogOut } from 'react-icons/bi';

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
        'fixed z-50 flex h-screen w-full max-w-[20rem] -translate-x-full flex-col justify-between bg-white px-4 py-6 shadow-xl transition-all duration-200 lg:relative lg:translate-x-0',
        { 'translate-x-0': isOpen }
      )}
    >
      <div>
        <div className="mb-4 flex h-[9vh] items-center-safe border-b-1 border-neutral-300">
          <h1
            aria-label="Dashboard Panel"
            className="flex pl-[5%] text-3xl font-semibold capitalize"
          >
            <BiSolidFlame
              className="mr-3 rounded-md bg-[#006fee] p-[.2rem]"
              color={'#fefefe'}
            />
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
                className={cn('my-1 h-12 pl-[10%] text-2xl', {
                  'bg-primary text-white': isActive,
                })}
                startContent={item.icon}
                textValue={item.label}
                aria-labelledby={item.label}
                aria-describedby={item.label}
                onPress={() => router.push(item.href)}
              >
                <p className="text-medium">{item.label}</p>
              </ListboxItem>
            );
          }}
        </Listbox>
      </div>
      <div className="flex items-center p-1">
        <Button
          color="danger"
          fullWidth
          variant="light"
          size="lg"
          className="flex justify-start rounded-lg px-2 py-1.5 pl-[10%]"
          onPress={() => signOut()}
        >
          <BiSolidLogOut size={24} />
          Logout
        </Button>
      </div>
    </section>
  );
}

export default DashboardLayoutSidebar;
