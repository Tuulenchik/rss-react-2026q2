import './Pagination.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

function getVisiblePageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  if (currentPage <= 4) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
    pages.add(5);
  }

  if (currentPage >= totalPages - 3) {
    pages.add(totalPages - 4);
    pages.add(totalPages - 3);
    pages.add(totalPages - 2);
    pages.add(totalPages - 1);
  }

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((firstPage, secondPage) => firstPage - secondPage);

  const pageItems: PageItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      pageItems.push(index === 1 ? 'ellipsis-start' : 'ellipsis-end');
    }

    pageItems.push(page);
  });

  return pageItems;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageItems = getVisiblePageItems(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="app-button pagination-button"
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="pagination-pages">
        {pageItems.map((pageItem) => {
          if (typeof pageItem !== 'number') {
            return (
              <span className="pagination-ellipsis" key={pageItem}>
                …
              </span>
            );
          }

          const isCurrentPage = pageItem === currentPage;

          return (
            <button
              className={`app-button pagination-button ${
                isCurrentPage ? 'pagination-button--active' : ''
              }`}
              type="button"
              key={pageItem}
              onClick={() => onPageChange(pageItem)}
              disabled={isCurrentPage}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageItem}
            </button>
          );
        })}
      </div>

      <button
        className="app-button pagination-button"
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}
