import { useLayoutEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const TYPE_SPEED = 35;
const START_DELAY = 400;

export function useTypewriter(text: string): string {
  // SSR and no-JS users see the full text immediately. The typewriter only
  // starts on the client, before first paint, when the user allows motion.
  const [visible, setVisible] = useState(text);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) {
      setVisible(text);
      return;
    }
    setVisible('');
    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setVisible(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
        }
      }, TYPE_SPEED);
    }, START_DELAY);
    return () => {
      clearTimeout(startTimer);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [text, reducedMotion]);

  return visible;
}
