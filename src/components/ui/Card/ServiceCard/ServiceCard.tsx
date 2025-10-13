import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from '@heroui/react';
import { useRouter } from 'next/router';

function ServiceCard() {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/peserta/toefl/like/register');
  };

  return (
    <div className="w-[33rem]">
      <Card>
        <CardBody>
          <div className="flex gap-2">
            <Image
              alt="toefl-like"
              width={500}
              src="https://res.cloudinary.com/dm0oo1005/image/upload/v1760096218/Toefl-like_cj1iwk.png"
            />
            <div className="my-auto">
              <h1 className="text-primary-800 mb-1 text-[1.5rem] font-extrabold">
                TOEFL Like Test
              </h1>
              <p className="mb-2 text-[.8rem]">
                Senin-Kamis (08.30-Selesai / 13.00-Selesai)
              </p>
              <p className="text-default-500 mb-3 text-[.8rem]">
                Tes ini digunakan sebagai persyaratan mengikuti ujian akhir bagi
                mahasiswa Strata 1 dalam lingkungan Universitas Haluoleo.
              </p>
              <div className="flex w-full justify-between">
                <p className="my-auto font-semibold">
                  Rp. 50.000<span className="font-normal"> / test</span>
                </p>
                <Button
                  radius="lg"
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
