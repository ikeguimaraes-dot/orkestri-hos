import React, { useEffect, useState } from 'react';

interface BackgroundOrbsProps {
  wallpaper?: 'midnight' | 'violet' | 'cyan' | 'aurora';
}

export const BackgroundOrbs: React.FC<BackgroundOrbsProps> = ({ wallpaper = 'midnight' }) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getWallpaperColors = () => {
    switch (wallpaper) {
      case 'violet':
        return {
          orb1: 'from-purple-600/40 via-violet-600/30 to-indigo-900/10',
          orb2: 'from-fuchsia-600/35 via-pink-600/25 to-purple-950/10',
          orb3: 'from-blue-600/30 via-indigo-700/20 to-transparent',
          bg: 'bg-[#090614]'
        };
      case 'cyan':
        return {
          orb1: 'from-cyan-500/40 via-teal-600/30 to-blue-900/10',
          orb2: 'from-blue-600/35 via-indigo-600/25 to-slate-950/10',
          orb3: 'from-emerald-500/30 via-teal-700/20 to-transparent',
          bg: 'bg-[#040c16]'
        };
      case 'aurora':
        return {
          orb1: 'from-emerald-500/40 via-cyan-600/30 to-indigo-950/10',
          orb2: 'from-violet-600/35 via-fuchsia-600/25 to-purple-950/10',
          orb3: 'from-teal-400/30 via-blue-700/20 to-transparent',
          bg: 'bg-[#050e12]'
        };
      case 'midnight':
      default:
        return {
          orb1: 'from-violet-600/35 via-indigo-600/25 to-blue-950/5',
          orb2: 'from-cyan-500/35 via-blue-600/25 to-slate-950/10',
          orb3: 'from-fuchsia-600/30 via-purple-700/20 to-transparent',
          bg: 'bg-[#060713]'
        };
    }
  };

  const colors = getWallpaperColors();

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-1000 ${colors.bg}`}>
      {/* Deep Mesh Background */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(at 10% 20%, rgba(138, 43, 226, 0.25) 0px, transparent 50%),
            radial-gradient(at 90% 10%, rgba(0, 242, 254, 0.22) 0px, transparent 50%),
            radial-gradient(at 50% 85%, rgba(247, 37, 133, 0.18) 0px, transparent 50%),
            radial-gradient(at 80% 80%, rgba(16, 185, 129, 0.16) 0px, transparent 50%)
          `
        }}
      />

      {/* Floating Liquid Orb 1 - Violet/Indigo */}
      <div 
        className={`absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br ${colors.orb1} blur-[90px] animate-orb-1`}
      />

      {/* Floating Liquid Orb 2 - Cyan/Neon Blue */}
      <div 
        className={`absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl ${colors.orb2} blur-[100px] animate-orb-2`}
      />

      {/* Floating Liquid Orb 3 - Magenta/Deep Violet */}
      <div 
        className={`absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tr ${colors.orb3} blur-[110px] animate-orb-3`}
      />

      {/* Dynamic Cursor Specular Glow */}
      <div 
        className="absolute w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-400/12 via-indigo-400/8 to-fuchsia-400/10 blur-[80px] transition-transform duration-300 ease-out"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
        }}
      />

      {/* Apple Subtle Noise / Grid Texture for Liquid Depth */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
