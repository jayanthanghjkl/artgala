import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { projectsList } from '../../data/projects';

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT ENGINE — Fixed Spatial Mapping
//
// Each project gets one canonical (worldX, worldY) coordinate in an infinite
// 2D canvas. Cards never repeat. Adding items to projectsList automatically
// places them at the next available spiral position.
//
// Layout: spiral outward from origin (0, 0).
//   Layer 0: (0,0)            — 1 slot
//   Layer 1: ring of 8 slots  — cols and rows ±1
//   Layer 2: ring of 16 slots — cols and rows ±2
//   ...etc
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates [col, row] grid coordinates in a clockwise spiral starting at (0,0).
 * Infinitely scalable: pass any count and you get that many unique positions.
 */
function generateSpiralPositions(count) {
  const positions = [];
  if (count <= 0) return positions;
  positions.push([0, 0]);

  let layer = 1;
  while (positions.length < count) {
    // Top row: left-to-right  (-layer, -layer) → (layer, -layer)
    for (let c = -layer; c <= layer && positions.length < count; c++) {
      positions.push([c, -layer]);
    }
    // Right col: top-to-bottom  (layer, -layer+1) → (layer, layer)
    for (let r = -layer + 1; r <= layer && positions.length < count; r++) {
      positions.push([layer, r]);
    }
    // Bottom row: right-to-left  (layer-1, layer) → (-layer, layer)
    for (let c = layer - 1; c >= -layer && positions.length < count; c--) {
      positions.push([c, layer]);
    }
    // Left col: bottom-to-top  (-layer, layer-1) → (-layer, -layer+1)
    for (let r = layer - 1; r >= -layer + 1 && positions.length < count; r--) {
      positions.push([-layer, r]);
    }
    layer++;
  }
  return positions;
}

/**
 * Maps projectsList entries to fixed world-space coordinates.
 * The "featured" card is always anchored at origin (0, 0) — slot index 0.
 * All other cards fill subsequent spiral slots.
 *
 * To add more projects: just append to projectsList. This function handles the rest.
 */
