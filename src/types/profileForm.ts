import type { Gender } from './formSubmission';

export type BasicProfileFormValues = {
  name: string;
  age: string;
  email: string;
  gender: Gender | '';
  termsAccepted: boolean;
};

export type ProfileFormValues = BasicProfileFormValues & {
  country: string;
  password: string;
  confirmPassword: string;
};

export type ReactHookProfileFormValues = ProfileFormValues & {
  image?: FileList;
};

export type UploadedImageData = {
  imageBase64: string;
  imageName: string;
};
