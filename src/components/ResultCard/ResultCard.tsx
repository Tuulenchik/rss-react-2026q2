import { Link } from 'react-router';
import type { Item } from '../../types/item';
import './ResultCard.css';

type ResultCardProps = {
  item: Item;
  detailsPath: string;
  isSelected: boolean;
  onToggleSelection: () => void;
};

export default function ResultCard({
  item,
  detailsPath,
  isSelected,
  onToggleSelection,
}: ResultCardProps) {
  return (
    <article className="result-card">
      <label className="result-card__checkbox-label">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="result-card__checkbox"
        />
        <span>Select</span>
      </label>

      <Link className="result-card-link" to={detailsPath}>
        <h2 className="result-card-title">{item.name}</h2>
        <p className="result-card-description">{item.description}</p>
      </Link>
    </article>
  );
}
