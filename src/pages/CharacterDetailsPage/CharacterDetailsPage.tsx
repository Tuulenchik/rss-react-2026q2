import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import Loader from '../../components/Loader/Loader';
import { fetchCharacterById } from '../../services/api';
import type { CharacterDetails } from '../../types/item';
import './CharacterDetailsPage.css';

type CharacterDetailsPageState = {
  character: CharacterDetails | null;
  errorMessage: string;
};

export default function CharacterDetailsPage() {
  const { characterId, pageNumber } = useParams();

  const [characterDetailsState, setCharacterDetailsState] =
    useState<CharacterDetailsPageState>({
      character: null,
      errorMessage: '',
    });

  const isLoadedCharacter = characterDetailsState.character?.id === characterId;

  const isLoading = !characterDetailsState.errorMessage && !isLoadedCharacter;

  useEffect(() => {
    if (!characterId) {
      return;
    }

    let isCurrentRequest = true;

    fetchCharacterById(characterId)
      .then((character) => {
        if (!isCurrentRequest) {
          return;
        }

        setCharacterDetailsState({
          character,
          errorMessage: '',
        });
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) {
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load character';

        setCharacterDetailsState({
          character: null,
          errorMessage,
        });
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [characterId]);

  const closePath = `/page/${pageNumber ?? 1}`;

  return (
    <aside className="details-panel">
      <Link className="details-close-link" to={closePath}>
        Close
      </Link>

      {isLoading ? (
        <Loader />
      ) : characterDetailsState.errorMessage ? (
        <p className="error-message">{characterDetailsState.errorMessage}</p>
      ) : characterDetailsState.character ? (
        <div className="details-content">
          <img
            className="details-image"
            src={characterDetailsState.character.image}
            alt={characterDetailsState.character.name}
          />

          <h2>{characterDetailsState.character.name}</h2>

          <dl className="details-list">
            <div>
              <dt>Status</dt>
              <dd>{characterDetailsState.character.status}</dd>
            </div>

            <div>
              <dt>Species</dt>
              <dd>{characterDetailsState.character.species}</dd>
            </div>

            <div>
              <dt>Gender</dt>
              <dd>{characterDetailsState.character.gender}</dd>
            </div>

            <div>
              <dt>Origin</dt>
              <dd>{characterDetailsState.character.origin}</dd>
            </div>

            <div>
              <dt>Location</dt>
              <dd>{characterDetailsState.character.location}</dd>
            </div>

            <div>
              <dt>Episodes</dt>
              <dd>{characterDetailsState.character.episodesCount}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </aside>
  );
}
