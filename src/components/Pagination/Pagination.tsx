import './Pagination.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  function handlePreviousClick() {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }

  function handleNextClick() {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-button"
        type="button"
        onClick={handlePreviousClick}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            key={page}
            className={
              page === currentPage
                ? 'pagination-button pagination-button-active'
                : 'pagination-button'
            }
            type="button"
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-button"
        type="button"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}
