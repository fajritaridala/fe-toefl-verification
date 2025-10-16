
import { ChangeEvent, RefObject, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  cn,
} from '@heroui/react';
import Image from 'next/image';

type Props = {
  error?: string;
  handleSubmit: () => void;
  isPreview?: string;
  handleClick: () => void;
  handleFile: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export default function UploaderCard(props: Props) {
  const { handleSubmit, isPreview, handleClick, handleFile, fileInputRef } =
    props;

  return (
    <Card className="mx-auto w-full max-w-2xl p-4 md:p-6 lg:p-8">
      <CardHeader className="text-center">
        <div className="w-full">
          <h1 className="text-primary-800 mb-2 text-[2rem] font-bold">
            Upload Sertifikat
          </h1>
          <p className="text-default-500 text-sm">
            Unggah file sertifikat kamu (pdf/jpg/png)
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div
          onClick={handleClick}
          className={cn(
            'bg-default-100 border-primary-800 hover:bg-default-200 cursor-pointer rounded-lg border-2 border-dashed p-[5rem] text-center transition-all duration-300',
            { 'p-2': isPreview }
          )}
        >
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            className="hidden"
          />
          <span className="font-medium">
            {isPreview ? (
              <Image
                src={isPreview}
                alt="preview image"
                width={24}
                height={24}
                className="w-fit"
              />
            ) : (
              'Drop file di sini atau klik untuk memilih'
            )}
          </span>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex w-full justify-around">
          <Button
            onPress={handleSubmit}
            className="text-medium bg-primary-800 w-[50%] font-semibold text-white"
          >
            Verifikasi
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
