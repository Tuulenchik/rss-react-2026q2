import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

import { selectCountries } from '../../features/countries/countriesSlice';
import { addFormSubmission } from '../../features/formSubmissions/formSubmissionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type {
  ProfileFormValues,
  UploadedImageData,
} from '../../types/profileForm';
import { validateAndConvertImage } from '../../utils/imageUpload';
import { getPasswordStrength } from '../../utils/passwordStrength';
import {
  getProfileFormValidationErrors,
  type ProfileFormErrors,
} from '../../validation/profileFormErrors';
import { createProfileFormSchema } from '../../validation/profileFormSchema';

import FieldError from './FieldError';
import { genderOptions } from './formOptions';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

import './ProfileForm.css';

type UncontrolledProfileFormProps = {
  onSuccess: () => void;
};

function getStringFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === 'string' ? value : '';
}

function getImageFormValue(formData: FormData) {
  const image = formData.get('image');

  return image instanceof File && image.size > 0 ? image : null;
}

export default function UncontrolledProfileForm({
  onSuccess,
}: UncontrolledProfileFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);

  const profileFormSchema = useMemo(
    () => createProfileFormSchema(countries),
    [countries]
  );

  const [password, setPassword] = useState('');
  const [imageData, setImageData] = useState<UploadedImageData | null>(null);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isImageLoading, setIsImageLoading] = useState(false);

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.currentTarget.value);
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    setImageData(null);
    setErrors((currentErrors) => ({
      ...currentErrors,
      image: undefined,
    }));

    if (!file) {
      return;
    }

    try {
      setIsImageLoading(true);

      const convertedImage = await validateAndConvertImage(file);

      setImageData(convertedImage);
    } catch (error) {
      event.currentTarget.value = '';

      setImageData(null);

      setErrors((currentErrors) => ({
        ...currentErrors,
        image:
          error instanceof Error
            ? error.message
            : 'Please upload a valid PNG or JPEG image.',
      }));
    } finally {
      setIsImageLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const rawData: ProfileFormValues = {
      name: getStringFormValue(formData, 'name'),
      age: getStringFormValue(formData, 'age'),
      email: getStringFormValue(formData, 'email'),
      gender: getStringFormValue(
        formData,
        'gender'
      ) as ProfileFormValues['gender'],
      termsAccepted: formData.has('termsAccepted'),
      country: getStringFormValue(formData, 'country'),
      password: getStringFormValue(formData, 'password'),
      confirmPassword: getStringFormValue(formData, 'confirmPassword'),
      image: getImageFormValue(formData),
    };

    const validationResult = profileFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      setErrors(getProfileFormValidationErrors(validationResult.error));
      return;
    }

    const validatedData = validationResult.data;

    if (!validatedData.image || !imageData) {
      setErrors({
        image: 'Please upload a valid PNG or JPEG image.',
      });
      return;
    }

    setErrors({});

    dispatch(
      addFormSubmission({
        formType: 'uncontrolled',
        name: validatedData.name,
        age: Number(validatedData.age),
        email: validatedData.email,
        gender: validatedData.gender,
        termsAccepted: validatedData.termsAccepted,
        country: validatedData.country,
        imageBase64: imageData.imageBase64,
        imageName: imageData.imageName,
        passwordStrength: getPasswordStrength(validatedData.password),
      })
    );

    event.currentTarget.reset();
    setPassword('');
    setImageData(null);
    onSuccess();
  }
  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <div className="profile-form-field">
        <label htmlFor="uncontrolled-name">Name</label>
        <input
          id="uncontrolled-name"
          name="name"
          type="text"
          aria-invalid={Boolean(errors.name)}
          aria-describedby="uncontrolled-name-error"
        />
        <FieldError id="uncontrolled-name-error" message={errors.name} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-age">Age</label>
        <input
          id="uncontrolled-age"
          name="age"
          type="number"
          aria-invalid={Boolean(errors.age)}
          aria-describedby="uncontrolled-age-error"
        />
        <FieldError id="uncontrolled-age-error" message={errors.age} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-email">Email</label>
        <input
          id="uncontrolled-email"
          name="email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby="uncontrolled-email-error"
        />
        <FieldError id="uncontrolled-email-error" message={errors.email} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-gender">Gender</label>
        <select
          id="uncontrolled-gender"
          name="gender"
          aria-invalid={Boolean(errors.gender)}
          aria-describedby="uncontrolled-gender-error"
        >
          <option value="">Select gender</option>

          {genderOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldError id="uncontrolled-gender-error" message={errors.gender} />
      </div>

      <div className="profile-form-checkbox">
        <input
          id="uncontrolled-terms"
          name="termsAccepted"
          type="checkbox"
          aria-invalid={Boolean(errors.termsAccepted)}
          aria-describedby="uncontrolled-terms-error"
        />
        <label htmlFor="uncontrolled-terms">
          I accept Terms and Conditions
        </label>
      </div>
      <FieldError
        id="uncontrolled-terms-error"
        message={errors.termsAccepted}
      />

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-image">Profile image</label>
        <input
          id="uncontrolled-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleImageChange}
          aria-invalid={Boolean(errors.image)}
          aria-describedby="uncontrolled-image-error"
        />

        {isImageLoading && (
          <p className="profile-form-hint">Loading image...</p>
        )}

        <FieldError id="uncontrolled-image-error" message={errors.image} />

        {imageData && (
          <div className="image-preview">
            <img src={imageData.imageBase64} alt="Uploaded profile preview" />
            <span>{imageData.imageName}</span>
          </div>
        )}
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-password">Password</label>
        <input
          id="uncontrolled-password"
          name="password"
          type="password"
          onChange={handlePasswordChange}
          aria-invalid={Boolean(errors.password)}
          aria-describedby="uncontrolled-password-error"
        />
        <FieldError
          id="uncontrolled-password-error"
          message={errors.password}
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-confirm-password">Confirm password</label>
        <input
          id="uncontrolled-confirm-password"
          name="confirmPassword"
          type="password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby="uncontrolled-confirm-password-error"
        />
        <FieldError
          id="uncontrolled-confirm-password-error"
          message={errors.confirmPassword}
        />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-country">Country</label>
        <input
          id="uncontrolled-country"
          name="country"
          type="text"
          list="uncontrolled-countries"
          autoComplete="off"
          aria-invalid={Boolean(errors.country)}
          aria-describedby="uncontrolled-country-error"
        />

        <datalist id="uncontrolled-countries">
          {countries.map((country) => (
            <option value={country} key={country} />
          ))}
        </datalist>

        <FieldError id="uncontrolled-country-error" message={errors.country} />
      </div>

      <button className="app-button" type="submit" disabled={isImageLoading}>
        Submit uncontrolled form
      </button>
    </form>
  );
}
