import './App.css';
import { Component } from 'react';
import Search from './components/Search/Search';

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
        </section>
      </main>
    );
  }
}

export default App;
