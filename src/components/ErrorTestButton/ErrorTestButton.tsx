import { useState } from 'react';

export default function ErrorTestButton() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  if (shouldThrowError) {
    throw new Error('Test error boundary');
  }

  return (
    <button
      className="app-button error-test-button"
      type="button"
      onClick={() => setShouldThrowError(true)}
    >
      Test Error Boundary
    </button>
  );
}
