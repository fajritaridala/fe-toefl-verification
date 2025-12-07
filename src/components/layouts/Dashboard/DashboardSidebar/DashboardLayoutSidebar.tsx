import { JSX, useCallback, useEffect, useState } from 'react';
import { LuChevronDown, LuChevronLeft, LuDatabase } from 'react-icons/lu';
import { Button, cn } from '@heroui/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export interface SidebarItem {
  key: string;
  label: string;
  href?: string;
  icon: JSX.Element;
  children?: Array<{
    key: string;
    label: string;
    href: string;
  }>;
}

type Props = {
  sidebarItems: SidebarItem[];
  isOpen: boolean;
};

function DashboardLayoutSidebar(props: Props) {
  const { sidebarItems, isOpen } = props;
  const router = useRouter();
  const currentPath = router.pathname;
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (!item.children?.length) return;
      const shouldExpand = item.children.some((child) =>
        currentPath.startsWith(child.href)
      );
      if (shouldExpand) {
        setExpandedGroups((prev) => ({ ...prev, [item.key]: true }));
      }
    });
  }, [currentPath, sidebarItems]);

  const renderChildButton = useCallback((child: {
    key: string;
    label: string;
    href: string;
  }) => {
    const isActive = currentPath.startsWith(child.href);
    return (
      <button
        key={child.key}
        type="button"
        className={cn(
          'text-small text-text-muted data-[active=true]:text-primary data-[active=true]:font-semibold flex w-full items-center gap-2 rounded-lg px-3 py-1.5 transition-colors duration-200',
          {
            'pl-4': true,
          }
        )}
        data-active={isActive}
        onClick={() => router.push(child.href)}
      >
        <span className="w-1.5 rounded-full bg-border" />
        {child.label}
      </button>
    );
  }, [currentPath, router]);

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
        <nav className="mt-4 flex flex-col">
          {sidebarItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isActive = hasChildren
              ? item.children!.some((child) => currentPath.startsWith(child.href))
              : item.href
                ? currentPath.startsWith(item.href)
                : false;
            const isExpanded = expandedGroups[item.key];
            const handlePress = () => {
              if (hasChildren) {
                toggleGroup(item.key);
                return;
              }
              if (item.href) {
                router.push(item.href);
              }
            };

            return (
              <div key={item.key} className="mb-1">
                <button
                  type="button"
                  onClick={handlePress}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-small text-text-muted transition-colors duration-200',
                    'hover:bg-primary/10 hover:text-primary',
                    {
                      'bg-primary text-bg-light font-semibold shadow-sm': isActive,
                    }
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {hasChildren && (
                    <LuChevronDown
                      className={cn('transition-transform duration-200', {
                        'rotate-180': isExpanded,
                      })}
                    />
                  )}
                </button>
                {hasChildren && isExpanded && (
                  <div className="ml-2 mt-2 flex flex-col gap-1 border-l border-border pl-2">
                    {item.children!.map((child) => renderChildButton(child))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
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
