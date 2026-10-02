import React from 'react';
import { 
  Sliders, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Palette, 
  Wifi, 
  Bluetooth, 
  Airplay, 
  Activity, 
  Sparkles,
  Database
} from 'lucide-react';
import { soundManager } from '../lib/sound';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: 'midnight' | 'violet' | 'cyan' | 'aurora';
  onChangeWallpaper: (w: 'midnight' | 'violet' | 'cyan' | 'aurora') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: (tab?: 'products' | 'supabase') => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  wallpaper,
  onChangeWallpaper,
  soundEnabled,
  onToggleSound,
  onOpenSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-10 right-3 z-50 w-80 rounded-3xl liquid-glass p-4 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-150 select-none text-left">
      {/* Top 2x2 Network/Bluetooth & Focus grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* Connectivity Tile */}
        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between h-28">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
              <Wifi className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-white">Wi-Fi</div>
              <div className="text-[9px] text-cyan-400">Orkestri HighSpeed</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-white/10">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Bluetooth className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[10px] font-medium text-white">Bluetooth</div>
              <div className="text-[9px] text-slate-400">Ativado</div>
            </div>
          </div>
        </div>

        {/* Supabase & Sound Tile */}
        <div className="flex flex-col space-y-2">
          {/* Supabase Quick Status */}
          <div 
            onClick={() => { onClose(); onOpenSettings('supabase'); }}
            className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/20 transition-all flex items-center space-x-2.5"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-emerald-200">Supabase DB</div>
              <div className="text-[9px] text-emerald-400 font-mono">Status: Online</div>
            </div>
          </div>

          {/* Sound Toggle */}
          <div 
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-all flex items-center space-x-2.5"
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${soundEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-white">Sons de Interface</div>
              <div className="text-[9px] text-slate-400">{soundEnabled ? 'Ativados (Web Audio)' : 'Mudo'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallpaper / Aesthetic Selector */}
      <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tema Liquid VisionOS</span>
          </span>
          <span className="text-[10px] text-slate-400 capitalize">{wallpaper}</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[
            { id: 'midnight', name: 'Midnight', color: 'from-violet-900 to-blue-950' },
            { id: 'violet', name: 'Violet', color: 'from-purple-900 to-fuchsia-950' },
            { id: 'cyan', name: 'Cyan', color: 'from-teal-900 to-blue-950' },
            { id: 'aurora', name: 'Aurora', color: 'from-emerald-900 to-teal-950' },
          ].map(theme => (
            <button
              key={theme.id}
              onClick={() => {
                soundManager.playClick();
                onChangeWallpaper(theme.id as typeof wallpaper);
              }}
              className={`py-1.5 px-1 rounded-xl text-[10px] font-medium transition-all flex flex-col items-center border ${
                wallpaper === theme.id
                  ? 'border-cyan-400 bg-white/20 text-white shadow-md shadow-cyan-500/20'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${theme.color} mb-1 border border-white/20`} />
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Slider: Liquid Glass Blur */}
      <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Intensidade Liquid Glassmorphism</span>
          <span className="font-mono text-cyan-300 text-[10px]">100% Blur</span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden p-0.5 relative flex items-center">
          <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
