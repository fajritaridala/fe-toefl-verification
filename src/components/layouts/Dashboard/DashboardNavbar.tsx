'use client';

import { Button } from '@heroui/react';
import { CircleUserRound, Menu } from 'lucide-react';

type Props = {
  onMenuToggle: () => void;
  description?: string;
  heading?: string;
};

function DashboardNavbar({ onMenuToggle, description, heading }: Props) {
  return (
    <nav className="sticky top-0 z-50 mb-6 bg-white">
      <div className="flex items-center justify-between">
        {/* Left Section - Menu Toggle + Welcome Text */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            isIconOnly
            variant="light"
            onPress={onMenuToggle}
            className="hover:text-primary text-gray-600 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Welcome Text */}
          <div className="flex flex-col">
            <h1 className="text-2xlarge text-text font-bold">{heading}</h1>
            <p className="text-small text-text-muted">{description}</p>
          </div>
        </div>

        {/* Right Section - User Icon */}
        <div className="flex items-center">
          <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-50">
            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              Admin
            </span>
            <CircleUserRound className="text-primary h-6 w-6" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
