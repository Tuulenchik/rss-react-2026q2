import { useEffect } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router';
import ErrorTestButton from '../../components/ErrorTestButton/ErrorTestButton';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import ResultsList from '../../components/ResultsList/ResultsList';
import Search from '../../components/Search/Search';
import { SEARCH_TERM_KEY } from '../../constants/storage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import SelectedItemsFlyout from '../../components/SelectedItemsFlyout/SelectedItemsFlyout';
import { useGetCharactersQuery } from '../../services/charactersApi';
import { getQueryErrorMessage } from '../../services/queryError';
import { charactersApi } from '../../services/charactersApi';
import { useAppDispatch } from '../../store/hooks';
import FormsSection from '../../components/FormsSection/FormsSection';
import FormSubmissionsList from '../../components/FormSubmissionsList/FormSubmissionsList';

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
  const dispatch = useAppDispatch();

  const currentPage = getValidPageNumber(pageNumber);
  const hasInvalidPageNumber = isInvalidPageNumber(pageNumber);

  const { data, error, isLoading, isFetching } = useGetCharactersQuery(
    {
      searchTerm: savedSearchTerm,
      page: currentPage,
    },
    {
      skip: hasInvalidPageNumber,
    }
  );

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const errorMessage = getQueryErrorMessage(error, 'Failed to load characters');

  useEffect(() => {
    if (hasInvalidPageNumber) {
      navigate('/page/1', { replace: true });
    }
  }, [hasInvalidPageNumber, navigate]);

  function handleSearch(searchTerm: string) {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === savedSearchTerm && currentPage === 1) {
      return;
    }

    setSavedSearchTerm(trimmedSearchTerm);
    navigate('/page/1');
  }

  function handlePageChange(page: number) {
    if (page === currentPage) {
      return;
    }

    navigate(`/page/${page}`);
  }

  function handleRefreshResults() {
    if (hasInvalidPageNumber) {
      return;
    }

    dispatch(
      charactersApi.util.invalidateTags([
        {
          type: 'Characters',
          id: `${savedSearchTerm.trim()}-${currentPage}`,
        },
      ])
    );
  }

  return (
    <main className="app">
      <div className="app-content">
        <div className="app-main-column">
          <section className="search-section">
            <h1>Search</h1>
            <Link className="app-link search-about-link" to="/about">
              About
            </Link>

            <Search
              initialSearchTerm={savedSearchTerm}
              onSearch={handleSearch}
            />
          </section>

          <FormsSection />
          <FormSubmissionsList />

          <section className="results-section">
            <h1>Results</h1>

            {isLoading ? (
              <Loader />
            ) : errorMessage ? (
              <>
                <p className="error-message">{errorMessage}</p>

                <button
                  className="app-button refresh-button"
                  type="button"
                  onClick={handleRefreshResults}
                  disabled={isFetching}
                >
                  {isFetching ? 'Refreshing...' : 'Refresh results'}
                </button>
              </>
            ) : (
              <>
                <button
                  className="app-button refresh-button"
                  type="button"
                  onClick={handleRefreshResults}
                  disabled={isFetching}
                >
                  {isFetching ? 'Refreshing...' : 'Refresh results'}
                </button>

                {isFetching && (
                  <p className="query-status-message">Updating results...</p>
                )}

                <ResultsList items={items} currentPage={currentPage} />

                {items.length > 0 && totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
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
