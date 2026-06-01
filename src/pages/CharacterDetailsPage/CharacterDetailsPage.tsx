import type { MouseEvent } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Link, useNavigate, useParams } from 'react-router';
import Loader from '../../components/Loader/Loader';
import { useGetCharacterByIdQuery } from '../../services/charactersApi';
import { getQueryErrorMessage } from '../../services/queryError';
import './CharacterDetailsPage.css';

export default function CharacterDetailsPage() {
  const { characterId, pageNumber } = useParams();
  const navigate = useNavigate();

  const {
    data: character,
    error,
    isLoading,
  } = useGetCharacterByIdQuery(characterId ?? skipToken);

  const errorMessage = getQueryErrorMessage(
    error,
    'Failed to load character',
    'Character not found'
  );

  const closePath = `/page/${pageNumber ?? 1}`;

  function handleBackdropClick() {
    navigate(closePath);
  }

  function handlePanelClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  return (
    <div className="details-backdrop" onClick={handleBackdropClick}>
      <aside
        className="details-panel"
        onClick={handlePanelClick}
        aria-label="Character details"
      >
        <Link className="details-close-link" to={closePath}>
          Close
        </Link>

        {isLoading ? (
          <Loader />
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : character ? (
          <div className="details-content">
            <img
              className="details-image"
              src={character.image}
              alt={character.name}
            />

            <h2>{character.name}</h2>

            <dl className="details-list">
              <div>
                <dt>Status</dt>
                <dd>{character.status}</dd>
              </div>

              <div>
                <dt>Species</dt>
                <dd>{character.species}</dd>
              </div>

              <div>
                <dt>Gender</dt>
                <dd>{character.gender}</dd>
              </div>

              <div>
                <dt>Origin</dt>
                <dd>{character.origin}</dd>
              </div>

              <div>
                <dt>Location</dt>
                <dd>{character.location}</dd>
              </div>

              <div>
                <dt>Episodes</dt>
                <dd>{character.episodesCount}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </aside>
    </div>
  );
}