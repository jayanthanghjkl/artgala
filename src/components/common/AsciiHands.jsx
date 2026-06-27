import React, { useEffect, useRef } from 'react';

/**
 * Helper to calculate squared distance from point (px, py) to line segment (ax, ay) -> (bx, by).
 * Extremely fast as it avoids Math.sqrt.
 */
function distToSegmentSq(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return (px - ax) * (px - ax) + (py - ay) * (py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return (px - cx) * (px - cx) + (py - cy) * (py - cy);
}

/**
 * Returns line segments representing a single hand in global coordinates.
 * Generates knuckles and fingers locally, then transforms them by position, orientation, and scale.
 */
function getHandLines(wrist, u, v, scale, handType) {
  const isLeft = handType === 'left';
  const ySign = isLeft ? 1 : -1;

  // Local Knuckle Coordinates (X-axis is pointing direction, Y-axis is perpendicular)
  const knuckles = {
    thumb: [3, 1.8 * ySign],
    index: [5, 0],
    middle: [5.2, -1 * ySign],
    ring: [5, -2 * ySign],
    pinky: [4.5, -3 * ySign]
  };

  const lines = [];

  // Helper to convert local coordinates to global grid coordinates
  const localToGlobal = (pt) => {
    const [lx, ly] = pt;
    return {
      x: wrist.x + (lx * u.x + ly * v.x) * scale,
      y: wrist.y + (lx * u.y + ly * v.y) * scale
    };
  };

  const ptWristUpper = localToGlobal([0, 1 * ySign]);
  const ptWristLower = localToGlobal([0, -1 * ySign]);
  const ptThumbKnuckle = localToGlobal(knuckles.thumb);
  const ptIndexKnuckle = localToGlobal(knuckles.index);
  const ptPinkyKnuckle = localToGlobal(knuckles.pinky);

  // 1. Palm Outline & Creases
  lines.push({ a: ptWristLower, b: ptPinkyKnuckle });
  lines.push({ a: ptPinkyKnuckle, b: ptIndexKnuckle });
  lines.push({ a: ptIndexKnuckle, b: ptThumbKnuckle });
  lines.push({ a: ptThumbKnuckle, b: ptWristUpper });

  // Palm creases (adds organic details)
  lines.push({ a: localToGlobal([1.5, 0.5 * ySign]), b: localToGlobal([4, -1.5 * ySign]) });
  lines.push({ a: localToGlobal([2.0, 1.0 * ySign]), b: localToGlobal([4.5, 0]) });

  // 2. Index Finger (Extended/Pointing)
  const ptIndexJoint = localToGlobal([9, 0]);
  const ptIndexTip = localToGlobal([13, 0]);
  lines.push({ a: ptIndexKnuckle, b: ptIndexJoint });
  lines.push({ a: ptIndexJoint, b: ptIndexTip });

  // 3. Middle Finger (Curled)
  const ptMiddleJ1 = localToGlobal([7.5, -0.8 * ySign]);
  const ptMiddleJ2 = localToGlobal([8.0, -2.2 * ySign]);
  const ptMiddleTip = localToGlobal([6.0, -2.5 * ySign]);
  lines.push({ a: localToGlobal(knuckles.middle), b: ptMiddleJ1 });
  lines.push({ a: ptMiddleJ1, b: ptMiddleJ2 });
  lines.push({ a: ptMiddleJ2, b: ptMiddleTip });

  // 4. Ring Finger (Curled)
  const ptRingJ1 = localToGlobal([7.0, -1.8 * ySign]);
  const ptRingJ2 = localToGlobal([7.5, -3.0 * ySign]);
  const ptRingTip = localToGlobal([5.8, -3.2 * ySign]);
  lines.push({ a: localToGlobal(knuckles.ring), b: ptRingJ1 });
  lines.push({ a: ptRingJ1, b: ptRingJ2 });
  lines.push({ a: ptRingJ2, b: ptRingTip });

  // 5. Pinky Finger (Curled)
  const ptPinkyJ1 = localToGlobal([6.0, -2.8 * ySign]);
  const ptPinkyJ2 = localToGlobal([6.5, -3.8 * ySign]);
  const ptPinkyTip = localToGlobal([5.0, -4.0 * ySign]);
  lines.push({ a: ptPinkyKnuckle, b: ptPinkyJ1 });
  lines.push({ a: ptPinkyJ1, b: ptPinkyJ2 });
  lines.push({ a: ptPinkyJ2, b: ptPinkyTip });

  // 6. Thumb (Extended/Relaxed)
  const ptThumbJ1 = localToGlobal([5.0, 3.0 * ySign]);
  const ptThumbTip = localToGlobal([6.5, 2.3 * ySign]);
  lines.push({ a: ptThumbKnuckle, b: ptThumbJ1 });
  lines.push({ a: ptThumbJ1, b: ptThumbTip });

  return lines;
}

export default function AsciiHands({ opacity = 0.2 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Interaction refs
  const mouseActiveRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  
  // Animation states
  const timeRef = useRef(0);
  const pRef = useRef(0.0); // Entrance progress (0 to 0.95)
  const currentMRef = useRef({ x: 0, y: 0 }); // Current connection point (grid units)

  useEffect(() => {
    // 1. Mouse Tracking window-bound listeners so they register hover anywhere on page
    const handleWindowPointerMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleWindowPointerEnter = () => {
      mouseActiveRef.current = true;
    };

    const handleWindowPointerLeave = () => {
      mouseActiveRef.current = false;
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerenter", handleWindowPointerEnter);
    window.addEventListener("pointerleave", handleWindowPointerLeave);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    // Font metrics setup
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const fontSize = isMobile ? 18 : 11;
    ctx.font = `${fontSize}px Courier New, Courier, monospace`;
    const charWidth = ctx.measureText('X').width || (isMobile ? 11 : 7);
    const charHeight = fontSize * 1.1;

    // Handle resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: boxWidth, height: boxHeight } = entry.contentRect;
        width = boxWidth;
        height = boxHeight;

        // Keep 1:1 canvas pixels to client size
        canvas.width = width;
        canvas.height = height;

        // Initialize meeting point to center on first resize
        if (currentMRef.current.x === 0 && currentMRef.current.y === 0) {
          const cols = Math.floor(width / charWidth);
          const rows = Math.floor(height / charHeight);
          currentMRef.current = { x: cols / 2, y: rows / 2 };
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Animation Loop
    const tick = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      timeRef.current += 1;
      const time = timeRef.current;

      const cols = Math.floor(width / charWidth);
      const rows = Math.floor(height / charHeight);

      // Mouse Lerping & Targets
      let targetM;
      if (mouseActiveRef.current) {
        targetM = {
          x: mousePosRef.current.x / charWidth,
          y: mousePosRef.current.y / charHeight
        };
      } else {
        targetM = { x: cols / 2, y: rows / 2 };
      }

      // Smoothly update current meeting point (M)
      currentMRef.current.x += (targetM.x - currentMRef.current.x) * 0.07;
      currentMRef.current.y += (targetM.y - currentMRef.current.y) * 0.07;
      const currentM = currentMRef.current;

      // Entrance Easing and Breathing
      const targetP = 0.95 + 0.015 * Math.sin(time * 0.04);
      pRef.current += (targetP - pRef.current) * 0.04;
      const p = pRef.current;

      // Define Bases & Reach Boundaries
      // Arm bases come from corners of the grid
      const BL = { x: -0.15 * cols, y: -0.05 * rows };
      const BR = { x: 1.15 * cols, y: 1.05 * rows };

      // Determine initial fingertips targeting
      let TL = { x: BL.x + (currentM.x - BL.x) * p, y: BL.y + (currentM.y - BL.y) * p };
      let TR = { x: BR.x + (currentM.x - BR.x) * p, y: BR.y + (currentM.y - BR.y) * p };

      // Arm reach clamping (prevents arms from detaching/overstretching)
      const centerGrid = { x: cols / 2, y: rows / 2 };
      const baseReach = Math.sqrt((centerGrid.x - BL.x) ** 2 + (centerGrid.y - BL.y) ** 2);
      const maxReach = baseReach * 1.35;

      const dxL = TL.x - BL.x;
      const dyL = TL.y - BL.y;
      const distL = Math.sqrt(dxL * dxL + dyL * dyL);
      if (distL > maxReach) {
        TL.x = BL.x + dxL * (maxReach / distL);
        TL.y = BL.y + dyL * (maxReach / distL);
      }

      const dxR = TR.x - BR.x;
      const dyR = TR.y - BR.y;
      const distR = Math.sqrt(dxR * dxR + dyR * dyR);
      if (distR > maxReach) {
        TR.x = BR.x + dxR * (maxReach / distR);
        TR.y = BR.y + dyR * (maxReach / distR);
      }

      // Calculate Orientation Vectors & Wrist Positions
      const scale = Math.max(1.0, Math.min(2.4, (cols * 0.22) / 13));
      const handLength = 13 * scale;

      // Left hand vectors
      const lenL = Math.sqrt((TL.x - BL.x) ** 2 + (TL.y - BL.y) ** 2) || 1;
      const uL = { x: (TL.x - BL.x) / lenL, y: (TL.y - BL.y) / lenL };
      const vL = { x: -uL.y, y: uL.x };
      const WL = { x: TL.x - handLength * uL.x, y: TL.y - handLength * uL.y };

      // Right hand vectors
      const lenR = Math.sqrt((TR.x - BR.x) ** 2 + (TR.y - BR.y) ** 2) || 1;
      const uR = { x: (TR.x - BR.x) / lenR, y: (TR.y - BR.y) / lenR };
      const vR = { x: -uR.y, y: uR.x };
      const WR = { x: TR.x - handLength * uR.x, y: TR.y - handLength * uR.y };

      // Gather All Line Segments
      const lines = [];
      lines.push(...getHandLines(WL, uL, vL, scale, 'left'));
      lines.push(...getHandLines(WR, uR, vR, scale, 'right'));

      // Tapered sleeves extending from screen corners to wrists
      lines.push({
        a: { x: BL.x + 3.5 * scale * vL.x, y: BL.y + 3.5 * scale * vL.y },
        b: { x: WL.x + 1.0 * scale * vL.x, y: WL.y + 1.0 * scale * vL.y }
      });
      lines.push({
        a: { x: BL.x - 3.5 * scale * vL.x, y: BL.y - 3.5 * scale * vL.y },
        b: { x: WL.x - 1.0 * scale * vL.x, y: WL.y - 1.0 * scale * vL.y }
      });

      lines.push({
        a: { x: BR.x + 3.5 * scale * vR.x, y: BR.y + 3.5 * scale * vR.y },
        b: { x: WR.x + 1.0 * scale * vR.x, y: WR.y + 1.0 * scale * vR.y }
      });
      lines.push({
        a: { x: BR.x - 3.5 * scale * vR.x, y: BR.y - 3.5 * scale * vR.y },
        b: { x: WR.x - 1.0 * scale * vR.x, y: WR.y - 1.0 * scale * vR.y }
      });

      // Clear with solid black (or transparent if layered, but black creates contrast)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const gradX = currentM.x * charWidth;
      const gradY = currentM.y * charHeight;
      const gradient = ctx.createRadialGradient(
        gradX, gradY, 0,
        gradX, gradY, Math.max(width, height) * 0.7
      );
      gradient.addColorStop(0, '#ffffff');      // Bright spark core
      gradient.addColorStop(0.12, '#ff6e8a');    // Neon light pinkish-red
      gradient.addColorStop(0.35, '#e60026');    // Vivid crimson portfolio theme
      gradient.addColorStop(0.65, '#5c0010');    // Dark burgundy shadow
      gradient.addColorStop(1.0, '#000000');     // Faded out dark edge

      ctx.fillStyle = gradient;
      ctx.font = `${fontSize}px Courier New, Courier, monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // Calculate connection spark state
      const tipDist = Math.sqrt((TL.x - TR.x) ** 2 + (TL.y - TR.y) ** 2);
      const isConnecting = tipDist < 2.5 && p > 0.85;

      // Render Character Grid
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let char = ' ';

          // A. Meeting Point Spark
          const dxM = c - currentM.x;
          const dyM = r - currentM.y;
          const distToM = Math.sqrt(dxM * dxM + dyM * dyM);

          if (isConnecting && distToM < 2.2) {
            const noiseVal = Math.sin(time * 0.4 + c * 1.5 + r * 2.0);
            if (noiseVal > 0.3) {
              char = ['*', '+', 'x', '%', 'o'][Math.floor(((noiseVal + 1) * 3) % 5)];
            } else if (distToM < 0.8) {
              char = '#';
            }
          }

          // B. Hand line rendering via SDF
          if (char === ' ') {
            let minDistSq = Infinity;
            for (let i = 0; i < lines.length; i++) {
              const dSq = distToSegmentSq(c, r, lines[i].a.x, lines[i].a.y, lines[i].b.x, lines[i].b.y);
              if (dSq < minDistSq) {
                minDistSq = dSq;
              }
            }
            const d = Math.sqrt(minDistSq);
            const thickness = 2.8;

            if (d < thickness) {
              const t = 1 - d / thickness;
              const chars = "  .-:=+*#%@";
              const idx = Math.floor(t * (chars.length - 1));
              char = chars[idx];
            }
          }

          // C. Faint mouse ripples
          if (char === ' ' && mouseActiveRef.current && !isMobile) {
            const mouseGrid = {
              x: mousePosRef.current.x / charWidth,
              y: mousePosRef.current.y / charHeight
            };
            const dxMouse = c - mouseGrid.x;
            const dyMouse = r - mouseGrid.y;
            const distToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distToMouse < 26) {
              const ripplePhase = distToMouse * 0.45 - time * 0.12;
              const wave = Math.sin(ripplePhase);
              const amplitude = (1 - distToMouse / 26) * 0.18;

              if (Math.abs(wave) < 0.15 && Math.random() < amplitude) {
                char = '.';
              }
            }
          }

          // D. Draw character directly if it is not empty space
          if (char !== ' ') {
            ctx.fillText(char, c * charWidth, r * charHeight);
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerenter", handleWindowPointerEnter);
      window.removeEventListener("pointerleave", handleWindowPointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none select-none bg-black overflow-hidden z-0"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
