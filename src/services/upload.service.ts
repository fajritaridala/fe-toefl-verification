import instance from '@/utils/libs/axios/instance';

const convert = {
  pdfToImg(file: File) {
    // const payload = {
    //   pdf: buffer,
    // };
    return instance.post('upload/convert-image', file);
  },
};

export default convert;
