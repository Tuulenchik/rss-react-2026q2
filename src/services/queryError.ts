import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type QueryError = FetchBaseQueryError | SerializedError | undefined;

export function getQueryErrorMessage(
  error: QueryError,
  fallbackMessage = 'Something went wrong',
  notFoundMessage = 'No characters found'
): string {
  if (!error) {
    return '';
  }

  if ('status' in error) {
    if (error.status === 404) {
      return notFoundMessage;
    }

    return fallbackMessage;
  }

  return error.message ?? fallbackMessage;
}
