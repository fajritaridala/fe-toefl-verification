'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@heroui/react';

type Props = {
  title: string;
  description: string;
  price: string;
  notes?: string;
  redirect?: () => void;
};

function Service(props: Props) {
  const { redirect, title, description, price, notes } = props;

  return (
    <Card className="group rounded-xl border border-gray-300 p-2 shadow-none">
      <CardHeader>
        <div className="text-primary flex w-full flex-wrap">
          <h1 className="mb-2 text-xl font-extrabold">{title}</h1>
        </div>
      </CardHeader>
      <CardBody className="-mt-4 flex justify-between">
        <p className="text-text-muted text-sm">{description}</p>
        {notes && (
          <div className="border-info bg-info/10 mt-2 flex gap-1 rounded-r-full border-l-3 py-1">
            {/* <LuInfo
              strokeWidth={2}
              className="text-info ml-1 h-full text-[12px]"
            /> */}
            <p className="text-info ml-2 text-[12px] italic">{notes}</p>
          </div>
        )}
      </CardBody>
      <Divider className="bg-primary/20" />
      <CardFooter>
        <div className="flex w-full flex-wrap">
          <div className="mb-4">
            <h3 className="text-secondary text-[12px] leading-4 font-semibold">
              Harga
            </h3>
            <p className="text-xl font-extrabold">{price}</p>
          </div>
          <Button
            data-hover={false}
            radius="full"
            className="bg-primary w-full font-bold text-white delay-75 duration-0 active:translate-y-1 active:!scale-100"
            onPress={redirect}
          >
            Daftar Sekarang
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Service;
