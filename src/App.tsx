import './App.css';
import ErrorTestButton from './components/ErrorTestButton/ErrorTestButton';
import { Component } from 'react';
import Search from './components/Search/Search';
import { fetchCharacters } from './services/api';
import ResultsList from './components/ResultsList/ResultsList';
import type { Item } from './types/item';
import Loader from './components/Loader/Loader';

type AppState = {
  items: Item[];
  isLoading: boolean;
  errorMessage: string;
};
class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    items: [],
    isLoading: true,
    errorMessage: '',
  };

  componentDidMount() {
    const savedSearchTerm = localStorage.getItem('searchTerm') ?? '';

    fetchCharacters(savedSearchTerm)
      .then((items) => {
        this.setState({ items, isLoading: false, errorMessage: '' });
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Something went wrong';
        this.setState({ items: [], isLoading: false, errorMessage });
      });
  }

  handleSearch = (searchTerm: string) => {
    this.setState({ isLoading: true, errorMessage: '' });

    fetchCharacters(searchTerm)
      .then((items) => {
        this.setState({
          items,
          isLoading: false,
          errorMessage: '',
        });
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'No results were found';
        this.setState({ items: [], isLoading: false, errorMessage });
      });
  };

  render() {
    return (
      <main className="app">
        <section className="search-section">
          <h1>Search</h1>
          <Search onSearch={this.handleSearch} />
        </section>

        <section className="results-section">
          <h1>Results</h1>
          {this.state.isLoading ? (
            <Loader />
          ) : this.state.errorMessage ? (
            <p className="error-message">{this.state.errorMessage}</p>
          ) : (
            <ResultsList items={this.state.items} />
          )}
          <div className="error-button-wrapper">
            <ErrorTestButton />
          </div>
        </section>
      </main>
    );
  }
}

export default App;
