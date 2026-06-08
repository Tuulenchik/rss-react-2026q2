import { vi } from 'vitest';

export function mockSuccessfulFileReader() {
  class MockFileReader {
    result: string | ArrayBuffer | null = null;

    onload:
      | ((this: FileReader, event: ProgressEvent<FileReader>) => unknown)
      | null = null;

    onerror:
      | ((this: FileReader, event: ProgressEvent<FileReader>) => unknown)
      | null = null;

    readAsDataURL() {
      this.result = 'data:image/png;base64,test';

      this.onload?.call(
        this as unknown as FileReader,
        new ProgressEvent('load') as ProgressEvent<FileReader>
      );
    }
  }

  vi.stubGlobal('FileReader', MockFileReader as unknown as typeof FileReader);
}
