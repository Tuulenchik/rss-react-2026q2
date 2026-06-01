import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <main className="app">
      <section className="search-section">
        <h1>404</h1>
        <p>Page not found.</p>

        <Link className="app-link" to="/page/1">Go back to search</Link>
      </section>
    </main>
  );
}
