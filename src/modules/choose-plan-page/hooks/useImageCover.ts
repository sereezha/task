import { API } from '../../../services/api';
import { ApiFile } from '../../../services/api/types';
import { generatePDFCover } from '../../../use-cases/generate-pdf-cover';
import { InternalFileType } from '../constants';
import { getFileExtension, isImage } from '../helpers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useImageCover = (file: ApiFile) => {
  const router = useRouter();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [fileLink, setFileLink] = useState<string | null>(null);
  const [imagePDF, setImagePDF] = useState<Blob | null>(null);
  const { editedFile, downloadFile } = API.files;

  const handleGetFile = async () => {
    if (router.query?.file) {
      const queryFile = router.query.file as string;
      const method =
        router.query.editedFile === 'true' ? editedFile : downloadFile;

      return method(queryFile).then((r) => r.url);
    }

    return downloadFile(file.id).then((r) => r.url);
  };

  const loadPdfCover = async (): Promise<void> => {
    setIsImageLoading(true);

    try {
      const pdfFileUrl = await handleGetFile();
      const pdfCover = await generatePDFCover({
        pdfFileUrl,
        width: 640,
      });
      setImagePDF(pdfCover);
    } catch (e) {
      console.log(e);
      throw new Error(e);
    } finally {
      setIsImageLoading(false);
    }
  };

  const loadImageCover = async () => {
    try {
      const fileUrl = await handleGetFile();

      setFileLink(fileUrl);
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  };

  useEffect(() => {
    if (!file) return;

    const isPDF = file.internal_type === InternalFileType.PDF;
    const isImageFile =
      isImage(file.internal_type) ||
      isImage(getFileExtension(file.filename) as InternalFileType);

    if (isPDF) {
      loadPdfCover();
      return;
    }

    if (isImageFile) {
      loadImageCover();
    }
  }, [file]);

  return { isImageLoading, fileLink, imagePDF };
};
