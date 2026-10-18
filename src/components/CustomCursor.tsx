import { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/soundEngine.ts';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [cursorText, setCursorText] = useState<string>('');
  const [isClickable, setIsClickable] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const springPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isFinePointer || isTouch) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement | null;

      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsClickable(true);
      } else {
        const clickableEl = target?.closest('button, a, input, textarea, select');
        if (clickableEl) {
          setCursorText('');
          setIsClickable(true);
        } else {
          setCursorText('');
          setIsClickable(false);
        }
      }
    };

    const onMouseDown = () => {
      sound.playClick();
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let animId: number;
    const render = () => {
      // Lerp for smooth spring responsiveness
      const factor = 0.22;
      springPos.current.x += (mousePos.current.x - springPos.current.x) * factor;
      springPos.current.y += (mousePos.current.y - springPos.current.y) * factor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${springPos.current.x}px, ${springPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden mix-blend-difference select-none">
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 flex items-center justify-center transition-all duration-200 ease-out will-change-transform ${
          !isVisible ? 'opacity-0' : 'opacity-100'
        } ${
          cursorText
            ? 'px-3 py-1.5 bg-white text-black font-mono text-[10px] font-bold tracking-widest uppercase -translate-x-1/2 -translate-y-1/2 rounded-none shadow-lg'
            : isClickable
            ? 'w-10 h-10 -ml-5 -mt-5 bg-white/90 rounded-full'
            : 'w-2 h-2 -ml-1 -mt-1 bg-white rounded-full'
        }`}
      >
        {cursorText && <span className="whitespace-nowrap">{cursorText}</span>}
      </div>
    </div>
  );
}
