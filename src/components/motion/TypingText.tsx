import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypingTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
  speed?: number;
  onDone?: () => void;
}

export function TypingText({ text, className, as: Tag = 'h1', speed = 28, onDone }: TypingTextProps) {
  const reduceMotion = useReducedMotion();
  const initialCount = reduceMotion ? text.length : 0;
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const characters = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    if (reduceMotion) {
      onDone?.();
      return undefined;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleCount(index);
      if (index >= characters.length) {
        window.clearInterval(timer);
        window.setTimeout(() => onDone?.(), 120);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [characters.length, onDone, reduceMotion, speed, text]);

  const count = reduceMotion ? characters.length : visibleCount;
  const done = count >= characters.length;

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">{characters.slice(0, count).join('')}</span>
      {!reduceMotion && <span className={done ? 'typing-cursor done' : 'typing-cursor'} aria-hidden="true" />}
    </Tag>
  );
}
