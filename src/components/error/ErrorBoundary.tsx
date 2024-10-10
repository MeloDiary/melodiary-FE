import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorMessage>
            <h1>Oops!</h1>
            <p>일시적인 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.</p>
            <button onClick={this.handleReload}>다시 시도</button>
          </ErrorMessage>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  /* background-color: #d3e7fc; */
`;

const ErrorMessage = styled.div`
  text-align: center;
  /* color: #721c24; */
  color: ${({theme})=> theme.color.grayblack};

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
  }

  button {
    margin-top: 1rem;
    padding: 10px 20px;
    font-size: 1rem;
    color: #fff;
    /* background-color: #721c24; */
    background-color: ${({theme})=> theme.color.primary};
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: ${({theme})=> theme.color.primaryHover};
    /* background-color: #a71d2a; */
  }
`;
