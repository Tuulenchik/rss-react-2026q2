import './App.css';
import { Component } from 'react';
import Search from './components/Search/Search';
import ResultsList from './components/ResultsList/ResultsList';
import type { Item } from './types/item';

const testItems: Item[] = [
  {
    id: '1',
    name: 'First result',
    description: 'This is the description for the first result.',
  },
  {
    id: '2',
    name: 'Second result',
    description: 'This is the description for the second result.',
  },
];
class App extends Component {
  render() {
    return (
      <main className="app">
        <section className="search-section">
          <h1>Search</h1>
          <Search />
        </section>

        <section className="results-section">
          <h1>Results</h1>
          <ResultsList items={testItems} />
        </section>
      </main>
    );
  }
}

export default App;
