import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import FieldError from './FieldError';

describe('FieldError', () => {
  it('renders error message with alert role', () => {
    render(<FieldError id="name-error" message="Name is required." />);

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required.');
  });

  it('keeps space when there is no message', () => {
    render(<FieldError id="name-error" />);

    expect(document.querySelector('#name-error')).toBeInTheDocument();
  });
});
