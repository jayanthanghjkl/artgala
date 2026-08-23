import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  trigger = false,
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click' && animateOn !== 'custom');
  const [direction, setDirection] = useState('forward');

  const containerRef = useRef(null);
  const orderRef = useRef([]);
  const pointerRef = useRef(0);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (originalText, currentRevealed) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [availableChars]
  );

  const computeOrder = useCallback(
    len => {
      const order = [];
      if (len <= 0) return order;
      if (revealDirection === 'start') {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === 'end') {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      // center
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection]
  );

  const fillAllIndices = useCallback(() => {
    const s = new Set();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  }, [text]);

  const removeRandomIndices = useCallback((set, count) => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set(arr);
  }, []);

  const encryptInstantly = useCallback(() => {
    const emptySet = new Set();
    setRevealedIndices(emptySet);
    setDisplayText(shuffleText(text, emptySet));
    setIsDecrypted(false);
  }, [text, shuffleText]);

  const triggerDecrypt = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
      setRevealedIndices(new Set());
    } else {
      setRevealedIndices(new Set());
    }
    setDirection('forward');
    setIsAnimating(true);
  }, [sequential, computeOrder, text.length]);

  const triggerReverse = useCallback(() => {
    if (sequential) {
      // compute forward order then reverse it: we'll remove indices in that order
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      setRevealedIndices(fillAllIndices()); // start fully revealed
      setDisplayText(shuffleText(text, fillAllIndices()));
    } else {
      // non-seq: start from fully revealed as well
      setRevealedIndices(fillAllIndices());
      setDisplayText(shuffleText(text, fillAllIndices()));
    }
    setDirection('reverse');
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, shuffleText, text]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    const getNextIndex = revealedSet => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    intervalRef.current = setInterval(() => {
      setRevealedIndices(prevRevealed => {
        if (sequential) {
          // Forward
          if (direction === 'forward') {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(true);
              return prevRevealed;
            }
          }

          // Reverse
          if (direction === 'reverse') {
            if (pointerRef.current < orderRef.current.length) {
              const idxToRemove = orderRef.current[pointerRef.current++];
              const newRevealed = new Set(prevRevealed);
              newRevealed.delete(idxToRemove);
              setDisplayText(shuffleText(text, newRevealed));
              if (newRevealed.size === 0) {
                clearInterval(intervalRef.current);
                setIsAnimating(false);
                setIsDecrypted(false);
              }
              return newRevealed;
            } else {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
              return prevRevealed;
            }
          }
        } else {
          // Non-Sequential
          if (direction === 'forward') {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setDisplayText(text);
              setIsDecrypted(true);
            }
            return prevRevealed;
          }

          // Non-Sequential Reverse
          if (direction === 'reverse') {
            let currentSet = prevRevealed;
            if (currentSet.size === 0) {
              currentSet = fillAllIndices();
            }
            const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
            const nextSet = removeRandomIndices(currentSet, removeCount);
            setDisplayText(shuffleText(text, nextSet));
            currentIteration++;
            if (nextSet.size === 0 || currentIteration >= maxIterations) {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
              // ensure final scrambled state
              setDisplayText(shuffleText(text, new Set()));
              return new Set();
            }
            return nextSet;
          }
        }
        return prevRevealed;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [
    isAnimating,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    shuffleText,
    direction,
    fillAllIndices,
    removeRandomIndices,
    characters,
    useOriginalCharsOnly
  ]);

  /* Click Behaviour */
  const handleClick = () => {
    if (animateOn !== 'click') return;

    if (clickMode === 'once') {
      if (isDecrypted) return;
      setDirection('forward');
      triggerDecrypt();
    }

    if (clickMode === 'toggle') {
      if (isDecrypted) {
        triggerReverse();
      } else {
        setDirection('forward');
        triggerDecrypt();
      }
    }
  };

  /* Hover Behaviour */
  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;

    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setDisplayText(text);
    setDirection('forward');
    setIsAnimating(true);
  }, [isAnimating, text]);

  const resetToPlainText = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection('forward');
  }, [text]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  // Handle scroll and custom triggers
  useEffect(() => {
    if (animateOn === 'scroll') {
      const progress = typeof trigger === 'number' ? trigger : (trigger ? 1 : 0);
      
      if (!orderRef.current || orderRef.current.length === 0) {
        orderRef.current = computeOrder(text.length);
      }
      
      const targetRevealedCount = Math.floor(progress * text.length);
      const newRevealed = new Set();
      
      for (let i = 0; i < targetRevealedCount; i++) {
        newRevealed.add(orderRef.current[i]);
      }
      
      setRevealedIndices(newRevealed);
      
      if (progress === 1) {
        setDisplayText(text);
        setIsDecrypted(true);
      } else if (progress === 0) {
        setDisplayText(shuffleText(text, new Set()));
        setIsDecrypted(false);
      } else {
        setDisplayText(shuffleText(text, newRevealed));
        setIsDecrypted(false);
      }
    } else if (animateOn === 'custom') {
      if (trigger && !hasAnimated) {
        triggerDecrypt();
        setHasAnimated(true);
      } else if (!trigger && hasAnimated) {
        encryptInstantly();
        setHasAnimated(false);
      }
    }
  }, [trigger, animateOn, text, computeOrder, shuffleText, triggerDecrypt, hasAnimated, encryptInstantly]);

  useEffect(() => {
    if (animateOn === 'click' || animateOn === 'custom' || animateOn === 'scroll') {
      encryptInstantly();
    } else {
      setDisplayText(text);
      setIsDecrypted(true);
    }
    setRevealedIndices(new Set());
    setDirection('forward');
  }, [animateOn, text, encryptInstantly]);

  const animateProps =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? {
          onMouseEnter: triggerHoverDecrypt,
          onMouseLeave: resetToPlainText
        }
      : animateOn === 'click'
        ? {
            onClick: handleClick
          }
        : {};

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...animateProps}
      {...props}
    >
      <span className="sr-only">{displayText}</span>

      <span aria-hidden="true">
        {text.split(' ').map((word, wordIndex, wordArr) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIndex) => {
              // Calculate global index for this character
              const globalIndex = 
                wordArr.slice(0, wordIndex).reduce((acc, w) => acc + w.length + 1, 0) + charIndex;
              
              const isRevealedOrDone = revealedIndices.has(globalIndex) || (!isAnimating && isDecrypted);
              const displayChar = displayText[globalIndex];

              return (
                <span key={globalIndex} className="relative inline-flex items-center justify-center">
                  <span className="invisible">{char}</span>
                  <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isRevealedOrDone ? className : encryptedClassName}`}>
                    {displayChar}
                  </span>
                </span>
              );
            })}
            {wordIndex < wordArr.length - 1 && (
              <span className="relative inline-flex items-center justify-center">
                <span className="invisible">&nbsp;</span>
                <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${revealedIndices.has(wordArr.slice(0, wordIndex).reduce((acc, w) => acc + w.length + 1, 0) + word.length) || (!isAnimating && isDecrypted) ? className : encryptedClassName}`}>
                  &nbsp;
                </span>
              </span>
            )}
          </span>
        ))}
      </span>
    </motion.span>
  );
}
