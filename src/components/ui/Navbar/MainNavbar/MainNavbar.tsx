import { ReactNode, useMemo, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  cn,
} from '@heroui/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { NAVBAR_DROPDOWN_ITEMS, NAVBAR_ITEMS } from './MainNavbarConstant';

type Props = {
  isAuthenticated: boolean;
  user: string;
  children: ReactNode;
  pathname: string;
};

function MainNavbar(props: Props) {
  const router = useRouter();
  const { isAuthenticated = false, user = 'User', children, pathname } = props;

  return (
    <div className="flex flex-col">
      <Navbar
        isBlurred
        className="text-primary-800 fixed mx-auto mt-4 h-[3rem] w-full shadow-md md:w-[80vw] md:rounded-full lg:h-[3.5rem] lg:w-[70vw]"
      >
        <NavbarBrand>
          <p className="text-lg font-bold">Simpeka</p>
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem className="flex gap-4">
            {NAVBAR_ITEMS.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'text-primary-800 py-2 transition-all duration-200 hover:scale-105',
                    {
                      'border-primary-800 scale-110 font-semibold hover:scale-110':
                        pathname === item.href,
                    }
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                key="activity"
                href="/peserta/activity"
                className={cn(
                  'text-primary-800 py-2 transition-all duration-200 hover:scale-105',
                  {
                    'border-primary-800 border-b py-3 hover:scale-100':
                      pathname === '/peserta/activity',
                  }
                )}
              >
                Kegiatan saya
              </Link>
            )}
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          {isAuthenticated ? (
            <Dropdown className="mt-2">
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    className="text-primary-800 bg-transparent p-0"
                    endContent={<LuChevronDown />}
                  >
                    {user}
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu>
                {NAVBAR_DROPDOWN_ITEMS(router, signOut).map((item) => (
                  <DropdownItem
                    key={item.key}
                    onPress={item.onPress}
                    startContent={item.icon}
                    className="text-primary-800"
                  >
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button radius="full" className="bg-black text-white">
              Login
            </Button>
          )}
        </NavbarContent>
      </Navbar>
      <main>{children}</main>
    </div>
  );
}

export default MainNavbar;
