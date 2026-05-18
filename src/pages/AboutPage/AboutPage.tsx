import { Link } from 'react-router';

export default function AboutPage() {
  return (
    <main className="app">
      <section className="search-section">
        <h1>About</h1>
        <p>Author: Mariam Akhalayia</p>
        <p>This project is part of the RS School React course.</p>

        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React course
        </a>

        <p>
          <Link to="/page/1">Back to search</Link>
        </p>
      </section>
    </main>
  );
}
