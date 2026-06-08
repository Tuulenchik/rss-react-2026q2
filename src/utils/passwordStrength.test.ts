import { describe, expect, it } from 'vitest';

import { getPasswordStrength } from './passwordStrength';

describe('getPasswordStrength', () => {
  it('detects password strength requirements', () => {
    expect(getPasswordStrength('Test1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: true,
    });
  });

  it('returns false for missing requirements', () => {
    expect(getPasswordStrength('abc')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: true,
      hasSpecialCharacter: false,
    });
  });
});
