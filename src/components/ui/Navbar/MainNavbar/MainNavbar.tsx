import { ReactNode, useMemo } from 'react';
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
} from '@heroui/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { NAVBAR_DROPDOWN_ITEMS, NAVBAR_ITEMS } from './MainNavbarConstant';

type Props = {
  isAuthenticated: boolean;
  user: string;
  children: ReactNode;
};

function MainNavbar(props: Props) {
  const router = useRouter();
  const { isAuthenticated = false, user = 'User', children } = props;

  return (
    <div className="flex flex-col">
      <Navbar
        isBlurred
        className="fixed mx-auto mt-4 w-full rounded-full shadow-md md:h-[3rem] md:w-[93%]"
      >
        <NavbarBrand>
          <p className="text-primary-800 text-lg font-bold">Simpeka</p>
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem className="flex gap-4">
            {NAVBAR_ITEMS.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-primary-800 font-medium transition-all duration-250 hover:scale-110"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                key="activities"
                href="/"
                className="text-primary-800 font-medium transition-all duration-250 hover:scale-110"
              >
                Kegiatan saya
              </Link>
            )}
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          {isAuthenticated ? (
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    className="text-primary-800 bg-transparent p-0 font-bold"
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
