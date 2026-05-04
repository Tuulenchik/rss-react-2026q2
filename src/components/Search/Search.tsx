import { Component, type ChangeEvent } from 'react';
import './Search.css';

const SEARCH_TERM_KEY = 'searchTerm';

type SearchProps = {
  onSearch: (searchTerm: string) => void;
};

type SearchState = {
  searchTerm: string;
};

class Search extends Component<SearchProps, SearchState> {
  state: SearchState = {
    searchTerm: localStorage.getItem(SEARCH_TERM_KEY) ?? '',
  };

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchTerm: e.target.value,
    });
  };

  handleSearchClick = () => {
    this.props.onSearch(this.state.searchTerm);
  };

  render() {
    return (
      <form className="search-form">
        <input
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          type="text"
          className="search-input"
          placeholder="Search..."
        />

        <button
          className="search-button"
          type="button"
          onClick={this.handleSearchClick}
        >
          Search
        </button>
      </form>
    );
  }
}

export default Search;
