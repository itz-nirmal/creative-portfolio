import React, { useEffect, useRef } from 'react';

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const gridRef = useRef<any[]>([]);
  const timeRef = useRef(0);

  const getRandomColor = () => {
    const colors = ['#00ffff', '#ff1493', '#ffd700', '#9400d3', '#00ff7f'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const createParticles = (width: number, height: number) => {
    particlesRef.current = [];
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 2,
        color: getRandomColor(),
        alpha: Math.random() * 0.9 + 0.3,
        pulse: Math.random() * Math.PI * 2
      });
    }
  };

  const createDiagonalGrid = (width: number, height: number) => {
    gridRef.current = [];
    const gridSize = 120; // Bigger grid size as requested
    const diagonal = Math.sqrt(width * width + height * height);
    
    // Create diagonal lines from top-left to bottom-right
    for (let i = -diagonal; i < diagonal; i += gridSize) {
      gridRef.current.push({
        type: 'diagonal-right',
        offset: i,
        alpha: 0.08,
        animOffset: Math.random() * Math.PI * 2,
        flowOffset: Math.random() * 1000 // For motion flow animation
      });
    }
    
    // Create diagonal lines from top-right to bottom-left
    for (let i = -diagonal; i < diagonal; i += gridSize) {
      gridRef.current.push({
        type: 'diagonal-left',
        offset: i,
        alpha: 0.08,
        animOffset: Math.random() * Math.PI * 2,
        flowOffset: Math.random() * 1000 // For motion flow animation
      });
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 0.01;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(5, 5, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw diagonal grid as BACKGROUND (first layer)
    ctx.save();
    gridRef.current.forEach((line, index) => {
      const wave = Math.sin(timeRef.current * 40 + line.animOffset) * 0.4 + 0.6;
      
      // Motion flow animation - creates flowing effect
      const flowSpeed = timeRef.current * 80 + line.flowOffset;
      const flowEffect = Math.sin(flowSpeed * 0.008) * 0.3 + 0.7;
      
      ctx.globalAlpha = line.alpha * wave * flowEffect;
      
      // Subtle colors for background grid
      const gridColors = ['#00ffff', '#ff1493', '#ffd700'];
      const colorIndex = index % gridColors.length;
      ctx.strokeStyle = gridColors[colorIndex];
      
      ctx.lineWidth = 1;
      // Removed shadow effects to prevent negative color artifacts
      
      ctx.beginPath();
      if (line.type === 'diagonal-right') {
        // Top-left to bottom-right diagonal
        ctx.moveTo(line.offset, 0);
        ctx.lineTo(line.offset + canvas.height, canvas.height);
      } else {
        // Top-right to bottom-left diagonal
        ctx.moveTo(canvas.width - line.offset, 0);
        ctx.lineTo(canvas.width - line.offset - canvas.height, canvas.height);
      }
      ctx.stroke();
    });
    ctx.restore();

    // Draw particles (just dots, no lines)
    particlesRef.current.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.pulse += 0.05;

      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Pulsing effect
      const pulseAlpha = Math.sin(particle.pulse) * 0.3 + 0.7;

      // Draw particle (just colorful dots)
      ctx.save();
      ctx.globalAlpha = particle.alpha * pulseAlpha;
      ctx.fillStyle = particle.color;
      // Removed shadow effects to prevent negative color artifacts
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw multiple animated wave lines near the bottom
    const waveColors = ['#00ffff', '#ff1493', '#ffd700', '#9400d3', '#00ff7f'];
    const wavePositions = [0.7, 0.75, 0.8, 0.85, 0.9]; // Cluster waves towards the bottom
    
    waveColors.forEach((color, index) => {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      // Removed shadow effects to prevent negative color artifacts
      
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 4) {
        const baseY = canvas.height * wavePositions[index];
        const wave1 = Math.sin((x + timeRef.current * 80 + index * 50) * 0.01) * 30;
        const wave2 = Math.sin((x + timeRef.current * 120 + index * 80) * 0.005) * 20;
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
    createDiagonalGrid(canvas.width, canvas.height);
  };

  useEffect(() => {
    handleResize();
    animate();

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

export default HeroBackground;
