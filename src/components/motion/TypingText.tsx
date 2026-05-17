import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypingTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
  speed?: number;
  start?: boolean;
  onDone?: () => void;
}

export function TypingText({ text, className, as: Tag = 'h1', speed = 21, start = true, onDone }: TypingTextProps) {
  const reduceMotion = useReducedMotion();
  const initialCount = reduceMotion ? text.length : 0;
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const characters = useMemo(() => Array.from(text), [text]);
  const onDoneRef = useRef(onDone);
  const completedRef = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    completedRef.current = false;
    if (!start) {
      return undefined;
    }

    if (reduceMotion) {
      completedRef.current = true;
      window.setTimeout(() => onDoneRef.current?.(), 0);
      return undefined;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleCount(index);
      if (index >= characters.length) {
        window.clearInterval(timer);
        if (!completedRef.current) {
          completedRef.current = true;
          window.setTimeout(() => onDoneRef.current?.(), 90);
        }
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [characters.length, reduceMotion, speed, start, text]);

  const count = reduceMotion ? characters.length : visibleCount;
  const done = count >= characters.length;

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">{characters.slice(0, count).join('')}</span>
      {!reduceMotion && <span className={done ? 'typing-cursor done' : 'typing-cursor'} aria-hidden="true" />}
    </Tag>
  );
}
