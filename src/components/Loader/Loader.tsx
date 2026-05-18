import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <span className="loader" />
      <span>Loading...</span>
    </div>
  );
}