function computeLayout(projects, cellW, cellH) {
  const featuredIdx = projects.findIndex((p) => p.type === 'featured' || p.id === 5);
  const positions = generateSpiralPositions(projects.length);

  // Build ordered list: featured first, then rest in original order
  const orderedProjects = [];
  if (featuredIdx >= 0) {
    orderedProjects.push(projects[featuredIdx]);
    projects.forEach((p, i) => {
      if (i !== featuredIdx) orderedProjects.push(p);
    });
  } else {
    orderedProjects.push(...projects);
  }

  // Assign each project its world position
  return orderedProjects.map((project, i) => ({
    ...project,
    worldX: positions[i][0] * cellW,
    worldY: positions[i][1] * cellH,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function InfiniteGrid({ inView }) {
  const containerRef = useRef(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.33);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null); // hover/tap state keyed by project id

  // Interaction tracking refs (never trigger re-render)
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const touchStartDist = useRef(0);
  const zoomStart = useRef(1);
  const dragDistance = useRef(0);
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  const isDraggingRef = useRef(false);
  const touchLock = useRef({ dir: null, locked: false });

  useEffect(() => { panRef.current = pan; }, [pan]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  // ── Entrance Zoom & Pan swoop animation ────────────────────────────────────
  useEffect(() => {
    if (inView) {
      const animObj = { zoom: 2.2, panX: 0, panY: -250 };
      
      gsap.killTweensOf(animObj);
      
      gsap.to(animObj, {
        zoom: 1.33,
        panX: 0,
        panY: 0,
        duration: 1.6,
        ease: 'power3.out',
        onUpdate: () => {
          setZoom(animObj.zoom);
          setPan({ x: animObj.panX, y: animObj.panY });
        }
      });
      
      // Stagger card items scale and opacity
      const cardElems = containerRef.current?.querySelectorAll('.grid-card-item');
      if (cardElems && cardElems.length > 0) {
        gsap.fromTo(cardElems,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out', stagger: { each: 0.04, from: 'center' }, delay: 0.1 }
        );
      }
    } else {
      // Instantly reset coordinates and zoom when out of view
      setZoom(2.2);
      setPan({ x: 0, y: -250 });
    }
  }, [inView]);

  // ── Responsive card dimensions ────────────────────────────────────────────
  const isMobile = viewport.width < 768;
  const CARD_W = isMobile ? 260 : 360;
  const CARD_H = isMobile ? 195 : 270;
  const GAP    = isMobile ? 18  : 28;
  const CELL_W = CARD_W + GAP;
  const CELL_H = CARD_H + GAP;

  // ── Layout: compute world positions once per dimension change ─────────────
  const worldCards = useMemo(
    () => computeLayout(projectsList, CELL_W, CELL_H),
    [CELL_W, CELL_H]
  );

  // ── Viewport tracking ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewport({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Mouse drag ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragDistance.current = Math.hypot(dx, dy);
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...panRef.current };
    dragDistance.current = 0;
  };

  // ── Touch gestures (native listeners, passive:false so we can preventDefault) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      touchLock.current = { dir: null, locked: false };
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        setIsDragging(true);
        dragStart.current    = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStart.current     = { ...panRef.current };
        dragDistance.current = 0;
      } else if (e.touches.length === 2) {
        // Switch to pinch-zoom mode
        setIsDragging(false);
        isDraggingRef.current = false;
        touchStartDist.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        zoomStart.current = zoomRef.current;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        // Determine drag lock direction after moving past 8px threshold
        if (!touchLock.current.locked) {
          if (absX > 8 || absY > 8) {
            touchLock.current.dir = absX >= absY ? 'h' : 'v';
            touchLock.current.locked = true;
          } else {
            return; // Wait for direction resolution
          }
        }

        if (touchLock.current.dir === 'v') {
          // Vertical swipe: let native page scroll take over
          setIsDragging(false);
          isDraggingRef.current = false;
          dragDistance.current = 99; // Prevent accidental click triggers
          return; // Do NOT preventDefault
        }

        // Horizontal swipe: lock to grid pan and block native scrolling
        if (e.cancelable) e.preventDefault();
        dragDistance.current = Math.hypot(dx, dy);

        setPan({
          x: panStart.current.x + dx,
          y: panStart.current.y + dy,
        });
      } else if (e.touches.length === 2 && touchStartDist.current > 0) {
        // Pinch-to-zoom
        if (e.cancelable) e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        setZoom(Math.min(2.0, Math.max(0.3, zoomStart.current * (dist / touchStartDist.current))));
      }
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      isDraggingRef.current  = false;
      touchStartDist.current = 0;
      touchLock.current = { dir: null, locked: false };
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, []);

  // ── Ctrl+Scroll zoom (desktop trackpad pinch) ─────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => Math.min(2.0, Math.max(0.3, z - e.deltaY * 0.003)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── Viewport culling: only render cards visible in the current view ────────
  // Convert screen bounds to world space, then filter worldCards.
  const halfW = viewport.width  / 2;
  const halfH = viewport.height / 2;
  const worldLeft   = (-halfW - pan.x) / zoom - CARD_W;
  const worldRight  = ( halfW - pan.x) / zoom + CARD_W;
  const worldTop    = (-halfH - pan.y) / zoom - CARD_H;
  const worldBottom = ( halfH - pan.y) / zoom + CARD_H;

  const visibleCards = worldCards.filter(
    (c) =>
      c.worldX >= worldLeft  &&
      c.worldX <= worldRight &&
      c.worldY >= worldTop   &&
      c.worldY <= worldBottom
  );

  // ── Canvas transform: origin sits at viewport center ─────────────────────
  const canvasTransform = `translate3d(${halfW + pan.x}px, ${halfH + pan.y}px, 0) scale(${zoom})`;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onClick={() => {
        if (dragDistance.current <= 8) setActiveCardId(null);
      }}
      className={`relative w-full h-screen overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* ── Canvas Layer ─────────────────────────────────────────────────── */}
      <div
        style={{
          transform: canvasTransform,
          transformOrigin: 'center center',
          width: 0,
          height: 0,
          willChange: 'transform',
        }}
        className="absolute top-0 left-0 transition-transform duration-75 ease-out"
      >
        {visibleCards.map((project) => {
          const cardKey = String(project.id);
          const isActive = activeCardId === project.id;

          return (
            <div
              key={cardKey}
              style={{
                position: 'absolute',
                left: project.worldX - CARD_W / 2,
                top:  project.worldY - CARD_H / 2,
                width:  CARD_W,
                height: CARD_H,
              }}
              className="pointer-events-auto grid-card-item"
            >
              {/* ── HEADER / FEATURED CARD ─────────────────────────────── */}
              {project.type === 'featured' ? (
                <div className="flex flex-col justify-center items-center text-center px-6 h-full select-none">
                  <div className="w-10 h-px bg-vivid-crimson mb-4 opacity-60" />
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-pure-white mb-3 tracking-wide">
                    {project.title}
                  </h2>
                  <p className="font-body text-[10px] md:text-xs text-zinc-400 leading-relaxed max-w-[240px]">
                    {project.desc}
                  </p>
                  <div className="w-10 h-px bg-vivid-crimson mt-4 opacity-60" />
                </div>
              ) : (
                /* ── PROJECT CARD ──────────────────────────────────────── */
                <div
                  onMouseEnter={() => !isMobile && setActiveCardId(project.id)}
                  onMouseLeave={() => !isMobile && setActiveCardId(null)}
                  onClick={(e) => {
                    if (dragDistance.current <= 8) {
                      e.stopPropagation();
                      setActiveCardId((prev) => (prev === project.id ? null : project.id));
                    }
                  }}
                  className="w-full h-full group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-md shadow-lg transition-all duration-500 ease-out hover:scale-[1.03] hover:border-vivid-crimson/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(230,0,38,0.18)] select-none"
                >
                  {/* Front face */}
                  <div
                    style={{ opacity: isActive ? 0 : 1, pointerEvents: isActive ? 'none' : 'auto' }}
                    className="absolute inset-0 transition-opacity duration-300 overflow-hidden"
                  >
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.55] saturate-75 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        draggable={false}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-pure-black/25 via-transparent to-pure-black/80 z-[1]" />
                    <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-between z-10">
                      <span className="font-heading text-[9px] md:text-[11px] font-bold text-pure-white tracking-widest uppercase drop-shadow">
                        {project.title}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] md:text-[9px] text-zinc-400 uppercase tracking-widest">
                          {project.tag}
                        </span>
                        {!isMobile && (
                          <span className="font-body text-[8px] text-zinc-500 tracking-wider">
                            hover →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detail overlay */}
                  <div
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${isActive ? 0 : 12}px)`,
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                    className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md text-pure-white p-4 md:p-5 flex flex-col justify-between transition-all duration-300"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-heading text-[7px] md:text-[9px] font-bold text-vivid-crimson tracking-widest uppercase mb-1">
                        Project Details
                      </span>
                      <p className="font-body text-[10px] md:text-[11px] text-zinc-300 leading-relaxed font-light">
                        {project.desc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80">
                      <div className="flex gap-1 flex-wrap">
                        {(project.tags || (project.tag ? [project.tag] : [])).map((tag) => (
                          <span
                            key={tag}
                            className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = project.link || project.git;
                          if (url) window.open(url, '_blank');
                        }}
                        className={`text-[9px] font-heading font-black tracking-wider uppercase transition-colors duration-200 ${
                          project.link || project.git
                            ? 'text-vivid-crimson hover:text-pure-white cursor-pointer'
                            : 'text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        Explore →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 flex items-center gap-1.5 bg-pure-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-xl">
        {/* Desktop-only zoom buttons */}
        <button
          onClick={() => setZoom((z) => Math.min(2.0, +(z + 0.15).toFixed(2)))}
          className="hidden md:flex w-7 h-7 rounded-lg bg-zinc-900 text-pure-white items-center justify-center font-bold hover:bg-vivid-crimson hover:scale-105 transition-all cursor-pointer text-sm"
          title="Zoom In"
        >+</button>
        <span className="hidden md:inline-block text-zinc-400 text-[10px] font-mono w-9 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.15).toFixed(2)))}
          className="hidden md:flex w-7 h-7 rounded-lg bg-zinc-900 text-pure-white items-center justify-center font-bold hover:bg-vivid-crimson hover:scale-105 transition-all cursor-pointer text-sm"
          title="Zoom Out"
        >−</button>
        <div className="hidden md:block h-4 w-px bg-zinc-800 mx-0.5" />

        {/* Reset — always visible */}
        <button
          onClick={() => { setZoom(1.33); setPan({ x: 0, y: 0 }); setActiveCardId(null); }}
          className="px-2.5 h-7 rounded-lg bg-zinc-900 text-zinc-300 text-[10px] font-semibold flex items-center justify-center hover:bg-vivid-crimson hover:text-pure-white hover:scale-105 transition-all cursor-pointer"
          title="Reset view"
        >
          Reset
        </button>
      </div>

      {/* ── Mini-map indicator (shows total project count & position hint) ─ */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20 flex flex-col gap-1">
        <div className="bg-pure-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-900 text-[8px] md:text-[9px] text-zinc-400 font-mono pointer-events-none">
          {worldCards.length} projects · {Math.round(zoom * 100)}%
        </div>
        <div className="bg-pure-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-900 text-[7px] md:text-[8px] text-zinc-500 font-body tracking-wider uppercase pointer-events-none">
          {isMobile ? 'Drag · Pinch zoom' : 'Drag · Ctrl+scroll · Hover cards'}
        </div>
      </div>
    </div>
  );
}
