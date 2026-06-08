import { useState, type ChangeEvent, type FormEvent } from 'react';

import { addFormSubmission } from '../../features/formSubmissions/formSubmissionsSlice';
import { selectCountries } from '../../features/countries/countriesSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { Gender } from '../../types/formSubmission';
import type { UploadedImageData } from '../../types/profileForm';
import { validateAndConvertImage } from '../../utils/imageUpload';
import { getPasswordStrength } from '../../utils/passwordStrength';

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

function isGender(value: string): value is Gender {
  return genderOptions.some((option) => option.value === value);
}

export default function UncontrolledProfileForm({
  onSuccess,
}: UncontrolledProfileFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);

  const [password, setPassword] = useState('');
  const [imageData, setImageData] = useState<UploadedImageData | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.currentTarget.value);
  }

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const genderValue = getStringFormValue(formData, 'gender');

    if (!isGender(genderValue)) {
      setFormError('Please select a gender.');
      return;
    }

    if (!imageData) {
      setFormError('Please upload a valid PNG or JPEG image.');
      return;
    }

    setFormError(null);

    const passwordValue = getStringFormValue(formData, 'password');

    dispatch(
      addFormSubmission({
        formType: 'uncontrolled',
        name: getStringFormValue(formData, 'name'),
        age: Number(getStringFormValue(formData, 'age')),
        email: getStringFormValue(formData, 'email'),
        gender: genderValue,
        termsAccepted: formData.has('termsAccepted'),
        country: getStringFormValue(formData, 'country'),
        imageBase64: imageData.imageBase64,
        imageName: imageData.imageName,
        passwordStrength: getPasswordStrength(passwordValue),
      })
    );

    event.currentTarget.reset();
    onSuccess();
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      {formError && <p className="profile-form-error">{formError}</p>}

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-name">Name</label>
        <input id="uncontrolled-name" name="name" type="text" />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-age">Age</label>
        <input id="uncontrolled-age" name="age" type="number" />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-email">Email</label>
        <input id="uncontrolled-email" name="email" type="email" />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-gender">Gender</label>
        <select id="uncontrolled-gender" name="gender">
          <option value="">Select gender</option>

          {genderOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="profile-form-checkbox">
        <input id="uncontrolled-terms" name="termsAccepted" type="checkbox" />
        <label htmlFor="uncontrolled-terms">I accept Terms and Conditions</label>
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-image">Profile image</label>
        <input
          id="uncontrolled-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleImageChange}
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
        <label htmlFor="uncontrolled-password">Password</label>
        <input
          id="uncontrolled-password"
          name="password"
          type="password"
          onChange={handlePasswordChange}
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      <div className="profile-form-field">
        <label htmlFor="uncontrolled-confirm-password">Confirm password</label>
        <input
          id="uncontrolled-confirm-password"
          name="confirmPassword"
          type="password"
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
        />

        <datalist id="uncontrolled-countries">
          {countries.map((country) => (
            <option value={country} key={country} />
          ))}
        </datalist>
      </div>

      <button className="app-button" type="submit">
        Submit uncontrolled form
      </button>
    </form>
  );
}