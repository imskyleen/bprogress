import React from 'react';
import { TypeTable } from 'fumadocs-ui/components/type-table';

const types = {
  children: {
    description: 'Your app content',
    type: 'ReactNode',
    default: 'undefined',
  },
  height: {
    description: 'The height of the progress bar',
    type: 'string',
    default: '2px',
  },
  color: {
    description: 'The color of the progress bar',
    type: 'string',
    default: '#0A2FFF',
  },
  options: {
    description: 'The BProgress options',
    type: 'BProgressOptions',
    default: 'undefined',
  },
  spinnerPosition: {
    description: 'Position of the spinner (if showSpinner is true)',
    type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    default: 'top-right',
  },
  shallowRouting: {
    description:
      'Do not display the progress bar when the query parameters change but the route remains the same. See Next.js docs*',
    type: 'boolean',
    default: 'false',
  },
  startPosition: {
    description: 'The position the progress bar starts at from 0 to 1',
    type: 'number',
    default: '0',
  },
  delay: {
    description:
      'When the page loads faster than the progress bar, it does not display',
    type: 'number',
    default: '0',
  },
  disableSameURL: {
    description:
      'Disable the progress bar when the target URL is the same as the current URL',
    type: 'boolean',
    default: 'true',
  },
  stopDelay: {
    description: 'The delay in milliseconds before the progress bar stops',
    type: 'number',
    default: '0',
  },
  nonce: {
    description:
      'A cryptographic nonce (number used once) used to declare inline scripts for Content Security Policy',
    type: 'string',
    default: 'undefined',
  },
  memo: {
    description: 'Memoize the progress bar component',
    type: 'boolean',
    default: 'true',
  },
  style: {
    description: 'Your custom CSS',
    type: 'string',
    default: 'BProgress CSS*',
  },
  disableStyle: {
    description:
      'Disable the default CSS. If you need to disable the default CSS, you will need to add your own CSS to see the progress bar. You can use BProgress CSS*.',
    type: 'boolean',
    default: 'false',
  },
  shouldCompareComplexProps: {
    description:
      'Activates a detailed comparison of component props to determine if a rerender is necessary. When `true`, the component will only rerender if there are changes in key props such as `color`, `height`, `shallowRouting`, `delay`, `options`, and `style`. This is useful for optimizing performance in scenarios where these props change infrequently. If not provided or set to `false`, the component will assume props have not changed and will not rerender, which can enhance performance in scenarios where the props remain static.',
    type: 'boolean',
    default: 'false',
  },
  targetPreprocessor: {
    description:
      'Provides a custom function to preprocess the target URL before comparing it with the current URL. This is particularly useful in scenarios where URLs undergo transformations, such as localization or path modifications, after navigation. The function takes a `URL` object as input and should return a modified `URL` object. If this prop is provided, the preprocessed URL will be used for comparisons, ensuring accurate determination of whether the navigation target is equivalent to the current URL. This can prevent unnecessary display of the progress bar when the target URL is effectively the same as the current URL after preprocessing.',
    type: '(url: URL) => URL',
    default: 'undefined',
  },
  disableAnchorClick: {
    description: 'Disable the progress bar when clicking on an anchor element',
    type: 'boolean',
    default: 'false',
  },
  startOnLoad: {
    description: 'Start the progress bar when the page loads',
    type: 'boolean',
    default: 'false',
  },
  forcedStopDelay: {
    description:
      'Delay to stop the progress bar that does not take the timer into account',
    type: 'number',
    default: '0',
  },
};

export const ProgressTypeTable = ({
  displayTypes,
}: {
  displayTypes: (keyof typeof types)[];
}) => {
  return (
    <TypeTable
      type={Object.fromEntries(displayTypes.map((key) => [key, types[key]]))}
    />
  );
};
