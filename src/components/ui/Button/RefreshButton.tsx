import { RefreshCw } from 'lucide-react';
import { cn } from '@heroui/react';

type RefreshButtonProps = {
  isRefetching: boolean;
  onRefresh: () => void;
  className?: string;
};

export function RefreshButton({ isRefetching, onRefresh, className }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={isRefetching}
      className={cn(
        "bg-primary hover:bg-primary/90 group text-small inline-flex h-9 min-w-24 items-center justify-center gap-2 rounded-full px-4 font-semibold text-white shadow-sm transition-all delay-75 duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      title="Refresh data"
    >
      <RefreshCw
        className={cn(
          "group-hover:text-white h-4 w-4 text-white transition-transform",
           isRefetching ? 'animate-spin' : ''
        )}
      />
      <span className="group-hover:text-white">Refresh</span>
    </button>
  );
}
