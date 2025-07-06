import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

interface GridLine {
  type: 'vertical' | 'horizontal';
  x?: number;
  y?: number;
  alpha: number;
  offset: number;
}

interface Shape {
  type: 'wireframeSphere' | 'glassyCube' | 'origami';
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  drift: { x: number; y: number };
}

interface RibbonPoint {
  x: number;
  y: number;
  originalY: number;
}

interface Ribbon {
  points: RibbonPoint[];
  color: string;
  alpha: number;
  wave: number;
  amplitude: number;
}

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const gridLinesRef = useRef<GridLine[]>([]);
  const shapesRef = useRef<Shape[]>([]);
  const ribbonsRef = useRef<Ribbon[]>([]);

  const getRandomColor = (): string => {
    const colors = ['#00ffff', '#ff1493', '#ffd700', '#9400d3', '#00ff7f'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const createParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: getRandomColor(),
        alpha: Math.random() * 0.8 + 0.2,
        life: Math.random() * 1000
      });
    }
    return particles;
  };

  const createGridLines = (width: number, height: number) => {
    const gridLines: GridLine[] = [];
    const spacing = 80;
    
    for (let x = 0; x < width; x += spacing) {
      gridLines.push({
        type: 'vertical',
        x: x,
        alpha: 0.1,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    for (let y = 0; y < height; y += spacing) {
      gridLines.push({
        type: 'horizontal',
        y: y,
        alpha: 0.1,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    return gridLines;
  };

  const createShapes = (width: number, height: number) => {
    const shapes: Shape[] = [];
    const shapeTypes: Shape['type'][] = ['wireframeSphere', 'glassyCube', 'origami'];
    
    for (let i = 0; i < 6; i++) {
      shapes.push({
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 60 + 30,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        alpha: 0.3,
        drift: {
          x: (Math.random() - 0.5) * 0.3,
          y: (Math.random() - 0.5) * 0.3
        }
      });
    }
    
    return shapes;
  };

  const createRibbons = (width: number, height: number) => {
    const ribbons: Ribbon[] = [];
    
    for (let i = 0; i < 3; i++) {
      const points: RibbonPoint[] = [];
      const segments = 20;
      
      for (let j = 0; j < segments; j++) {
        const originalY = height * 0.5 + Math.sin(j * 0.5) * 100;
        points.push({
          x: (j / segments) * width,
          y: originalY,
          originalY: originalY
        });
      }
      
      ribbons.push({
        points: points,
        color: getRandomColor(),
        alpha: 0.15,
        wave: Math.random() * Math.PI * 2,
        amplitude: 50 + Math.random() * 50
      });
    }
    
    return ribbons;
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    particlesRef.current.forEach(particle => {
      // Mouse interaction
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.vx += dx * force * 0.0001;
        particle.vy += dy * force * 0.0001;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life += 1;

      // Wrap around screen
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      // Pulsing effect
      const pulse = Math.sin(timeRef.current * 0.005 + particle.life * 0.01) * 0.5 + 0.5;
      
      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.alpha * pulse;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  const drawGridLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    
    gridLinesRef.current.forEach(line => {
      const wave = Math.sin(timeRef.current * 0.003 + line.offset) * 0.5 + 0.5;
      ctx.globalAlpha = line.alpha * wave;
      
      ctx.beginPath();
      if (line.type === 'vertical' && line.x !== undefined) {
        ctx.moveTo(line.x, 0);
        ctx.lineTo(line.x, height);
      } else if (line.type === 'horizontal' && line.y !== undefined) {
        ctx.moveTo(0, line.y);
        ctx.lineTo(width, line.y);
      }
      ctx.stroke();
    });
    ctx.restore();
  };

  const drawWireframeSphere = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = '#ff1493';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff1493';
    
    // Draw meridians
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * Math.cos(i * Math.PI / 8), i * Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw parallels
    for (let i = 1; i < 4; i++) {
      const radius = size * Math.sin(i * Math.PI / 4);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawGlassyCube = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = '#00ffff';
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    
    const half = size / 2;
    
    // Front face
    ctx.beginPath();
    ctx.rect(-half, -half, size, size);
    ctx.fill();
    ctx.stroke();
    
    // 3D effect lines
    ctx.beginPath();
    ctx.moveTo(half, -half);
    ctx.lineTo(half + 20, -half - 20);
    ctx.lineTo(-half + 20, -half - 20);
    ctx.lineTo(-half, -half);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(half, half);
    ctx.lineTo(half + 20, half - 20);
    ctx.lineTo(half + 20, -half - 20);
    ctx.stroke();
  };

  const drawOrigami = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = '#ffd700';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffd700';
    
    const points = 6;
    const outerRadius = size;
    const innerRadius = size * 0.5;
    
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawShapes = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    shapesRef.current.forEach(shape => {
      ctx.save();
      ctx.globalAlpha = shape.alpha;
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      
      shape.rotation += shape.rotationSpeed;
      shape.x += shape.drift.x;
      shape.y += shape.drift.y;
      
      // Wrap around
      if (shape.x < -100) shape.x = width + 100;
      if (shape.x > width + 100) shape.x = -100;
      if (shape.y < -100) shape.y = height + 100;
      if (shape.y > height + 100) shape.y = -100;

      switch (shape.type) {
        case 'wireframeSphere':
          drawWireframeSphere(ctx, shape.size);
          break;
        case 'glassyCube':
          drawGlassyCube(ctx, shape.size);
          break;
        case 'origami':
          drawOrigami(ctx, shape.size);
          break;
      }
      
      ctx.restore();
    });
  };

  const drawRibbons = (ctx: CanvasRenderingContext2D) => {
    ribbonsRef.current.forEach(ribbon => {
      ctx.save();
      ctx.globalAlpha = ribbon.alpha;
      ctx.strokeStyle = ribbon.color;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = ribbon.color;
      
      // Update ribbon wave
      ribbon.wave += 0.02;
      
      ctx.beginPath();
      ribbon.points.forEach((point, index) => {
        point.y = point.originalY + Math.sin(ribbon.wave + index * 0.3) * ribbon.amplitude;
        
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
      ctx.restore();
    });
  };

  const drawWaves = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = 0.3;
    
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = i === 0 ? '#00ffff' : i === 1 ? '#ff1493' : '#ffd700';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = ctx.strokeStyle;
      
      ctx.beginPath();
      for (let x = 0; x < width; x += 5) {
        const y = height * 0.7 + 
                 Math.sin((x + timeRef.current * 2) * 0.01 + i * Math.PI * 0.5) * 80 +
                 Math.sin((x + timeRef.current * 1.5) * 0.005 + i * Math.PI * 0.3) * 40;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  };


  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = event.clientX - rect.left;
    mouseRef.current.y = event.clientY - rect.top;
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Recreate elements for new canvas size
    particlesRef.current = createParticles(canvas.width, canvas.height);
    gridLinesRef.current = createGridLines(canvas.width, canvas.height);
    shapesRef.current = createShapes(canvas.width, canvas.height);
    ribbonsRef.current = createRibbons(canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initial setup
    handleResize();
    
    // Start animation
    const startAnimation = () => {
      const animateFrame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        timeRef.current++;
        
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw all elements
        drawWaves(ctx, canvas.width, canvas.height);
        drawGridLines(ctx, canvas.width, canvas.height);
        drawRibbons(ctx);
        drawShapes(ctx, canvas.width, canvas.height);
        drawParticles(ctx, canvas.width, canvas.height);
        
        animationRef.current = requestAnimationFrame(animateFrame);
      };
      animateFrame();
    };
    
    startAnimation();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
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
      onMouseMove={handleMouseMove}
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

export default HeroBackground;
