import './App.css';
import ErrorTestButton from './components/ErrorTestButton/ErrorTestButton';
import Search from './components/Search/Search';
import { fetchCharacters } from './services/api';
import ResultsList from './components/ResultsList/ResultsList';
import type { Item } from './types/item';
import Loader from './components/Loader/Loader';
import { useState, useEffect } from 'react';

type AppState = {
  items: Item[];
  isLoading: boolean;
  errorMessage: string;
  lastSearchTerm: string;
};
export default function App() {
  const [appState, setAppState] = useState<AppState>(() => ({
    items: [],
    isLoading: true,
    errorMessage: '',
    lastSearchTerm: localStorage.getItem('searchTerm')?.trim() ?? '',
  }));

  useEffect(() => {
    const savedSearchTerm = localStorage.getItem('searchTerm')?.trim() ?? '';
    fetchCharacters(savedSearchTerm)
      .then((items) => {
        setAppState((a) => ({
          ...a,
          items,
          isLoading: false,
          errorMessage: '',
        }));
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Something went wrong';
        setAppState((a) => ({
          ...a,
          items: [],
          isLoading: false,
          errorMessage,
        }));
      });
  }, []);

  function handleSearch(searchTerm: string) {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === appState.lastSearchTerm) {
      return;
    }

    localStorage.setItem('searchTerm', trimmedSearchTerm);

    setAppState((a)=>(
      {
      ...a,
      isLoading: true,
      errorMessage: '',
      lastSearchTerm: trimmedSearchTerm,
    }
    ));

    fetchCharacters(trimmedSearchTerm)
      .then((items) => {
        setAppState((a) => ({
          ...a,
          items,
          isLoading: false,
          errorMessage: '',
        }));
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'No results were found';

        setAppState((a) => ({
          ...a,
          items: [],
          isLoading: false,
          errorMessage,
        }));
      });
  }

  return (
    <main className="app">
      <section className="search-section">
        <h1>Search</h1>
        <Search onSearch={handleSearch} />
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
