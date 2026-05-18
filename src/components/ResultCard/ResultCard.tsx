import { Link } from 'react-router';
import type { Item } from '../../types/item';
import './ResultCard.css';

type ResultCardProps = {
  item: Item;
  detailsPath: string;
};

export default function ResultCard({ item, detailsPath }: ResultCardProps) {
  return (
    <Link className="result-card-link" to={detailsPath}>
      <article className="result-card">
        <h3 className="result-card-title">{item.name}</h3>
        <p className="result-card-description">{item.description}</p>
      </article>
    </Link>
  );
}
