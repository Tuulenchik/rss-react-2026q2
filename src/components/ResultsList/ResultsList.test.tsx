import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResultsList from './ResultsList';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { mockItems } from '../../test-utils/mockItems';

describe('ResultsList', () => {
  it('renders all provided items with links to details pages', () => {
    const { container } = renderWithProviders(
      <ResultsList items={mockItems} currentPage={1} />
    );

    expect(screen.getByText(mockItems[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockItems[1].name)).toBeInTheDocument();

    const links = within(container).getAllByRole('link');

    expect(links[0]).toHaveAttribute('href', '/page/1/details/1');
    expect(links[1]).toHaveAttribute('href', '/page/1/details/2');
  });

  it('renders empty list when items array is empty', () => {
    const { container } = renderWithProviders(
      <ResultsList items={[]} currentPage={1} />
    );

    expect(container.querySelector('.results-list')).toBeInTheDocument();
    expect(within(container).queryAllByRole('article')).toHaveLength(0);
  });
});
