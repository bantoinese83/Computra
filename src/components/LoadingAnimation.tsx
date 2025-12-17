import React, { useEffect, useRef } from 'react';

interface LoadingAnimationProps {
  size?: number;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 180,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Store ctx in a const that TypeScript knows is non-null
    const context = ctx;

    const CANVAS_WIDTH = size;
    const CANVAS_HEIGHT = size;
    const MONOCHROME_FILL = (opacity: number) =>
      `rgba(165, 243, 252, ${Math.max(0, Math.min(1, opacity))})`; // ice-cyan color

    const GLOBAL_SPEED = 0.5;

    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const numDots = 100;
    const radius = 35;
    const height = 120;
    const dots: Array<{ angle: number; y: number }> = [];
    
    for (let i = 0; i < numDots; i++) {
      dots.push({ 
        angle: i * 0.3, 
        y: (i / numDots) * height - height / 2 
      });
    }

    let time = 0;
    let lastTime = 0;

    function animate(timestamp: number) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001 * GLOBAL_SPEED;

      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const loopDuration = 8;
      const seamlessProgress = Math.sin((time / loopDuration) * Math.PI * 2);
      const scanY = seamlessProgress * (height / 2);
      const scanWidth = 25;
      const trailLength = height * 0.3;

      dots.forEach((dot) => {
        const rotation = time;
        const x = radius * Math.cos(dot.angle + rotation);
        const z = radius * Math.sin(dot.angle + rotation);
        const pX = centerX + x;
        const pY = centerY + dot.y;
        const scale = (z + radius) / (radius * 2);
        const distToScan = Math.abs(dot.y - scanY);
        const leadingEdgeInfluence =
          distToScan < scanWidth
            ? Math.cos((distToScan / scanWidth) * (Math.PI / 2))
            : 0;
        let trailInfluence = 0;
        const distBehindScan = dot.y - scanY;
        const isMovingUp = Math.cos((time / loopDuration) * Math.PI * 2) > 0;
        if (
          isMovingUp &&
          distBehindScan < 0 &&
          Math.abs(distBehindScan) < trailLength
        ) {
          trailInfluence =
            Math.pow(1 - Math.abs(distBehindScan) / trailLength, 2) * 0.4;
        } else if (
          !isMovingUp &&
          distBehindScan > 0 &&
          Math.abs(distBehindScan) < trailLength
        ) {
          trailInfluence =
            Math.pow(1 - Math.abs(distBehindScan) / trailLength, 2) * 0.4;
        }
        const totalInfluence = Math.max(leadingEdgeInfluence, trailInfluence);
        const dotSize = Math.max(0, scale * 1.8 + totalInfluence * 2.8);
        const opacity = Math.max(0, scale * 0.4 + totalInfluence * 0.6);
        context.beginPath();
        context.arc(pX, pY, dotSize, 0, Math.PI * 2);
        context.fillStyle = MONOCHROME_FILL(opacity);
        context.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [size]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="absolute inset-0"
      />
    </div>
  );
};

export default LoadingAnimation;

