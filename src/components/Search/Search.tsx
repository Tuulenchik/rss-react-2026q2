import { useState, type ChangeEvent } from 'react';
import './Search.css';

type SearchProps = {
  initialSearchTerm: string;
  onSearch: (searchTerm: string) => void;
};

export default function Search({ initialSearchTerm, onSearch }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleSearchClick() {
    const trimmedSearchTerm = searchTerm.trim();

    setSearchTerm(trimmedSearchTerm);
    onSearch(trimmedSearchTerm);
  }

  return (
    <div className="search-div">
      <input
        value={searchTerm}
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
