import { useCallback, useRef } from 'react';

interface TouchGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const useTouchGestures = (options: TouchGesturesOptions) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { threshold = 50 } = options;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if it's a horizontal or vertical swipe
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > threshold && options.onSwipeRight) {
          options.onSwipeRight();
        } else if (deltaX < -threshold && options.onSwipeLeft) {
          options.onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > threshold && options.onSwipeDown) {
          options.onSwipeDown();
        } else if (deltaY < -threshold && options.onSwipeUp) {
          options.onSwipeUp();
        }
      }

      touchStart.current = null;
    },
    [options, threshold]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};
