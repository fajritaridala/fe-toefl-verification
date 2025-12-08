"use client";

import { Card } from '@heroui/react';

type Props = {
  testimony: string;
  name: string;
  job: string;
};

const TestimonyCard = (props: Props) => {
  const { testimony, name, job } = props;

  return (
    <Card className="hover:!shadow-box rounded-lg border border-gray-200 p-8 !shadow-none transition-all duration-200 hover:-translate-y-3">
      <p className="text-text-muted mb-6">{`"${testimony}"`}</p>
      <h1 className="text-lg font-bold">{name}</h1>
      <h2 className="text-text-muted text-sm">{job}</h2>
    </Card>
  );
};

export default TestimonyCard;
