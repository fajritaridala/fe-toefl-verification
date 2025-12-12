"use client";

import { ReactNode } from 'react';
import { cn } from '@heroui/react';

type Props = {
  title: string;
  description: string;
  icon?: ReactNode;
  index?: number;
};

const BaseCard = (props: Props) => {
  const { icon, title, description, index } = props;
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-8 flex flex-col items-center text-center",
        "transition-all duration-300 hover:-translate-y-2",
        // Shadow Neumorphism saat hover
        "hover:shadow-[8px_8px_16px_rgba(209,217,230,0.4),_-8px_-8px_16px_rgba(255,255,255,0.7)]"
      )}
    >
      <div className="mb-6 flex justify-center">
        <div
          className={cn(
            "rounded-full p-4",
            {
              "bg-primary/10 text-primary text-4xl": !index,
              "bg-primary text-white text-3xl font-bold flex h-16 w-16 items-center justify-center": index,
            }
          )}
        >
          {icon || <div className="leading-none">{index}</div>}
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-text mb-2 text-xl font-bold">{title}</h1>
        <p className="text-text-muted text-sm">{description}</p>
      </div>
    </div>
  );
};

export default BaseCard;
