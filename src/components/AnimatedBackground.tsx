import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  pulse: number;
}

interface GeometricShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'triangle' | 'square' | 'hexagon';
  color: string;
  alpha: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const shapesRef = useRef<GeometricShape[]>([]);

  const colors = {
    primary: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'],
    accent: ['#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'],
    gradient: {
      dark: '#0F0F23',
      mid: '#1A1A2E',
      light: '#16213E'
    }
  };

  const createParticles = (width: number, height: number) => {
    particlesRef.current = [];
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 2,
        color: colors.primary[Math.floor(Math.random() * colors.primary.length)],
        alpha: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  };

  const createGeometricShapes = (width: number, height: number) => {
    shapesRef.current = [];
    const shapeTypes: GeometricShape['type'][] = ['triangle', 'square', 'hexagon'];
    for (let i = 0; i < 12; i++) {
      shapesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 40 + 20,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: colors.accent[Math.floor(Math.random() * colors.accent.length)],
        alpha: 0.1
      });
    }
  };

  const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size * 0.866, y + size * 0.5);
    ctx.lineTo(x + size * 0.866, y + size * 0.5);
    ctx.closePath();
  };

  const drawSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.rect(x - size, y - size, size * 2, size * 2);
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dynamic gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    const hueShift = Math.sin(timeRef.current * 0.01) * 30;
    gradient.addColorStop(0, `hsl(${240 + hueShift}, 40%, 8%)`);
    gradient.addColorStop(0.5, `hsl(${260 + hueShift}, 50%, 12%)`);
    gradient.addColorStop(1, `hsl(${220 + hueShift}, 60%, 5%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid animation removed - clean background only
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current++;
    
    // Clear and draw background
    drawBackground(ctx, canvas.width, canvas.height);
    
    // Draw geometric shapes
    shapesRef.current.forEach(shape => {
      ctx.save();
      ctx.globalAlpha = shape.alpha + Math.sin(timeRef.current * 0.01 + shape.x * 0.01) * 0.05;
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      
      shape.rotation += shape.rotationSpeed;
      
      // Slow drift movement
      shape.x += Math.sin(timeRef.current * 0.005 + shape.y * 0.001) * 0.3;
      shape.y += Math.cos(timeRef.current * 0.005 + shape.x * 0.001) * 0.3;
      
      // Wrap around screen
      if (shape.x < -100) shape.x = canvas.width + 100;
      if (shape.x > canvas.width + 100) shape.x = -100;
      if (shape.y < -100) shape.y = canvas.height + 100;
      if (shape.y > canvas.height + 100) shape.y = -100;
      
      // Draw the shape
      switch (shape.type) {
        case 'triangle':
          drawTriangle(ctx, 0, 0, shape.size);
          break;
        case 'square':
          drawSquare(ctx, 0, 0, shape.size);
          break;
        case 'hexagon':
          drawHexagon(ctx, 0, 0, shape.size);
          break;
      }
      ctx.stroke();
      ctx.restore();
    });
    
    // Draw flowing particles
    particlesRef.current.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.pulse += 0.03;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      // Pulsing effect
      const pulseAlpha = Math.sin(particle.pulse) * 0.3 + 0.7;
      
      ctx.save();
      ctx.globalAlpha = particle.alpha * pulseAlpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    
    // Draw flowing energy waves
    const waveColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
    waveColors.forEach((color, index) => {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 6) {
        const baseY = canvas.height * (0.7 + index * 0.05);
        const wave1 = Math.sin((x + timeRef.current * 3 + index * 100) * 0.008) * 40;
        const wave2 = Math.sin((x + timeRef.current * 2 + index * 150) * 0.012) * 25;
        const y = baseY + wave1 + wave2;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles(canvas.width, canvas.height);
    createGeometricShapes(canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize
    handleResize();
    animate();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        background: 'radial-gradient(circle at 50% 50%, #0f0f23 0%, #000000 100%)',
      }}
    />
  );
};

export default AnimatedBackground;
