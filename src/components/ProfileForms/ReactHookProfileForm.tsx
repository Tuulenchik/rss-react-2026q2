import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import type { BasicProfileFormValues } from '../../types/profileForm';

import BasicProfilePreview from './BasicProfilePreview';
import { genderOptions } from './formOptions';

import './ProfileForm.css';

const defaultValues: BasicProfileFormValues = {
  name: '',
  age: '',
  email: '',
  gender: '',
  termsAccepted: false,
};

export default function ReactHookProfileForm() {
  const [submittedData, setSubmittedData] = useState<BasicProfileFormValues | null>(
    null
  );

  const { register, handleSubmit } = useForm<BasicProfileFormValues>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<BasicProfileFormValues> = (data) => {
    setSubmittedData(data);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

      <button className="app-button" type="submit">
        Collect React Hook Form data
      </button>

      <BasicProfilePreview data={submittedData} />
    </form>
  );
}