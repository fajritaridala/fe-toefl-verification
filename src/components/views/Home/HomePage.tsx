
import { useRef } from 'react';
import UploaderCard from '@/components/ui/Card/UploaderCard';
import useHomePage from './useHomePage';

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPreview, handleClick, handleFile, handleSubmit } =
    useHomePage(fileInputRef);
  return (
    <UploaderCard
      handleSubmit={handleSubmit}
      fileInputRef={fileInputRef}
      handleClick={handleClick}
      handleFile={handleFile}
      isPreview={isPreview}
    />
  );
}
