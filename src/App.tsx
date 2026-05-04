import './App.css';
import { Component } from 'react';
import Search from './components/Search/Search';
import { fetchCharacters } from './services/api';
import ResultsList from './components/ResultsList/ResultsList';
import type { Item } from './types/item';

type AppState = {
  items: Item[];
};
class App extends Component<Record<string, never>, AppState>{
  
  state: AppState = {
    items: [],
  };

  componentDidMount() {
  const savedSearchTerm = localStorage.getItem('searchTerm') ?? '';

  fetchCharacters(savedSearchTerm)
    .then((items) => {
      this.setState({ items });
    })
    .catch(() => {
      this.setState({ items: [] });
    });
}
  
  render() {
    return (
      <main className="app">
        <section className="search-section">
          <h1>Search</h1>
          <Search />
        </section>

        <section className="results-section">
          <h1>Results</h1>
          <ResultsList items={this.state.items} />
        </section>
      </main>
    );
  }
}

export default App;
