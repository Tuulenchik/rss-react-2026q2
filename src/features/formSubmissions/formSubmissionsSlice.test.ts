import { describe, expect, it } from 'vitest';

import formSubmissionsReducer, {
  addFormSubmission,
  clearNewestSubmissionHighlight,
} from './formSubmissionsSlice';

describe('formSubmissionsSlice', () => {
  it('adds a form submission and marks it as newest', () => {
    const state = formSubmissionsReducer(
      undefined,
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

    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].name).toBe('Mariam');
    expect(state.newestSubmissionId).toBe(state.submissions[0].id);
  });

  it('clears newest submission highlight', () => {
    const stateWithSubmission = formSubmissionsReducer(
      undefined,
      addFormSubmission({
        formType: 'react-hook-form',
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

    const state = formSubmissionsReducer(
      stateWithSubmission,
      clearNewestSubmissionHighlight()
    );

    expect(state.newestSubmissionId).toBeNull();
  });
});
