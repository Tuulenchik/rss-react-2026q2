import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { addFormSubmission } from '../../features/formSubmissions/formSubmissionsSlice';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

import FormSubmissionsList from './FormSubmissionsList';

describe('FormSubmissionsList', () => {
  it('renders empty message when there are no submissions', () => {
    renderWithProviders(<FormSubmissionsList />);

    expect(screen.getByText('Submitted profiles')).toBeInTheDocument();
    expect(screen.getByText(/No submitted profiles yet/i)).toBeInTheDocument();
  });

  it('renders submitted profile card', () => {
    const { store } = renderWithProviders(<FormSubmissionsList />);

    store.dispatch(
      addFormSubmission({
        formType: 'uncontrolled',
        name: 'Mariam',
        age: 22,
        email: 'mariam@example.com',
        gender: 'female',
        termsAccepted: true,
        country: 'Georgia',
        imageBase64: 'data:image/png;base64,test',
        imageName: 'avatar.png',
        passwordStrength: {
          hasNumber: true,
          hasUppercase: true,
          hasLowercase: true,
          hasSpecialCharacter: true,
        },
      })
    );

    renderWithProviders(<FormSubmissionsList />);

    expect(screen.getByText('Mariam')).toBeInTheDocument();
    expect(screen.getByText('mariam@example.com')).toBeInTheDocument();
    expect(screen.getByText('Georgia')).toBeInTheDocument();
  });
});
