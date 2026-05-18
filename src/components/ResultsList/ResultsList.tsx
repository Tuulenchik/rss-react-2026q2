import type { Item } from '../../types/item';
import ResultCard from '../ResultCard/ResultCard';
import './ResultsList.css';

type ResultsListProps = {
  items: Item[];
  currentPage: number;
};

export default function ResultsList({ items, currentPage }: ResultsListProps) {
  if (items.length === 0) {
    return <p className="results-empty">No results yet</p>;
  }

  return (
    <div className="results-list">
      {items.map((item) => (
        <ResultCard
          key={item.id}
          item={item}
          detailsPath={`/page/${currentPage}/details/${item.id}`}
        />
      ))}
    </div>
  );
}
