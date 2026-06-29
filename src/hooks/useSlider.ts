import { useEffect, useCallback, useRef } from 'react';

/**
 * Drives a sliding "thumb" that tracks the `[data-active="true"]` child of a
 * container. The measured position is written to the container as CSS custom
 * properties (`--useslider-left/-width/-opacity`) rather than returned as
 * render state, so consumers never read ref-derived values during render.
 *
 * The thumb element (a descendant of the container) positions itself with:
 *   left: var(--useslider-left, 0px);
 *   width: var(--useslider-width, 0px);
 *   opacity: var(--useslider-opacity, 0);
 *
 * Returns the container's callback ref — attach it with `ref={...}`.
 */
export function useSlider<T>(activeValue: T) {
  const containerEl = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const measure = useCallback(() => {
    const container = containerEl.current;
    if (!container) return;
    const active = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (!active) return;
    container.style.setProperty('--useslider-left', `${active.offsetLeft}px`);
    container.style.setProperty('--useslider-width', `${active.offsetWidth}px`);
    container.style.setProperty('--useslider-opacity', '1');
  }, []);

  // Callback ref: fires when the DOM node mounts/unmounts
  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Clean up old observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      containerEl.current = node;

      if (node) {
        // Measure immediately
        measure();
        // Observe for resizes
        observerRef.current = new ResizeObserver(measure);
        observerRef.current.observe(node);
      }
    },
    [measure],
  );

  // Re-measure when active value changes
  useEffect(() => {
    measure();
  }, [activeValue, measure]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return containerRef;
}
