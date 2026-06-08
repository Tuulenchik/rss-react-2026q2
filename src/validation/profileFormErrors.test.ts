import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { getProfileFormValidationErrors } from './profileFormErrors';

describe('getProfileFormValidationErrors', () => {
  it('maps zod issues to form field errors', () => {
    const schema = z.object({
      name: z.string().min(1, 'Name is required.'),
      email: z.string().min(1, 'Email is required.'),
    });

    const result = schema.safeParse({
      name: '',
      email: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(getProfileFormValidationErrors(result.error)).toEqual({
        name: 'Name is required.',
        email: 'Email is required.',
      });
    }
  });

  it('keeps the first error for the same field', () => {
    const schema = z.object({
      name: z.string().min(1, 'First error.').min(3, 'Second error.'),
    });

    const result = schema.safeParse({
      name: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(getProfileFormValidationErrors(result.error)).toEqual({
        name: 'First error.',
      });
    }
  });
});
