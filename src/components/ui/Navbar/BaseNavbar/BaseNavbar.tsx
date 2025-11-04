import { ReactNode, useEffect, useState } from 'react';
import { LuChevronDown, LuUser } from 'react-icons/lu';
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  cn,
} from '@heroui/react';
import Link from 'next/link';
import { SessionExt } from '@/utils/interfaces/Auth';
import { NAVBAR_DROPDOWN_ITEMS, NAVBAR_ITEMS } from './BaseNavbarConstants';
import useBaseNavbar from './useBaseNavbar';

type Props = {
  isAuthenticated: boolean;
  user: SessionExt | null;
  children: ReactNode;
  pathname?: string;
};

const BaseNavbar = (props: Props) => {
  const { isAuthenticated = false, user, children, pathname } = props;
  const [username, setUsername] = useState('User');
  const { isScrolled, handleLogin } = useBaseNavbar();

  useEffect(() => {
    setUsername(user?.user?.fullName || username);
  }, [user]);

  return (
    <div>
      <Navbar
        isBlurred={isScrolled}
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
          {
            'bg-white/80 shadow-sm': isScrolled,
            'bg-transparent': !isScrolled,
          }
        )}
        classNames={{
          wrapper: ['p-0 max-w-5xl'],
        }}
      >
        {/* left start */}
        <NavbarBrand>
          <p className="text-primary text-xl font-extrabold">Simpeka</p>
        </NavbarBrand>
        {/* left end */}

        {/* center start */}
        <NavbarContent justify="end">
          <NavbarItem className="flex gap-4 text-sm">
            {NAVBAR_ITEMS.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'text-text-muted hover:text-secondary border-b-1.5 relative border-transparent px-2 py-2 delay-75 active:translate-y-0.5',
                    {
                      'text-primary hover:text-primary border-primary':
                        pathname === item.href,
                    }
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </NavbarItem>
          <Divider orientation="vertical" className="bg-secondary h-5" />
          {isAuthenticated ? (
            <Dropdown className="bg-bg-light mt-3 rounded-sm !shadow">
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    data-hover={false}
                    className="border-primary hover:bg-primary group text-primary border-1.5 rounded-lg bg-transparent px-2 text-sm transition-all delay-75 duration-100 active:translate-y-0.5"
                    startContent={
                      <LuUser
                        strokeWidth={2}
                        className="delay-75 group-hover:text-white"
                      />
                    }
                    endContent={
                      <LuChevronDown
                        strokeWidth={2}
                        className="delay-75 group-hover:text-white"
                      />
                    }
                  >
                    <p className="capitalize delay-75 group-hover:text-white">
                      {username}
                    </p>
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu>
                {NAVBAR_DROPDOWN_ITEMS.map((item) => (
                  <DropdownItem
                    key={item.key}
                    onPress={item.onPress}
                    startContent={item.icon}
                    className={cn(
                      'text-text data-[hover=true]:bg-primary data-[hover=true]:text-bg-light rounded-sm text-sm delay-[.05s]',
                      {
                        'text-danger data-[hover=true]:bg-danger':
                          item.label === 'Logout',
                      }
                    )}
                  >
                    <p>{item.label}</p>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              data-hover={false}
              onPress={handleLogin}
              size="md"
              className="border-primary hover:bg-primary hover:text-bg-light text-primary text-medium rounded-sm border-2 bg-transparent px-8 font-semibold delay-75 duration-0 active:translate-y-0.5"
            >
              Login
            </Button>
          )}
        </NavbarContent>
        {/* center end */}

        {/* right start */}
        {/* right end */}
      </Navbar>
      <main>{children}</main>
    </div>
  );
};

export default BaseNavbar;
