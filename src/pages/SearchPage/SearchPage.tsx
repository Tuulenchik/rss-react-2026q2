import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router';
import ErrorTestButton from '../../components/ErrorTestButton/ErrorTestButton';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import ResultsList from '../../components/ResultsList/ResultsList';
import Search from '../../components/Search/Search';
import { SEARCH_TERM_KEY } from '../../constants/storage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { fetchCharacters } from '../../services/api';
import type { Item } from '../../types/item';
import SelectedItemsFlyout from '../../components/SelectedItemsFlyout/SelectedItemsFlyout';

type SearchPageState = {
  items: Item[];
  isLoading: boolean;
  errorMessage: string;
  totalPages: number;
};

function getValidPageNumber(pageNumber: string | undefined) {
  const parsedPageNumber = Number(pageNumber);

  if (!Number.isInteger(parsedPageNumber) || parsedPageNumber < 1) {
    return 1;
  }

  return parsedPageNumber;
}

function isInvalidPageNumber(pageNumber: string | undefined) {
  const parsedPageNumber = Number(pageNumber);

  return (
    pageNumber === undefined ||
    !Number.isInteger(parsedPageNumber) ||
    parsedPageNumber < 1
  );
}

export default function SearchPage() {
  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage(
    SEARCH_TERM_KEY,
    ''
  );

  const { pageNumber } = useParams();
  const navigate = useNavigate();

  const currentPage = getValidPageNumber(pageNumber);
  const hasInvalidPageNumber = isInvalidPageNumber(pageNumber);

  const [searchPageState, setSearchPageState] = useState<SearchPageState>({
    items: [],
    isLoading: true,
    errorMessage: '',
    totalPages: 1,
  });

  useEffect(() => {
    if (hasInvalidPageNumber) {
      navigate('/page/1', { replace: true });
    }
  }, [hasInvalidPageNumber, navigate]);

  useEffect(() => {
    if (hasInvalidPageNumber) {
      return;
    }

    let isCurrentRequest = true;

    fetchCharacters(savedSearchTerm, currentPage)
      .then(({ items, totalPages }) => {
        if (!isCurrentRequest) {
          return;
        }

        setSearchPageState((currentState) => ({
          ...currentState,
          items,
          totalPages,
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
          totalPages: 1,
          isLoading: false,
          errorMessage,
        }));
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [savedSearchTerm, currentPage, hasInvalidPageNumber]);

  function handleSearch(searchTerm: string) {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === savedSearchTerm && currentPage === 1) {
      return;
    }

    setSearchPageState((currentState) => ({
      ...currentState,
      isLoading: true,
      errorMessage: '',
    }));

    setSavedSearchTerm(trimmedSearchTerm);
    navigate('/page/1');
  }

  function handlePageChange(page: number) {
    if (page === currentPage) {
      return;
    }

    setSearchPageState((currentState) => ({
      ...currentState,
      isLoading: true,
      errorMessage: '',
    }));

    navigate(`/page/${page}`);
  }

  return (
    <main className="app">
      <div className="app-content">
        <div className="app-main-column">
          <section className="search-section">
            <h1>Search</h1>
            <Link to="/about">About</Link>
            <Search
              initialSearchTerm={savedSearchTerm}
              onSearch={handleSearch}
            />
          </section>

          <section className="results-section">
            <h1>Results</h1>

            {searchPageState.isLoading ? (
              <Loader />
            ) : searchPageState.errorMessage ? (
              <p className="error-message">{searchPageState.errorMessage}</p>
            ) : (
              <>
                <ResultsList
                  items={searchPageState.items}
                  currentPage={currentPage}
                />

                {searchPageState.items.length > 0 &&
                  searchPageState.totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={searchPageState.totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                <SelectedItemsFlyout />
              </>
            )}

            <div className="error-button-wrapper">
              <ErrorTestButton />
            </div>
          </section>
        </div>

        <Outlet />
      </div>
    </main>
  );
}
