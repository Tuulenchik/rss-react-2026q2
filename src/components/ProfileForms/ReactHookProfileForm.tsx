import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, type ChangeEvent } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';

import { selectCountries } from '../../features/countries/countriesSlice';
import { addFormSubmission } from '../../features/formSubmissions/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type {
  ProfileFormValues,
  UploadedImageData,
} from '../../types/profileForm';
import { validateAndConvertImage } from '../../utils/imageUpload';
import { getPasswordStrength } from '../../utils/passwordStrength';
import { createProfileFormSchema } from '../../validation/profileFormSchema';

import FieldError from './FieldError';
import { genderOptions } from './formOptions';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

import './ProfileForm.css';

type ReactHookProfileFormProps = {
  onSuccess: () => void;
};

const defaultValues: ProfileFormValues = {
  name: '',
  age: '',
  email: '',
  gender: '',
  termsAccepted: false,
  country: '',
  password: '',
  confirmPassword: '',
  image: null,
};

export default function ReactHookProfileForm({
  onSuccess,
}: ReactHookProfileFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);

  const profileFormSchema = useMemo(
    () => createProfileFormSchema(countries),
    [countries]
  );

  const [imageData, setImageData] = useState<UploadedImageData | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileFormValues>({
    defaultValues,
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const password =
    useWatch({
      control,
      name: 'password',
      defaultValue: '',
    }) ?? '';

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;

    setValue('image', file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setImageData(null);

    if (!file) {
      return;
    }

    try {
      setIsImageLoading(true);
      const convertedImage = await validateAndConvertImage(file);
      setImageData(convertedImage);
    } catch {
      setImageData(null);
    } finally {
      setIsImageLoading(false);
    }
  }

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    if (!data.image || !imageData || data.gender === '') {
      return;
    }

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

    reset(defaultValues);
    setImageData(null);
    onSuccess();
  };
  return (
    <form className="profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="profile-form-field">
        <label htmlFor="rhf-name">Name</label>
        <input
          id="rhf-name"
          type="text"
          aria-invalid={Boolean(errors.name)}
          aria-describedby="rhf-name-error"
          {...register('name')}
        />
        <FieldError id="rhf-name-error" message={errors.name?.message} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-age">Age</label>
        <input
          id="rhf-age"
          type="number"
          aria-invalid={Boolean(errors.age)}
          aria-describedby="rhf-age-error"
          {...register('age')}
        />
        <FieldError id="rhf-age-error" message={errors.age?.message} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-email">Email</label>
        <input
          id="rhf-email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby="rhf-email-error"
          {...register('email')}
        />
        <FieldError id="rhf-email-error" message={errors.email?.message} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-gender">Gender</label>
        <select
          id="rhf-gender"
          aria-invalid={Boolean(errors.gender)}
          aria-describedby="rhf-gender-error"
          {...register('gender')}
        >
          <option value="">Select gender</option>

          {genderOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldError id="rhf-gender-error" message={errors.gender?.message} />
      </div>

      <div className="profile-form-checkbox">
        <input
          id="rhf-terms"
          type="checkbox"
          aria-invalid={Boolean(errors.termsAccepted)}
          aria-describedby="rhf-terms-error"
          {...register('termsAccepted')}
        />
        <label htmlFor="rhf-terms">I accept Terms and Conditions</label>
      </div>
      <FieldError
        id="rhf-terms-error"
        message={errors.termsAccepted?.message}
      />

      <div className="profile-form-field">
        <label htmlFor="rhf-image">Profile image</label>
        <input
          id="rhf-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleImageChange}
          aria-invalid={Boolean(errors.image)}
          aria-describedby="rhf-image-error"
        />

        {isImageLoading && (
          <p className="profile-form-hint">Loading image...</p>
        )}

        <FieldError id="rhf-image-error" message={errors.image?.message} />

        {imageData && (
          <div className="image-preview">
            <img src={imageData.imageBase64} alt="Uploaded profile preview" />
            <span>{imageData.imageName}</span>
          </div>
        )}
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-password">Password</label>
        <input
          id="rhf-password"
          type="password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby="rhf-password-error"
          {...register('password')}
        />
        <FieldError
          id="rhf-password-error"
          message={errors.password?.message}
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-confirm-password">Confirm password</label>
        <input
          id="rhf-confirm-password"
          type="password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby="rhf-confirm-password-error"
          {...register('confirmPassword')}
        />
        <FieldError
          id="rhf-confirm-password-error"
          message={errors.confirmPassword?.message}
        />
      </div>

      <div className="profile-form-field">
        <label htmlFor="rhf-country">Country</label>
        <input
          id="rhf-country"
          type="text"
          list="rhf-countries"
          autoComplete="off"
          aria-invalid={Boolean(errors.country)}
          aria-describedby="rhf-country-error"
          {...register('country')}
        />

        <datalist id="rhf-countries">
          {countries.map((country) => (
            <option value={country} key={country} />
          ))}
        </datalist>

        <FieldError id="rhf-country-error" message={errors.country?.message} />
      </div>

      <button
        className="app-button"
        type="submit"
        disabled={!isValid || isImageLoading}
      >
        Submit React Hook Form
      </button>
    </form>
  );
}
