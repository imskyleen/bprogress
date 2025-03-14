import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import {
  isSameURL,
  isSameURLWithoutSearch,
  getAnchorProperty,
} from '@bprogress/core';
import { useProgress } from './use-progress';
import type { UseAnchorProgressOptions } from '../types';

type PushStateInput = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  unused: string,
  url?: string | URL | null | undefined,
];

export function useAnchorProgress(
  {
    shallowRouting = false,
    disableSameURL = true,
    startPosition = 0,
    delay = 0,
    stopDelay = 0,
    targetPreprocessor,
    disableAnchorClick = false,
    startOnLoad = false,
    forcedStopDelay = 0,
  }: UseAnchorProgressOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[] = [],
) {
  // References to store attached anchor elements and the timer
  const elementsWithAttachedHandlers = ref<(HTMLAnchorElement | SVGAElement)[]>(
    [],
  );
  const timerRef = ref<number | null>(null);
  const { start, stop, isAutoStopDisabled } = useProgress();

  // Save the original pushState method
  const originalWindowHistoryPushState = window.history.pushState;

  // Start the progress bar on mount if startOnLoad is true
  onMounted(() => {
    if (startOnLoad) {
      start(startPosition, delay);
    }
  });

  // Watch dependencies and trigger stop after stopDelay when they change
  if (dependencies.length > 0) {
    watch(dependencies, () => {
      if (timerRef.value) {
        clearTimeout(timerRef.value);
      }
      timerRef.value = window.setTimeout(() => {
        if (!isAutoStopDisabled.value) stop();
      }, stopDelay);
    });
  }

  // Function to handle anchor click events
  const handleAnchorClick = (event: Event) => {
    // Cast event to MouseEvent to access mouse-specific properties
    const mouseEvent = event as MouseEvent;
    if (mouseEvent.defaultPrevented) return;

    const anchorElement = mouseEvent.currentTarget as
      | HTMLAnchorElement
      | SVGAElement;

    if (anchorElement.hasAttribute('download')) return;

    const target = mouseEvent.target as HTMLElement | Element;
    let preventProgress =
      target?.getAttribute('data-prevent-progress') === 'true' ||
      anchorElement?.getAttribute('data-prevent-progress') === 'true';

    if (!preventProgress) {
      let element: HTMLElement | Element | null = target;
      while (element && element.tagName.toLowerCase() !== 'a') {
        if (
          element.parentElement?.getAttribute('data-prevent-progress') ===
          'true'
        ) {
          preventProgress = true;
          break;
        }
        element = element.parentElement;
      }
    }

    if (preventProgress) return;

    const anchorTarget = getAnchorProperty(anchorElement, 'target');
    // Skip anchors with target="_blank"
    if (anchorTarget === '_blank') return;
    // Skip clicks with modifier keys (meta, ctrl, shift, alt)
    if (
      mouseEvent.metaKey ||
      mouseEvent.ctrlKey ||
      mouseEvent.shiftKey ||
      mouseEvent.altKey
    )
      return;

    const targetHref = getAnchorProperty(anchorElement, 'href');
    const targetUrl = targetPreprocessor
      ? targetPreprocessor(new URL(targetHref))
      : new URL(targetHref);
    const currentUrl = new URL(location.href);

    if (
      shallowRouting &&
      isSameURLWithoutSearch(targetUrl, currentUrl) &&
      disableSameURL
    )
      return;
    if (isSameURL(targetUrl, currentUrl) && disableSameURL) return;

    start(startPosition, delay);
  };

  // MutationObserver callback to attach click handlers to valid anchor elements
  const handleMutation: MutationCallback = () => {
    const anchorElements = Array.from(document.querySelectorAll('a')) as (
      | HTMLAnchorElement
      | SVGAElement
    )[];
    const validAnchorElements = anchorElements.filter((anchor) => {
      const href = getAnchorProperty(anchor, 'href');
      const isBProgressDisabled =
        anchor.getAttribute('data-disable-progress') === 'true';
      const isNotTelOrMailto =
        href &&
        !href.startsWith('tel:') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('blob:') &&
        !href.startsWith('javascript:');
      return (
        !isBProgressDisabled &&
        isNotTelOrMailto &&
        getAnchorProperty(anchor, 'target') !== '_blank'
      );
    });

    validAnchorElements.forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick, true);
    });
    elementsWithAttachedHandlers.value = validAnchorElements;
  };

  let mutationObserver: MutationObserver | null = null;
  onMounted(() => {
    if (!disableAnchorClick) {
      mutationObserver = new MutationObserver(handleMutation);
      mutationObserver.observe(document, { childList: true, subtree: true });
    }

    // Override window.history.pushState using a proxy to intercept state changes
    window.history.pushState = new Proxy(window.history.pushState, {
      apply(target, thisArg, argArray: PushStateInput) {
        if (!isAutoStopDisabled.value) stop(stopDelay, forcedStopDelay);
        return target.apply(thisArg, argArray);
      },
    });
  });

  // Cleanup when the component is unmounted
  onBeforeUnmount(() => {
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
    elementsWithAttachedHandlers.value.forEach((anchor) => {
      anchor.removeEventListener('click', handleAnchorClick, true);
    });
    elementsWithAttachedHandlers.value = [];
    if (timerRef.value) {
      clearTimeout(timerRef.value);
    }
    // Restore the original pushState method
    window.history.pushState = originalWindowHistoryPushState;
  });
}
