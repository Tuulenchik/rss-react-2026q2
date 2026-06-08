import { describe, expect, it } from 'vitest';

import { createProfileFormSchema } from './profileFormSchema';

function createImageFile({
  name = 'avatar.png',
  type = 'image/png',
  size = 100,
}: {
  name?: string;
  type?: string;
  size?: number;
} = {}) {
  const file = new File(['avatar'], name, { type });

  Object.defineProperty(file, 'size', {
    value: size,
  });

  return file;
}

const countries = ['Georgia', 'Germany'];

const validData = {
  name: 'Mariam',
  age: '22',
  email: 'mariam@example.com',
  gender: 'female',
  termsAccepted: true,
  country: 'Georgia',
  password: 'Test1!',
  confirmPassword: 'Test1!',
  image: createImageFile(),
};

describe('createProfileFormSchema', () => {
  it('validates correct profile form data', () => {
    const result = createProfileFormSchema(countries).safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('rejects lowercase name, negative age, invalid email and wrong country', () => {
    const result = createProfileFormSchema(countries).safeParse({
      ...validData,
      name: 'mariam',
      age: '-1',
      email: 'mariam@example',
      country: 'Randomland',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);

      expect(messages).toContain('Name must start with an uppercase letter.');
      expect(messages).toContain('Age cannot be negative.');
      expect(messages).toContain(
        'Email must contain one @, local part, and domain with a dot.'
      );
      expect(messages).toContain('Please select a country from the list.');
    }
  });

  it('rejects passwords that do not match', () => {
    const result = createProfileFormSchema(countries).safeParse({
      ...validData,
      confirmPassword: 'Another1!',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Passwords must match.');
    }
  });

  it('rejects missing image', () => {
    const result = createProfileFormSchema(countries).safeParse({
      ...validData,
      image: null,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Profile image is required.');
    }
  });
});
