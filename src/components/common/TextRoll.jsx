import React from 'react';

/**
 * TextRoll component.
 * Splits text into individual character spans that perform a rolling 3D translation on parent hover.
 * The parent anchor/element must have the 'group/link' Tailwind class to trigger the roll transition.
 */
export default function TextRoll({ text, className = '' }) {
  if (!text) return null;

  return (
    <span className={`inline-flex flex-wrap pointer-events-none ${className}`}>
      {text.split(' ').map((word, wIdx) => (
        <span key={wIdx} className="inline-flex mr-[0.2em] whitespace-nowrap">
          {word.split('').map((char, cIdx) => (
            <span
              key={cIdx}
              className="relative inline-block overflow-hidden h-[1.25em] leading-none"
            > 
              {/* Inner wrapper that shifts on hover of group/link */}
              <span
                className="block transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/link:-translate-y-full will-change-transform"
                style={{ transitionDelay: `${cIdx * 20}ms` }}
              >
                {/* Default character */}
                <span className="block h-[1.25em]">{char}</span>
                {/* Hover character (offset below, absolute) */}
                <span className="block text-vivid-crimson absolute top-full left-0 w-full text-center h-[1.25em]">{char}</span>
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
