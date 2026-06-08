import { describe, expect, it } from 'vitest';

import { isBasicEmailValid } from './emailValidation';

describe('isBasicEmailValid', () => {
  it('returns true for email with one at sign and domain dot', () => {
    expect(isBasicEmailValid('test@example.com')).toBe(true);
  });

  it('returns false when email has no domain dot', () => {
    expect(isBasicEmailValid('test@example')).toBe(false);
  });

  it('returns false when email has more than one at sign', () => {
    expect(isBasicEmailValid('test@@example.com')).toBe(false);
  });
});
