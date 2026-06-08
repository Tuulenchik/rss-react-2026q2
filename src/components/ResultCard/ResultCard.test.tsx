import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import ResultCard from './ResultCard';
import { mockItems } from '../../test-utils/mockItems';

describe('ResultCard', () => {
  it('renders item data and details link', () => {
    render(
      <MemoryRouter>
        <ResultCard
          item={mockItems[0]}
          detailsPath="/page/1/details/1"
          isSelected={false}
          onToggleSelection={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(mockItems[0].name)).toBeInTheDocument();

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/page/1/details/1'
    );
  });

  it('calls onToggleSelection when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const handleToggleSelection = vi.fn();

    const { container } = render(
      <MemoryRouter>
        <ResultCard
          item={mockItems[0]}
          detailsPath="/page/1/details/1"
          isSelected={false}
          onToggleSelection={handleToggleSelection}
        />
      </MemoryRouter>
    );

    await user.click(within(container).getByRole('checkbox'));

    expect(handleToggleSelection).toHaveBeenCalledTimes(1);
  });
});
