export type FormImplementation = 'uncontrolled' | 'react-hook-form';

export type Gender = 'female' | 'male' | 'other' | 'prefer-not-to-say';

export type PasswordStrength = {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialCharacter: boolean;
};

export type FormSubmission = {
  id: string;
  formType: FormImplementation;
  submittedAt: string;

  name: string;
  age: number;
  email: string;
  gender: Gender;
  termsAccepted: boolean;

  country: string;
  imageBase64: string;
  imageName: string;

  passwordStrength: PasswordStrength;
};

export type CreateFormSubmissionPayload = Omit<
  FormSubmission,
  'id' | 'submittedAt'
>;
