import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router';
import ErrorTestButton from '../../components/ErrorTestButton/ErrorTestButton';
import Loader from '../../components/Loader/Loader';
import ResultsList from '../../components/ResultsList/ResultsList';
import Search from '../../components/Search/Search';
import { SEARCH_TERM_KEY } from '../../constants/storage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { fetchCharacters } from '../../services/api';
import type { Item } from '../../types/item';

type SearchPageState = {
  items: Item[];
  isLoading: boolean;
  errorMessage: string;
};

export default function SearchPage() {
  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage(
    SEARCH_TERM_KEY,
    ''
  );

  const [searchPageState, setSearchPageState] = useState<SearchPageState>({
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

        setSearchPageState((currentState) => ({
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

        setSearchPageState((currentState) => ({
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

    setSearchPageState((currentState) => ({
      ...currentState,
      isLoading: true,
      errorMessage: '',
    }));

    setSavedSearchTerm(trimmedSearchTerm);
  }

  return (
    <main className="app">
      <section className="search-section">
        <h1>Search</h1>
        <Link to="/about">About</Link>
        <Search initialSearchTerm={savedSearchTerm} onSearch={handleSearch} />
      </section>

      <section className="results-section">
        <h1>Results</h1>
        {searchPageState.isLoading ? (
          <Loader />
        ) : searchPageState.errorMessage ? (
          <p className="error-message">{searchPageState.errorMessage}</p>
        ) : (
          <ResultsList items={searchPageState.items} />
        )}

        <div className="error-button-wrapper">
          <ErrorTestButton />
        </div>
      </section>

      <Outlet />
    </main>
  );
}
