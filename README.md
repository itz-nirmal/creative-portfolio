# Taposi's Creative Portfolio 🎨

*A visual storyteller turning emotions into art and motion*

Welcome to Taposi's interactive portfolio website - a stunning showcase of graphic design, 2D animation, and 3D animation work. This modern, responsive portfolio features an animated hero section with role selection capabilities and an immersive animated background.

![Portfolio Preview](./src/assets/Taposi.png)

## ✨ Features

### 🎭 Interactive Hero Section
- **Dynamic Typing Animation**: Animated text revealing "Taposi", "Graphic Designer", "2D Animator", and "3D Animator"
- **Role Selection**: Interactive buttons to explore different creative roles
- **SVG Profile Integration**: Custom SVG with animated neon border effects and breathing animations
- **3D Hover Effects**: Engaging 3D transformations on user interaction

### 🌟 Animated Background
- **Particle System**: Flowing particles with customizable colors and physics
- **Geometric Shapes**: Animated triangles, squares, and hexagons with rotation effects
- **Dynamic Gradient**: Color-shifting radial gradient background
- **Energy Waves**: Multi-layered flowing wave animations
- **Performance Optimized**: Smooth 60fps animations with canvas rendering

### 🎨 Visual Design
- **Modern UI/UX**: Clean, professional design with stunning visual effects
- **Responsive Layout**: Fully responsive across desktop, tablet, and mobile devices
- **Accessibility**: Reduced motion support and keyboard navigation
- **Print Friendly**: Optimized print styles for offline viewing

### 🛠️ Technical Features
- **React 19** with TypeScript for type safety
- **Vite** for lightning-fast development and builds
- **ESLint** configuration for code quality
- **Modern CSS** with advanced animations and effects
- **Canvas-based** animations for optimal performance

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taposi-portfolio.git
   cd taposi-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The portfolio will load with hot module replacement enabled

## 📁 Project Structure

```
portfolio/
├── public/
│   └── vite.svg              # Vite favicon
├── src/
│   ├── assets/
│   │   ├── Taposi.png         # Profile image
│   │   └── react.svg          # React logo
│   ├── components/
│   │   ├── AnimatedBackground.tsx  # Canvas-based background animation
│   │   ├── Hero.tsx           # Main hero section component
│   │   └── Hero.css           # Hero section styles
│   ├── App.tsx                # Main application component
│   ├── App.css                # Global application styles
│   ├── index.css              # Base styles and CSS reset
│   ├── main.tsx               # Application entry point
│   └── vite-env.d.ts          # Vite type definitions
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML template
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # App-specific TypeScript config
├── tsconfig.node.json         # Node-specific TypeScript config
├── vite.config.ts             # Vite build configuration
└── README.md                  # Project documentation
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🎨 Customization Guide

### Updating Profile Information

1. **Replace Profile Image**
   - Add your image to `src/assets/`
   - Update the import in `src/components/Hero.tsx`
   ```tsx
   import YourImage from '../assets/YourImage.png';
   ```

2. **Modify Text Content**
   - Edit the typing animation words in `Hero.tsx`:
   ```tsx
   const words = ['YourName', 'Your Role 1', 'Your Role 2', 'Your Role 3'];
   ```
   - Update the bio text and role buttons as needed

3. **Customize Colors**
   - Primary colors in `AnimatedBackground.tsx`:
   ```tsx
   const colors = {
     primary: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'],
     accent: ['#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43']
   };
   ```
   - CSS color variables in `Hero.css`

### Animation Settings

1. **Typing Speed**
   ```tsx
   // In Hero.tsx - adjust timing values
   setTimeout(() => {
     setTypedText(currentWord.slice(0, typedText.length + 1));
   }, 100); // Typing speed
   ```

2. **Background Animation**
   ```tsx
   // In AnimatedBackground.tsx - particle count
   for (let i = 0; i < 80; i++) { // Reduce for better performance
   ```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## ♿ Accessibility Features

- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Indicators**: Clear focus styles for interactive elements
- **Screen Reader**: Semantic HTML structure
- **Color Contrast**: WCAG-compliant color combinations

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🔧 Technology Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| React | 19.1.0 | UI library |
| TypeScript | 5.8.3 | Type safety |
| Vite | 7.0.0 | Build tool |
| ESLint | 9.29.0 | Code linting |
| Canvas API | Native | Animations |

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Popular Platforms

**Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm run build
# Upload 'dist' folder to Netlify
```

**GitHub Pages**
```bash
npm install --save-dev gh-pages
# Add to package.json scripts:
# "deploy": "gh-pages -d dist"
npm run build
npm run deploy
```

## 🔄 Performance Optimization

### Bundle Analysis
```bash
npm run build -- --analyze
```

### Optimization Tips
1. **Image Optimization**: Use WebP format for images
2. **Code Splitting**: Implement lazy loading for additional sections
3. **Canvas Performance**: Reduce particle count on mobile devices
4. **CSS Optimization**: Use CSS containment for animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the blazing-fast build tool
- **Typography**: Modern sans-serif fonts for readability
- **Inspiration**: Contemporary portfolio designs and motion graphics

## 📞 Contact

For questions, suggestions, or collaboration opportunities:

- **Portfolio**: [Your Portfolio URL]
- **Email**: [your.email@example.com]
- **LinkedIn**: [Your LinkedIn Profile]
- **Behance**: [Your Behance Profile]

---

*Made with ❤️ and ☕ by Taposi - Visual Storyteller*
