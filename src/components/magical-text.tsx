import { useEffect, useRef } from 'react';
import { Sparkle } from 'lucide-react';

interface MagicalTextProps {
  text: string;
  className?: string;
  duration?: number;
  starAmount?: number;
}

export function MagicalText({
  text,
  className,
  duration = 2000,
  starAmount = 3,
}: MagicalTextProps) {
  const starsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const setStarRef = (index: number) => (el: HTMLSpanElement | null) => {
    starsRef.current[index] = el;
  };

  useEffect(() => {
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const animate = (star: HTMLSpanElement) => {
      star.style.setProperty('--star-left', `${rand(-10, 100)}%`);
      star.style.setProperty('--star-top', `${rand(-35, 75)}%`);

      star.style.animation = 'none';
      star.getClientRects();
      star.style.animation = '';
    };

    const intervals: NodeJS.Timeout[] = [];

    starsRef.current.forEach((star, index) => {
      if (!star) return;

      setTimeout(
        () => {
          animate(star);
          intervals.push(setInterval(() => animate(star), duration));
        },
        index * (duration / starAmount)
      );
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [duration, starAmount]);

  return (
    <span className={`magic ${className}`}>
      <span className="magic-text">{text}</span>

      {new Array(starAmount).fill('').map((_, index) => (
        <span key={index} ref={setStarRef(index)} className="magic-star">
          <Sparkle className="h-5 fill-[var(--gradient-start)] stroke-none" />
        </span>
      ))}
    </span>
  );
}
