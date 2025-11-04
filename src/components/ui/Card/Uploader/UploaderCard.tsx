import { ChangeEvent, DragEvent, RefObject } from 'react';
import { LuCloudUpload } from 'react-icons/lu';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Spinner,
  cn,
} from '@heroui/react';
import Image from 'next/image';

type DragHandlers = {
  onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
};

type Props = {
  error?: string;
  handleSubmit: () => void;
  isPreview?: string;
  handleClick: () => void;
  handleFile: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  loading: boolean;
  isDragging?: boolean;
  dragHandlers?: DragHandlers;
};

export default function UploaderCard(props: Props) {
  const {
    handleSubmit,
    isPreview,
    handleClick,
    handleFile,
    fileInputRef,
    loading,
    isDragging = false,
    dragHandlers,
  } = props;

  return (
    <>
      <Card className="shadow-box w-full rounded-lg px-2 py-4">
        <CardBody>
          <div
            onClick={handleClick}
            {...dragHandlers}
            className={cn(
              'bg-bg border-secondary/60 hover:border-secondary hover:bg-bg-dark cursor-pointer rounded-lg border-2 border-dashed py-18 text-center transition-all delay-100 duration-300',
              {
                'p-2': isPreview,
                'bg-bg-dark scale-102': isDragging && !isPreview,
              }
            )}
          >
            {loading ? (
              <Spinner className={cn('', { hidden: isPreview })} />
            ) : (
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFile}
                accept="application/pdf"
                className="hidden"
              />
            )}
            <span>
              {isPreview ? (
                <Image
                  src={isPreview}
                  alt="preview image"
                  width={24}
                  height={24}
                  className="w-fit"
                />
              ) : (
                <div className={cn('', { hidden: loading })}>
                  <div className="mb-2 flex justify-center-safe">
                    <LuCloudUpload
                      strokeWidth={2}
                      className="text-secondary/60 text-3xl"
                    />
                  </div>
                  <p className="text-text-muted text-sm transition-all">
                    <span className="text-secondary/60 font-bold">
                      Klik untuk mengunggah&nbsp;
                    </span>
                    atau seret dan lepas
                  </p>
                  <p className="text-text-muted text-extrasmall mt-2">
                    Format file: PDF
                  </p>
                </div>
              )}
            </span>
          </div>
        </CardBody>
        <Divider className="bg-secondary/60 my-2" />
        <CardFooter>
          <div className="grid grid-cols-4 gap-4">
            <Button
              onPress={handleClick}
              data-hover="false"
              className="border-secondary/60 text-secondary/90 rounded-lg border-2 bg-transparent font-semibold transition-all delay-75 duration-100 hover:-translate-y-1 hover:shadow-lg active:translate-y-1 active:shadow"
            >
              Pilih File
            </Button>
            <Button
              onPress={handleSubmit}
              data-hover="false"
              className="text-medium bg-primary rounded-lg font-semibold text-white transition-all delay-75 duration-100 hover:-translate-y-1 hover:shadow-lg active:translate-y-1 active:shadow"
              isDisabled={!isPreview}
            >
              Verifikasi
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
