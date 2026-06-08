import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { mockSuccessfulFileReader } from '../../test-utils/mockFileReader';

import UncontrolledProfileForm from './UncontrolledProfileForm';

describe('UncontrolledProfileForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('submits valid form data to store and calls onSuccess', async () => {
    mockSuccessfulFileReader();

    const user = userEvent.setup();
    const onSuccess = vi.fn();

    const { store } = renderWithProviders(
      <UncontrolledProfileForm onSuccess={onSuccess} />
    );

    const image = new File(['avatar'], 'avatar.png', {
      type: 'image/png',
    });

    await user.type(screen.getByLabelText('Name'), 'Mariam');
    await user.type(screen.getByLabelText('Age'), '22');
    await user.type(screen.getByLabelText('Email'), 'mariam@example.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.click(screen.getByLabelText(/I accept Terms and Conditions/i));
    await user.upload(screen.getByLabelText('Profile image'), image);
    await user.type(screen.getByLabelText('Password'), 'Test1!');
    await user.type(screen.getByLabelText('Confirm password'), 'Test1!');
    await user.type(screen.getByLabelText('Country'), 'Georgia');

    await user.click(
      screen.getByRole('button', { name: /submit uncontrolled form/i })
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    const submissions = store.getState().formSubmissions.submissions;

    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      formType: 'uncontrolled',
      name: 'Mariam',
      age: 22,
      email: 'mariam@example.com',
      gender: 'female',
      country: 'Georgia',
      imageName: 'avatar.png',
    });
  });
});
