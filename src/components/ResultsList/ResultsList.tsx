import type { Item } from '../../types/item';
import ResultCard from '../ResultCard/ResultCard';
import './ResultsList.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSelectedItem } from '../../features/selectedItems/selectedItemsSlice';

type ResultsListProps = {
  items: Item[];
  currentPage: number;
};

export default function ResultsList({ items, currentPage }: ResultsListProps) {
  const dispatch = useAppDispatch();

  const selectedItemsById = useAppSelector(
    (state) => state.selectedItems.itemsById
  );

  return (
    <div className="results-list">
      {items.map((item) => {
        const detailsPath = `/page/${currentPage}/details/${item.id}`;
        const isSelected = Boolean(selectedItemsById[item.id]);

        return (
          <ResultCard
            key={item.id}
            item={item}
            detailsPath={detailsPath}
            isSelected={isSelected}
            onToggleSelection={() =>
              dispatch(
                toggleSelectedItem({
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  detailsPath,
                })
              )
            }
          />
        );
      })}
    </div>
  );
}
