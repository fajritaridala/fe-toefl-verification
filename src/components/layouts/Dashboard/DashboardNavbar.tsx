'use client';

import { Button } from '@heroui/react';
import { Menu, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

type Props = {
  onMenuToggle: () => void;
  description?: string;
  heading?: string;
};

function DashboardNavbar({ onMenuToggle, description, heading }: Props) {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between">
        {/* Left Section - Menu Toggle + Page Title */}
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={onMenuToggle}
            className="hover:text-primary text-gray-500 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              {heading}
            </h1>
            {description && (
              <p className="hidden text-xs text-gray-500 sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        {/* User Profile Static Display */}
        <div className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-1 pr-4 shadow-sm transition-all hover:border-gray-200 hover:shadow-md">
          <div className="bg-primary-50 text-primary group-hover:bg-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors group-hover:text-white">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <span className="text-xs font-bold text-gray-900">
              {session?.user?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-gray-500">
              {session?.user?.email || 'admin@example.com'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
