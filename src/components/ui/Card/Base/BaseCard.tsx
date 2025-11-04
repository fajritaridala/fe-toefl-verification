import { ReactNode } from 'react';
import { Card, cn } from '@heroui/react';

type Props = {
  title: string;
  description: string;
  icon?: ReactNode;
  index?: number;
};

const BaseCard = (props: Props) => {
  const { icon, title, description, index } = props;
  return (
    <Card
      className={cn(
        'rounded-sm rounded-t-none border-x-1 border-b-2 border-transparent p-8 shadow-none',
        !index &&
          'transition-all duration-300 hover:-translate-y-2 hover:shadow-xl',
        {
          'hover:!shadow-box rounded-2xl transition-all delay-75 duration-200 hover:-translate-y-2':
            index,
        }
      )}
    >
      <div className="mb-6 flex justify-center">
        <div
          className={cn(
            'bg-primary/10 text-primary w-fit rounded-full p-3 text-[2.3em]',
            {
              'bg-primary flex h-20 w-20 justify-center border text-white shadow-lg':
                index,
            }
          )}
        >
          {icon || <div className="">{index}</div>}
        </div>
      </div>
      <div className="text-text-muted text-center">
        <h1 className="text-text mb-2 text-xl font-bold">{title}</h1>
        <p>{description}</p>
      </div>
    </Card>
  );
};

export default BaseCard;
