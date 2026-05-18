import { Link, useParams } from 'react-router';

export default function CharacterDetailsPage() {
  const { characterId, pageNumber } = useParams();

  return (
    <aside className="details-panel">
      <h2>Character details</h2>
      <p>Selected character ID: {characterId}</p>

      <Link to={`/page/${pageNumber ?? 1}`}>Close details</Link>
    </aside>
  );
}
