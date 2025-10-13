import { Button, Card, CardBody, Image } from '@heroui/react';
import { useRouter } from 'next/router';

type Props = {
  redirect: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
  description: string;
  schedule: string;
  price: string;
};

function ServiceCard(props: Props) {
  const router = useRouter();
  const { redirect, imageAlt, imageSrc, title, description, schedule, price } =
    props;

  const handleRegister = () => {
    router.push(redirect);
  };

  return (
    <div className="w-[46vw]">
      <Card>
        <CardBody>
          <div className="flex gap-2">
            <Image alt={imageAlt} width={500} src={imageSrc} />
            <div className="my-auto">
              <h1 className="text-primary-800 mb-1 text-[1.5rem] font-extrabold">
                {title}
              </h1>
              <p className="mb-2 text-[.8rem]">{schedule}</p>
              <p className="text-default-500 mb-3 text-[.8rem]">
                {description}
              </p>
              <div className="flex w-full justify-between">
                <p className="my-auto font-semibold">
                  Rp {price}
                  <span className="font-normal"> / tes</span>
                </p>
                <Button
                  radius="full"
                  className="border-primary-800 text-primary-800 hover:bg-primary-800 border-2 bg-white px-15 py-2 font-bold transition-all duration-200 hover:text-white"
                  onPress={handleRegister}
                >
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ServiceCard;
