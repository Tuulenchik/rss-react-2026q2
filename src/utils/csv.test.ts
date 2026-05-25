import { describe, expect, it, vi } from 'vitest';
import { createSelectedItemsCsv, downloadSelectedItemsCsv } from './csv';
import type { SelectedItem } from '../features/selectedItems/selectedItemsSlice';

const selectedItems: SelectedItem[] = [
  {
    id: '1',
    name: 'Rick Sanchez',
    description: 'Alive Human, Male. Origin: Earth.',
    detailsPath: '/page/1/details/1',
  },
  {
    id: '2',
    name: 'Morty "The Kid" Smith',
    description: 'Alive Human\nLocation: Citadel of Ricks.',
    detailsPath: '/page/1/details/2',
  },
];

describe('csv utils', () => {
  it('creates CSV content for selected items', () => {
    const csv = createSelectedItemsCsv(selectedItems);

    expect(csv).toContain('id,name,description,details_url');
    expect(csv).toContain('1,Rick Sanchez');
    expect(csv).toContain('"Alive Human, Male. Origin: Earth."');
    expect(csv).toContain('Morty ""The Kid"" Smith');
    expect(csv).toContain('/page/1/details/1');
  });

  it('downloads selected items as CSV file', () => {
    const createObjectUrlSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:csv-url');

    const revokeObjectUrlSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    downloadSelectedItemsCsv(selectedItems);

    expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:csv-url');

    createObjectUrlSpy.mockRestore();
    revokeObjectUrlSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
