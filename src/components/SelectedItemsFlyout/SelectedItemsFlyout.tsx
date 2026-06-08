import { useMemo } from 'react';
import { clearSelectedItems } from '../../features/selectedItems/selectedItemsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { downloadSelectedItemsCsv } from '../../utils/csv';
import './SelectedItemsFlyout.css';

export default function SelectedItemsFlyout() {
  const dispatch = useAppDispatch();

  const selectedItemsById = useAppSelector(
    (state) => state.selectedItems.itemsById
  );

  const selectedItems = useMemo(
    () => Object.values(selectedItemsById),
    [selectedItemsById]
  );

  const selectedItemsCount = selectedItems.length;

  if (selectedItemsCount === 0) {
    return null;
  }

  function handleClearSelectedItems() {
    dispatch(clearSelectedItems());
  }

  function handleDownload() {
    downloadSelectedItemsCsv(selectedItems);
  }

  return (
    <aside
      className="selected-items-flyout"
      aria-label="Selected items actions"
    >
      <p className="selected-items-flyout__count">
        Selected items: {selectedItemsCount}
      </p>

      <div className="selected-items-flyout__actions">
        <button type="button" onClick={handleClearSelectedItems}>
          Unselect all
        </button>

        <button type="button" onClick={handleDownload}>
          Download
        </button>
      </div>
    </aside>
  );
}
