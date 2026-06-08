import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BasicProfilePreview from './BasicProfilePreview';

describe('BasicProfilePreview', () => {
  it('renders nothing when data is missing', () => {
    const { container } = render(<BasicProfilePreview data={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders submitted basic data', () => {
    render(
      <BasicProfilePreview
        data={{
          name: 'Mariam',
          age: '22',
          email: 'mariam@example.com',
          gender: 'female',
          termsAccepted: true,
        }}
      />
    );

    expect(screen.getByText('Collected basic data')).toBeInTheDocument();
    expect(screen.getByText('Mariam')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('mariam@example.com')).toBeInTheDocument();
    expect(screen.getByText('female')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });
});
