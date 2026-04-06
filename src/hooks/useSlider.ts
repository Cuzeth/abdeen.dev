import { useState, useEffect, useCallback, useRef } from 'react';

interface SliderStyle {
  left: number;
  width: number;
}

export function useSlider<T>(activeValue: T) {
  const containerEl = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [style, setStyle] = useState<SliderStyle>({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const container = containerEl.current;
    if (!container) return;
    const active = container.querySelector('[data-active="true"]') as HTMLElement;
    if (!active) return;
    setStyle({ left: active.offsetLeft, width: active.offsetWidth });
    setReady(true);
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

  return { containerRef, style, ready };
}
