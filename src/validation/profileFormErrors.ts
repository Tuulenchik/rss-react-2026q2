import type { ZodError } from 'zod';

import type { ProfileFormValues } from '../types/profileForm';

export type ProfileFormErrors = Partial<
  Record<keyof ProfileFormValues, string>
>;

const profileFormFields = [
  'name',
  'age',
  'email',
  'gender',
  'termsAccepted',
  'country',
  'password',
  'confirmPassword',
  'image',
] as const satisfies ReadonlyArray<keyof ProfileFormValues>;

function isProfileFormField(value: unknown): value is keyof ProfileFormValues {
  return (
    typeof value === 'string' &&
    profileFormFields.includes(value as keyof ProfileFormValues)
  );
}

export function getProfileFormValidationErrors(
  error: ZodError
): ProfileFormErrors {
  return error.issues.reduce<ProfileFormErrors>((errors, issue) => {
    const field = issue.path[0];

    if (isProfileFormField(field) && !errors[field]) {
      errors[field] = issue.message;
    }

    return errors;
  }, {});
}
