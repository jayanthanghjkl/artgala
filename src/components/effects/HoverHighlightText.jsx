import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';

const HoverHighlightText = ({
  radius = 10,
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef(null);

  // Parse children into characters using React to prevent DOM hydration conflicts
  const parsedContent = useMemo(() => {
    const nodes = React.Children.toArray(children);
    
    return nodes.map((node, nodeIdx) => {
      if (typeof node === 'string') {
        const words = node.split(/(\s+)/); // split by whitespace but keep the whitespace
        
        return words.map((word, wordIdx) => {
          if (!word) return null;
          if (/\s+/.test(word)) {
            // It's just whitespace
            return <React.Fragment key={`${nodeIdx}-${wordIdx}`}>{word}</React.Fragment>;
          }
          
          // It's a word, wrap in inline-block and split chars
          return (
            <span key={`${nodeIdx}-${wordIdx}`} className="inline-block">
              {word.split('').map((char, charIdx) => (
                <span key={charIdx} className="char-span inline-block">
                  {char}
                </span>
              ))}
            </span>
          );
        });
      }
      
      // If it's a React element (like <br />), just return it
      return React.cloneElement(node, { key: `node-${nodeIdx}` });
    });
  }, [children]);

  useEffect(() => {
    if (!rootRef.current) return;
    
    // React has already rendered the .char-span elements
    const chars = Array.from(rootRef.current.querySelectorAll('.char-span'));

    const handleMove = (e) => {
      chars.forEach((c) => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          gsap.to(c, {
            backgroundColor: '#e60026', // vivid crimson
            color: '#ffffff', // white text
            duration: 0,
            overwrite: true
          });
        } else {
          gsap.to(c, {
            backgroundColor: 'transparent',
            color: 'inherit',
            duration: 0,
            overwrite: 'auto'
          });
        }
      });
    };

    const handleLeave = () => {
      chars.forEach((c) => {
        gsap.to(c, {
          backgroundColor: 'transparent',
          color: 'inherit',
          duration: 0,
          overwrite: 'auto'
        });
      });
    };

    window.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }, [radius, parsedContent]);

  return (
    <div ref={rootRef} className={className} style={style}>
      <p className="m-0 p-0 leading-inherit font-inherit text-inherit tracking-inherit">
        {parsedContent}
      </p>
    </div>
  );
};

export default HoverHighlightText;
