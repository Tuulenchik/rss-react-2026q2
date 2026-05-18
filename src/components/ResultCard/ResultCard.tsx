import type { Item } from '../../types/item';
import './ResultCard.css';

type ResultCardProps = {
  item: Item;
};

export default function ResultCard({ item }: ResultCardProps) {
  return (
    <article className="result-card">
      <h3 className="result-card-title">{item.name}</h3>
      <p className="result-card-description">{item.description}</p>
    </article>
  );
}
