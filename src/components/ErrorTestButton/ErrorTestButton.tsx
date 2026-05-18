import { useState } from 'react';

type ErrorTestButtonState = boolean;

export default function ErrorTestButton() {
  const [shouldThrowError, setshouldThrowError] =
    useState<ErrorTestButtonState>(false);

  function handleClick() {
    setshouldThrowError(true);
  }

  if (shouldThrowError === true) {
    throw new Error('Test error for Error Boundary');
  }

  return (
    <button type="button" onClick={handleClick}>
      Test Error Boundary
    </button>
  );
}
