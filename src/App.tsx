import './App.css';
import ErrorTestButton from './components/ErrorTestButton/ErrorTestButton';
import Search from './components/Search/Search';
import { fetchCharacters } from './services/api';
import ResultsList from './components/ResultsList/ResultsList';
import type { Item } from './types/item';
import Loader from './components/Loader/Loader';
import { useState, useEffect } from 'react';
import { SEARCH_TERM_KEY } from './constants/storage';
import { useLocalStorage } from './hooks/useLocalStorage';

type AppState = {
  items: Item[];
  isLoading: boolean;
  errorMessage: string;
};
export default function App() {
  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage(
    SEARCH_TERM_KEY,
    ''
  );

  const [appState, setAppState] = useState<AppState>({
    items: [],
    isLoading: true,
    errorMessage: '',
  });

  useEffect(() => {
    let isCurrentRequest = true;

    fetchCharacters(savedSearchTerm)
      .then((items) => {
        if (!isCurrentRequest) {
          return;
        }

        setAppState((currentState) => ({
          ...currentState,
          items,
          isLoading: false,
          errorMessage: '',
        }));
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) {
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : 'No results were found';

        setAppState((currentState) => ({
          ...currentState,
          items: [],
          isLoading: false,
          errorMessage,
        }));
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [savedSearchTerm]);

  function handleSearch(searchTerm: string) {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === savedSearchTerm) {
      return;
    }

    setSavedSearchTerm(trimmedSearchTerm);
  }

  return (
    <main className="app">
      <section className="search-section">
        <h1>Search</h1>
        <Search initialSearchTerm={savedSearchTerm} onSearch={handleSearch} />
      </section>

      <section className="results-section">
        <h1>Results</h1>
        {appState.isLoading ? (
          <Loader />
        ) : appState.errorMessage ? (
          <p className="error-message">{appState.errorMessage}</p>
        ) : (
          <ResultsList items={appState.items} />
        )}
        <div className="error-button-wrapper">
          <ErrorTestButton />
        </div>
      </section>
    </main>
  );
}
