import { useState, type FormEvent } from 'react';

import type { BasicProfileFormValues } from '../../types/profileForm';

import BasicProfilePreview from './BasicProfilePreview';
import { genderOptions } from './formOptions';

import './ProfileForm.css';

function getStringFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === 'string' ? value : '';
}

export default function UncontrolledProfileForm() {
  const [submittedData, setSubmittedData] = useState<BasicProfileFormValues | null>(
    null
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data: BasicProfileFormValues = {
      name: getStringFormValue(formData, 'name'),
      age: getStringFormValue(formData, 'age'),
      email: getStringFormValue(formData, 'email'),
      gender: getStringFormValue(formData, 'gender') as BasicProfileFormValues['gender'],
      termsAccepted: formData.has('termsAccepted'),
    };

    setSubmittedData(data);
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
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

      <button className="app-button" type="submit">
        Collect uncontrolled data
      </button>

      <BasicProfilePreview data={submittedData} />
    </form>
  );
}