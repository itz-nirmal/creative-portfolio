import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero-container" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #000000 100%)' }}>
      {/* Profile Halo - positioned for profile image overlay */}
      <div className="profile-halo" />
      
      {/* Hero Content */}
      <div className="hero-content">
        <div className="content-wrapper">
          <h1 className="hero-title">Creative Vision</h1>
          <p className="hero-subtitle">3D Animation • 2D Art • Graphic Design</p>
          <button className="cta-button" onClick={() => console.log('View Portfolio clicked')}>
            View Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
