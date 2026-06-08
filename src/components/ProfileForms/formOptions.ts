import type { Gender } from '../../types/formSubmission';

export const genderOptions: Array<{ value: Gender; label: string }> = [
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'other',
    label: 'Other',
  },
  {
    value: 'prefer-not-to-say',
    label: 'Prefer not to say',
  },
];
