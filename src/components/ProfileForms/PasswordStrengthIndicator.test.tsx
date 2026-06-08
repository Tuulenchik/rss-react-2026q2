import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PasswordStrengthIndicator from './PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('shows password strength requirements', () => {
    render(<PasswordStrengthIndicator password="Test1!" />);

    expect(screen.getByText('Password strength')).toBeInTheDocument();
    expect(screen.getByText('✓ 1 number')).toBeInTheDocument();
    expect(screen.getByText('✓ 1 uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('✓ 1 lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('✓ 1 special character')).toBeInTheDocument();
  });

  it('shows missing requirements', () => {
    render(<PasswordStrengthIndicator password="abc" />);

    expect(screen.getByText('× 1 number')).toBeInTheDocument();
    expect(screen.getByText('× 1 uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('✓ 1 lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('× 1 special character')).toBeInTheDocument();
  });
});
