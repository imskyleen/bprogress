import React from 'react';
import { render, screen } from '@testing-library/react';
import { withSuspense } from '../../src/utils/with-suspense';

describe('withSuspense', () => {
  it('renders the wrapped component correctly', async () => {
    // Dummy component for testing
    const Dummy: React.FC<{ message: string }> = ({ message }) => {
      return <div>{message}</div>;
    };

    // Wrap the Dummy component with withSuspense
    const WrappedDummy = withSuspense(Dummy);

    // Render the wrapped component
    render(<WrappedDummy message="Test Message" />);

    // Verify that the Dummy component's content is rendered
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('renders a lazy component wrapped with Suspense', async () => {
    // Create a lazy component that simulates dynamic import
    const LazyComponent = React.lazy(() =>
      Promise.resolve({
        default: ({ message }: { message: string }) => <div>{message}</div>,
      }),
    );

    // Wrap the lazy component with withSuspense
    const WrappedLazy = withSuspense(LazyComponent);

    // Render the wrapped lazy component
    render(<WrappedLazy message="Lazy Component Loaded" />);

    // Since the lazy component resolves immediately, verify its content is eventually rendered
    expect(
      await screen.findByText('Lazy Component Loaded'),
    ).toBeInTheDocument();
  });
});
