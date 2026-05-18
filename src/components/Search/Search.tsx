import { useState, type ChangeEvent } from 'react';
import './Search.css';

const SEARCH_TERM_KEY = 'searchTerm';

type SearchProps = {
  onSearch: (searchTerm: string) => void;
};

type SearchState = {
  searchTerm: string;
};

export default function Search({ onSearch }: SearchProps) {
  const [searchState, setSearchState] = useState<SearchState>(() => ({
    searchTerm: localStorage.getItem(SEARCH_TERM_KEY) ?? '',
  }));

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchState({
      searchTerm: e.target.value,
    });
  }

  function handleSearchClick() {
    const trimmedSearchTerm = searchState.searchTerm.trim();

    setSearchState({
      searchTerm: trimmedSearchTerm,
    });

    onSearch(trimmedSearchTerm);
  }

  return (
    <div className="search-div">
      <input
        value={searchState.searchTerm}
        onChange={handleInputChange}
        type="text"
        className="search-input"
        placeholder="Search..."
      />

      <button
        className="search-button"
        type="button"
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
}
