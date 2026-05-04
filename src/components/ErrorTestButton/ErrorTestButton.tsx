import { Component } from 'react';

type ErrorTestButtonState = {
  shouldThrowError: boolean;
};

class ErrorTestButton extends Component<
  Record<string, never>,
  ErrorTestButtonState
> {
  state: ErrorTestButtonState = {
    shouldThrowError: false,
  };

  handleClick = () => {
    this.setState({
      shouldThrowError: true,
    });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('Test error for Error Boundary');
    }

    return (
      <button type="button" onClick={this.handleClick}>
        Test Error Boundary
      </button>
    );
  }
}

export default ErrorTestButton;
