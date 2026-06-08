import type { UploadedImageData } from '../types/profileForm';

const MAX_IMAGE_SIZE_BYTES = 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];

export function isAllowedImageType(file: File) {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export function isAllowedImageSize(file: File) {
  return file.size <= MAX_IMAGE_SIZE_BYTES;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to read image file.'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.readAsDataURL(file);
  });
}

export async function validateAndConvertImage(
  file: File
): Promise<UploadedImageData> {
  if (!isAllowedImageType(file)) {
    throw new Error('Only PNG and JPEG images are allowed.');
  }

  if (!isAllowedImageSize(file)) {
    throw new Error('Image size must be 1 MB or smaller.');
  }

  const imageBase64 = await readFileAsDataUrl(file);

  return {
    imageBase64,
    imageName: file.name,
  };
}
