import type { Gender } from './formSubmission';

export type BasicProfileFormValues = {
  name: string;
  age: string;
  email: string;
  gender: Gender | '';
  termsAccepted: boolean;
};
