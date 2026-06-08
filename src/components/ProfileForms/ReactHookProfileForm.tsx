import { useState, type ChangeEvent } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';

import { selectCountries } from '../../features/countries/countriesSlice';
import { addFormSubmission } from '../../features/formSubmissions/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { Gender } from '../../types/formSubmission';
import type {
  ReactHookProfileFormValues,
  UploadedImageData,
} from '../../types/profileForm';
import { validateAndConvertImage } from '../../utils/imageUpload';
import { getPasswordStrength } from '../../utils/passwordStrength';

import { genderOptions } from './formOptions';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

import './ProfileForm.css';

type ReactHookProfileFormProps = {
  onSuccess: () => void;
};

const defaultValues: ReactHookProfileFormValues = {
  name: '',
  age: '',
  email: '',
  gender: '',
  termsAccepted: false,
  country: '',
  password: '',
  confirmPassword: '',
};

function isGender(value: string): value is Gender {
  return genderOptions.some((option) => option.value === value);
}

export default function ReactHookProfileForm({
  onSuccess,
}: ReactHookProfileFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);

  const [imageData, setImageData] = useState<UploadedImageData | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const { register, handleSubmit, reset, control } =
    useForm<ReactHookProfileFormValues>({
      defaultValues,
    });
const password =
  useWatch({
    control,
    name: 'password',
    defaultValue: '',
  }) ?? '';

  const imageInputRegistration = register('image');

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    setImageError(null);
    setImageData(null);

    if (!file) {
      return;
    }

    try {
      setIsImageLoading(true);
      const convertedImage = await validateAndConvertImage(file);
      setImageData(convertedImage);
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : 'Failed to upload image.'
      );
    } finally {
      setIsImageLoading(false);
    }
  }

  const onSubmit: SubmitHandler<ReactHookProfileFormValues> = (data) => {
    if (!isGender(data.gender)) {
      setFormError('Please select a gender.');
      return;
    }

    if (!imageData) {
      setFormError('Please upload a valid PNG or JPEG image.');
      return;
    }

    setFormError(null);

    dispatch(
      addFormSubmission({
        formType: 'react-hook-form',
        name: data.name,
        age: Number(data.age),
        email: data.email,
        gender: data.gender,
        termsAccepted: data.termsAccepted,
        country: data.country,
        imageBase64: imageData.imageBase64,
        imageName: imageData.imageName,
        passwordStrength: getPasswordStrength(data.password),
      })
    );

    reset();
    onSuccess();
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <p className="profile-form-error">{formError}</p>}

      <div className="profile-form-field">
        <label htmlFor="rhf-name">Name</label>
        <input id="rhf-name" type="text" {...register('name')} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-age">Age</label>
        <input id="rhf-age" type="number" {...register('age')} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-email">Email</label>
        <input id="rhf-email" type="email" {...register('email')} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-gender">Gender</label>
        <select id="rhf-gender" {...register('gender')}>
          <option value="">Select gender</option>

          {genderOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="profile-form-checkbox">
        <input id="rhf-terms" type="checkbox" {...register('termsAccepted')} />
        <label htmlFor="rhf-terms">I accept Terms and Conditions</label>
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-image">Profile image</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          {...imageInputRegistration}
          onChange={(event) => {
            void imageInputRegistration.onChange(event);
            void handleImageChange(event);
          }}
        />

        {isImageLoading && <p className="profile-form-hint">Loading image...</p>}
        {imageError && <p className="profile-form-error">{imageError}</p>}

        {imageData && (
          <div className="image-preview">
            <img src={imageData.imageBase64} alt="Uploaded profile preview" />
            <span>{imageData.imageName}</span>
          </div>
        )}
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-password">Password</label>
        <input id="rhf-password" type="password" {...register('password')} />
        <PasswordStrengthIndicator password={password} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-confirm-password">Confirm password</label>
        <input
          id="rhf-confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-country">Country</label>
        <input
          id="rhf-country"
          type="text"
          list="rhf-countries"
          autoComplete="off"
          {...register('country')}
        />

        <datalist id="rhf-countries">
          {countries.map((country) => (
            <option value={country} key={country} />
          ))}
        </datalist>
      </div>

      <button className="app-button" type="submit">
        Submit React Hook Form
      </button>
    </form>
  );
}