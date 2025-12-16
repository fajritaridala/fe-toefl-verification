import { Button, cn } from '@heroui/react';
import { RefreshCw } from 'lucide-react';

type RefreshButtonProps = {
  isRefetching: boolean;
  onRefresh: () => void;
  className?: string;
};

export function RefreshButton({
  isRefetching,
  onRefresh,
  className,
}: RefreshButtonProps) {
  return (
    <Button
      isIconOnly
      radius="full"
      variant="flat"
      className={cn(
        'border-secondary hover:border-secondary/70 h-9 w-9 min-w-9 border bg-white hover:bg-gray-50',
        className
      )}
      onPress={onRefresh}
      isDisabled={isRefetching}
      aria-label="Refresh data"
      title="Refresh data"
    >
      <RefreshCw
        className={cn('text-secondary h-4 w-4', isRefetching && 'animate-spin')}
      />
    </Button>
  );
}
