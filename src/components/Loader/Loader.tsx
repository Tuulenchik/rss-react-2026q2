import { Component } from 'react';
import './Loader.css';

class Loader extends Component {
  render() {
    return (
      <div className="loader-wrapper" role="status" aria-live="polite">
        <span className="loader" />
        <span>Loading...</span>
      </div>
    );
  }
}

export default Loader;
