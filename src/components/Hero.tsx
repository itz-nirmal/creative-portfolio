import React, { useState, useEffect } from 'react';
import AnimatedBackground from './AnimatedBackground';
import TaposiImage from '../assets/Taposi.png';
import './Hero.css';

const Hero: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [isTyping] = useState<boolean>(true);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const words = ['Taposi', 'Graphic Designer', '2D Animator', '3D Animator'];
  const currentWord = words[currentWordIndex];

  useEffect(() => {
    let timeoutId: number;
    
    if (!isDeleting && typedText.length < currentWord.length) {
      // Typing
      timeoutId = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length + 1));
      }, 100);
    } else if (!isDeleting && typedText.length === currentWord.length) {
      // Pause before deleting
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && typedText.length > 0) {
      // Deleting
      timeoutId = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length - 1));
      }, 80);
    } else if (isDeleting && typedText.length === 0) {
      // Move to next word
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }
    
    return () => clearTimeout(timeoutId);
  }, [typedText, currentWord, isDeleting, currentWordIndex]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    console.log(`Selected role: ${role}`);
  };

  return (
    <div className="hero-container">
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="hero-content">
        {/* Left Side - Text Content */}
        <div className="content-left">
          <div className="intro-text">
            <h1 className="hero-title">
              Hi, I'm <span className="name-highlight">
                {typedText}
                {isTyping && <span className="cursor">|</span>}
              </span>
            </h1>
            <p className="hero-bio">
              — a visual storyteller turning emotions into art 🎨 and motion 📽.<br/>
              From thoughtful design 🖌️ to expressive 2D & 3D animation 🎞️, I craft work that connects on a deeper level -`♡´-.<br/>
              Let's create something that truly speaks to hearts 💫<br/>
              👉 Explore my world or reach out — your 🫵 story deserves to be seen 👀♥︎.
            </p>
            
            <div className="role-selection">
              <p className="choose-text">Choose me as</p>
              <div className="role-buttons">
                <button 
                  className={`role-btn ${selectedRole === 'graphic-designer' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('graphic-designer')}
                >
                  <span className="btn-icon">🎨</span>
                  <span className="btn-text">Graphic Designer</span>
                </button>
                <button 
                  className={`role-btn ${selectedRole === '2d-animator' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('2d-animator')}
                >
                  <span className="btn-icon">📽️</span>
                  <span className="btn-text">2D Animator</span>
                </button>
                <button 
                  className={`role-btn ${selectedRole === '3d-animator' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('3d-animator')}
                >
                  <span className="btn-icon">🎞️</span>
                  <span className="btn-text">3D Animator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - SVG with Image */}
        <div className="content-right">
          <div className="svg-image-container">
            {/* SVG with integrated image and neon border */}
            <div className="svg-wrapper">
              <svg className="hero-svg" viewBox="0 0 680 680" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Filters */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  
                  <filter id="neonBorder">
                    <feGaussianBlur stdDeviation="6" result="glowBlur"/>
                    <feMerge>
                      <feMergeNode in="glowBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  
                  {/* Static gradients */}
                  <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.3"/>
                    <stop offset="50%" stopColor="#45B7D1" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#474bff" stopOpacity="0.3"/>
                  </linearGradient>
                  
                  <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff">
                      <animate attributeName="stop-color" values="#ffffff;#f0f0f0;#ffffff;#e8e8e8;#ffffff" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%" stopColor="#e8e8e8">
                      <animate attributeName="stop-color" values="#e8e8e8;#ffffff;#f0f0f0;#ffffff;#e8e8e8" dur="3s" repeatCount="indefinite"/>
                    </stop>
                  </linearGradient>
                </defs>
                
                {/* Main SVG shape with image */}
                <path 
                  fill="url(#neonGradient)" 
                  filter="url(#glow)"
                  d="M406,289.5Q377,339,341.5,391.5Q306,444,238,449.5Q170,455,136,397.5Q102,340,78,290Q54,240,54,172.5Q54,105,116,77Q178,49,236,61.5Q294,74,363,87Q432,100,433.5,170Q435,240,406,289.5Z"
                  className="svg-path"
                />
                
                {/* Clip path for image */}
                <defs>
                  <clipPath id="imageClip">
                    <path d="M406,289.5Q377,339,341.5,391.5Q306,444,238,449.5Q170,455,136,397.5Q102,340,78,290Q54,240,54,172.5Q54,105,116,77Q178,49,236,61.5Q294,74,363,87Q432,100,433.5,170Q435,240,406,289.5Z"/>
                  </clipPath>
                </defs>
                
                {/* Image with clip path - scaled and centered */}
                <image 
                  href={TaposiImage} 
                  x="0" 
                  y="75" 
                  width="500" 
                  height="500" 
                  preserveAspectRatio="xMidYMid meet" 
                  clipPath="url(#imageClip)"
                  opacity="0.95"
                  className="svg-image"
                />
                
                {/* Neon border with breathing effect */}
                <path 
                  fill="none" 
                  stroke="url(#borderGradient)" 
                  strokeWidth="3"
                  filter="url(#neonBorder)"
                  d="M406,289.5Q377,339,341.5,391.5Q306,444,238,449.5Q170,455,136,397.5Q102,340,78,290Q54,240,54,172.5Q54,105,116,77Q178,49,236,61.5Q294,74,363,87Q432,100,433.5,170Q435,240,406,289.5Z"
                  className="svg-border"
                >
                  <animate attributeName="stroke-width" values="3;6;3" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
