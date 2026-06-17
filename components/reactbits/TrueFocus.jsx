"use client";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './TrueFocus.css';

const TrueFocus = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  // True while the headline is off-screen or the tab is hidden — we keep a
  // cheap timer ticking but skip advancing (so no blur transition fires and
  // scroll stays smooth, especially on phones).
  const pausedRef = useRef(false);

  useEffect(() => {
    if (manualMode) return;

    // Slower, calmer cadence on touch devices.
    const coarse =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches;
    const pause = pauseBetweenAnimations + (coarse ? 0.6 : 0);
    const period = (animationDuration + pause) * 1000;

    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, period);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  // Pause the cycle when scrolled out of view or the tab is backgrounded.
  useEffect(() => {
    if (manualMode) return;
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        pausedRef.current = !entry.isIntersecting || document.hidden;
      },
      { threshold: 0 }
    );
    io.observe(el);

    const onVisibility = () => {
      pausedRef.current = document.hidden || pausedRef.current;
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [manualMode]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;

    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = index => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div className="focus-container" ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => (wordRefs.current[index] = el)}
            className={`focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
            style={{
              filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
              transform: 'translateZ(0)',
              '--border-color': borderColor,
              '--glow-color': glowColor,
              transition: `filter ${animationDuration}s ease`
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration
        }}
        style={{
          '--border-color': borderColor,
          '--glow-color': glowColor
        }}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;
