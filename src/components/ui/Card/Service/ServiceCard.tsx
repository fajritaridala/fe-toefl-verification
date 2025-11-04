import { LuArrowRight, LuCalendarRange, LuTag } from 'react-icons/lu';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Image,
} from '@heroui/react';
import { useRouter } from 'next/router';

type Props = {
  redirect: string;
  title: string;
  description: string;
  schedule: string;
  price: string;
};

function ServiceCard(props: Props) {
  const router = useRouter();
  const { redirect, title, description, schedule, price } = props;

  const handleRegister = () => {
    router.push(redirect);
  };

  return (
    <Card className="group hover:shadow-box rounded-xl border border-gray-300 p-2 shadow-none transition-all delay-75 duration-200 ease-in-out hover:-translate-y-2">
      <CardHeader>
        <div className="text-primary flex w-full flex-wrap">
          <h1 className="mb-2 text-xl font-extrabold">{title}</h1>
          <div className="text-secondary flex w-full gap-2 text-[12px]">
            <LuCalendarRange strokeWidth={2} className="mt-1" />
            <p className="">{schedule}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="-mt-4">
        <p className="text-text-muted text-sm">{description}</p>
      </CardBody>
      <Divider className="bg-primary/20" />
      <CardFooter>
        <div className="flex w-full flex-wrap">
          <div className="mb-4">
            <h3 className="text-secondary text-[12px] leading-4 font-semibold">
              Harga
            </h3>
            <p className="text-xl font-extrabold">Rp {price}</p>
          </div>
          <Button
            data-hover={false}
            radius="full"
            className="bg-primary w-full font-bold text-white delay-75 duration-0 active:translate-y-1 active:!scale-100"
            onPress={handleRegister}
          >
            Daftar Sekarang
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;
