import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils/renderWithProviders';

import FormsSection from './FormsSection';

describe('FormsSection', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modal-root"></div>';
  });

  it('opens uncontrolled form in modal', async () => {
    const user = userEvent.setup();

    renderWithProviders(<FormsSection />);

    await user.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled form')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('opens React Hook Form in modal', async () => {
    const user = userEvent.setup();

    renderWithProviders(<FormsSection />);

    await user.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
});
