import { z } from 'zod';

import type { Gender } from '../types/formSubmission';
import { isBasicEmailValid } from '../utils/emailValidation';
import { isAllowedImageSize, isAllowedImageType } from '../utils/imageUpload';

const genderValues = [
  'female',
  'male',
  'other',
  'prefer-not-to-say',
] as const satisfies readonly Gender[];

function startsWithUppercase(value: string) {
  if (value.length === 0) {
    return true;
  }

  const firstLetter = value[0];

  return (
    firstLetter === firstLetter.toUpperCase() &&
    firstLetter !== firstLetter.toLowerCase()
  );
}

function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File && value.size > 0;
}

export function createProfileFormSchema(countries: string[]) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, 'Name is required.')
        .refine(
          startsWithUppercase,
          'Name must start with an uppercase letter.'
        ),

      age: z
        .string()
        .trim()
        .min(1, 'Age is required.')
        .refine((value) => !Number.isNaN(Number(value)), {
          message: 'Age must be a number.',
        })
        .refine((value) => Number(value) >= 0, {
          message: 'Age cannot be negative.',
        }),

      email: z
        .string()
        .trim()
        .min(1, 'Email is required.')
        .refine(isBasicEmailValid, {
          message:
            'Email must contain one @, local part, and domain with a dot.',
        }),

      gender: z
        .enum(genderValues)
        .or(z.literal(''))
        .refine((value): value is Gender => value !== '', {
          message: 'Please select a gender.',
        }),

      termsAccepted: z.boolean().refine((value) => value, {
        message: 'You must accept Terms and Conditions.',
      }),

      country: z
        .string()
        .trim()
        .min(1, 'Country is required.')
        .refine((value) => countries.includes(value), {
          message: 'Please select a country from the list.',
        }),

      password: z.string().min(1, 'Password is required.'),

      confirmPassword: z.string().min(1, 'Please confirm your password.'),

      image: z
        .custom<File | null>(isFile, {
          message: 'Profile image is required.',
        })
        .refine((file) => file !== null && isAllowedImageType(file), {
          message: 'Only PNG and JPEG images are allowed.',
        })
        .refine((file) => file !== null && isAllowedImageSize(file), {
          message: 'Image size must be 1 MB or smaller.',
        }),
    })
    .superRefine((values, context) => {
      if (values.password !== values.confirmPassword) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Passwords must match.',
          path: ['confirmPassword'],
        });
      }
    });
}
