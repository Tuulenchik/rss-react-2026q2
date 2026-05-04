import { Component, type ChangeEvent } from 'react';
import './Search.css';

const SEARCH_TERM_KEY = 'searchTerm';

type SearchProps = Record<string, never>;

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

        <button className="search-button" type="button">
          Search
        </button>
      </form>
    );
  }
}

export default Search;
