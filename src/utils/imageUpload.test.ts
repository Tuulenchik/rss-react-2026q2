import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  isAllowedImageSize,
  isAllowedImageType,
  validateAndConvertImage,
} from './imageUpload';

function createFile({
  name = 'avatar.png',
  type = 'image/png',
  size = 100,
}: {
  name?: string;
  type?: string;
  size?: number;
}) {
  const file = new File(['a'.repeat(size)], name, { type });

  Object.defineProperty(file, 'size', {
    value: size,
  });

  return file;
}

describe('imageUpload', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('checks allowed image type', () => {
    expect(isAllowedImageType(createFile({ type: 'image/png' }))).toBe(true);
    expect(isAllowedImageType(createFile({ type: 'image/jpeg' }))).toBe(true);
    expect(isAllowedImageType(createFile({ type: 'text/plain' }))).toBe(false);
  });

  it('checks allowed image size', () => {
    expect(isAllowedImageSize(createFile({ size: 1024 }))).toBe(true);
    expect(isAllowedImageSize(createFile({ size: 1024 * 1024 + 1 }))).toBe(
      false
    );
  });

  it('throws for invalid image type', async () => {
    await expect(
      validateAndConvertImage(createFile({ type: 'text/plain' }))
    ).rejects.toThrow('Only PNG and JPEG images are allowed.');
  });

  it('throws for invalid image size', async () => {
    await expect(
      validateAndConvertImage(createFile({ size: 1024 * 1024 + 1 }))
    ).rejects.toThrow('Image size must be 1 MB or smaller.');
  });

  it('converts valid image to base64 data url', async () => {
    const readAsDataURL = vi.fn();

    class MockFileReader {
      result: string | ArrayBuffer | null = null;

      onload:
        | ((this: FileReader, event: ProgressEvent<FileReader>) => unknown)
        | null = null;

      onerror:
        | ((this: FileReader, event: ProgressEvent<FileReader>) => unknown)
        | null = null;

      readAsDataURL(file: Blob) {
        readAsDataURL(file);

        this.result = 'data:image/png;base64,test';

        this.onload?.call(
          this as unknown as FileReader,
          new ProgressEvent('load') as ProgressEvent<FileReader>
        );
      }
    }

    vi.stubGlobal('FileReader', MockFileReader as unknown as typeof FileReader);

    await expect(
      validateAndConvertImage(createFile({ name: 'avatar.png' }))
    ).resolves.toEqual({
      imageBase64: 'data:image/png;base64,test',
      imageName: 'avatar.png',
    });

    expect(readAsDataURL).toHaveBeenCalledOnce();
  });
});
