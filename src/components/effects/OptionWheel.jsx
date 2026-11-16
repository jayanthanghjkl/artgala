import { useRef, useState, useCallback, useEffect } from 'react';

const DEFAULT_ITEMS = [
  'Ambient', 'House', 'Techno', 'Jazz', 'Lo-Fi', 'Synthwave',
  'Trance', 'Funk', 'Disco', 'Hip-Hop', 'Chillwave', 'Drum & Bass'
];

const OptionWheel = ({
  items = DEFAULT_ITEMS,
  defaultSelected = 0,
  controlledIndex,
  onChange,
  onItemClick,
  textColor = '#a6a6a6',
  activeColor = '#ffffff',
  side = 'left',
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  fade = 0.3,
  minOpacity = 0.08,
  smoothing = 180,
  inset = 80,
  loop = false,
  draggable = false,
  maxOverscroll = 0,
  className = ''
}) => {
  const rootRef = useRef(null);
  const itemRefs = useRef([]);
  const posRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const dragRef = useRef(null);
  const dragMovedRef = useRef(false);

  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  onChangeRef.current = onChange;

  const remPx = typeof window !== 'undefined' 
    ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 
    : 16;
  const rowH = Math.max((fontSize || 3) * (spacing || 1.4) * remPx, 1);

  // Direct layout renderer without expensive CSS filter calculations
  const renderLayout = useCallback((pos) => {
    const els = itemRefs.current;
    const n = items.length;
    const mirror = side === 'right' ? -1 : 1;
    const tiltRad = (tilt * Math.PI) / 180;
    const R = tiltRad > 0.0005 ? rowH / tiltRad : 0;

    for (let i = 0; i < n; i++) {
      const el = els[i];
      if (!el) continue;

      let d = i - pos;
      if (loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      const dist = Math.abs(d);

      let x = 0;
      let y = d * rowH;
      let rot = 0;
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        x = -mirror * R * (1 - Math.cos(ang)) * curve;
        rot = (mirror * ang * 180) / Math.PI;
      }

      // GPU-accelerated transform3d
      el.style.transform = `translate3d(${x.toFixed(1)}px, calc(${y.toFixed(1)}px - 50%), 0) rotate(${rot.toFixed(2)}deg)`;

      const rawOpacity = 1 - dist * fade;
      el.style.opacity = String(rawOpacity <= 0 ? 0 : Math.max(minOpacity, rawOpacity));
    }
  }, [items.length, side, tilt, rowH, loop, curve, fade, minOpacity]);

  // Frame loop for manual dragging/pointer gestures
  const runFrame = useCallback((now) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    const target = targetRef.current;
    const cur = posRef.current;
    let next = cur + (target - cur) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    posRef.current = next;

    renderLayout(next);

    rafRef.current = settled ? null : requestAnimationFrame(runFrame);
  }, [smoothing, renderLayout]);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  // Handle updates when driven by GSAP / ScrollTrigger
  useEffect(() => {
    if (controlledIndex === undefined) return;

    targetRef.current = controlledIndex;
    
    // Limit instantaneous jumps larger than 1 item so pass-through frames are rendered
    const diff = controlledIndex - posRef.current;
    if (Math.abs(diff) > 1) {
      posRef.current += Math.sign(diff) * 1;
      startLoop();
    } else {
      posRef.current = controlledIndex;
      renderLayout(controlledIndex);
    }

    const clampedIdx = Math.min(Math.max(Math.round(controlledIndex), 0), items.length - 1);
    if (clampedIdx !== selectedRef.current) {
      selectedRef.current = clampedIdx;
      setSelectedIndex(clampedIdx);
      onChangeRef.current?.(clampedIdx, items[clampedIdx]);
    }
  }, [controlledIndex, items, renderLayout, startLoop]);

  // Pointer drag controls (only if draggable is true)
  const applyTarget = useCallback((value, snap) => {
    let v = value;
    if (!loop) v = Math.min(Math.max(v, -maxOverscroll), Math.max(items.length - 1 + maxOverscroll, 0));
    if (snap) v = Math.round(v);
    targetRef.current = v;

    const clampedIdx = Math.min(Math.max(Math.round(v), 0), items.length - 1);
    if (clampedIdx !== selectedRef.current) {
      selectedRef.current = clampedIdx;
      setSelectedIndex(clampedIdx);
      onChangeRef.current?.(clampedIdx, items[clampedIdx]);
    }
    startLoop();
  }, [loop, maxOverscroll, items, startLoop]);

  const handlePointerDown = useCallback((e) => {
    if (!draggable) return;
    dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId };
    dragMovedRef.current = false;
    setIsDragging(true);
  }, [draggable]);

  const handlePointerMove = useCallback((e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dy = e.clientY - drag.y;
    if (!dragMovedRef.current && Math.abs(dy) > 4) {
      dragMovedRef.current = true;
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (dragMovedRef.current) applyTarget(drag.start - dy / rowH, false);
  }, [applyTarget, rowH]);

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      role="listbox"
      aria-label="Option wheel"
      className={`relative h-full w-full select-none overflow-hidden outline-none [touch-action:none] ${isDragging ? 'cursor-grabbing' : 'cursor-default'} ${className}`}
      style={{
        '--ow-font-size': `${fontSize}rem`,
        '--ow-inset': `${inset}px`
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      {items.map((label, index) => {
        const isSelected = selectedIndex === index;
        return (
          <div
            key={`${label}-${index}`}
            ref={(el) => { itemRefs.current[index] = el; }}
            role="option"
            aria-selected={isSelected}
            onClick={() => {
              if (dragMovedRef.current) return;
              onItemClick?.(index, label);
            }}
            className={`absolute top-1/2 whitespace-nowrap leading-none will-change-transform cursor-pointer pointer-events-auto ${
              side === 'right' ? 'right-[var(--ow-inset)] origin-right' : 'left-[var(--ow-inset)] origin-left'
            } transition-colors duration-200`}
            style={{
              fontSize: 'var(--ow-font-size)',
              color: isSelected ? activeColor : textColor,
              fontWeight: isSelected ? 600 : 200,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default OptionWheel;
