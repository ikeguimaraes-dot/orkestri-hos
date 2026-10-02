import React, { useState } from 'react';
import { 
  Bot, 
  Calculator, 
  Utensils, 
  Users, 
  Calendar, 
  Layers, 
  LayoutGrid, 
  BarChart3, 
  Settings, 
  Search, 
  Trash2,
  Database,
  LucideIcon
} from 'lucide-react';
import { ProductApp } from '../types';
import { soundManager } from '../lib/sound';

interface DockProps {
  products: ProductApp[];
  activeWindowId: string | null;
  minimizedWindowIds: string[];
  activeView: 'launcher' | 'dashboard' | 'split';
  onChangeView: (view: 'launcher' | 'dashboard' | 'split') => void;
  onSelectProduct: (product: ProductApp) => void;
  onOpenSettings: (tab?: 'products' | 'supabase') => void;
  onOpenSpotlight: () => void;
}

export const Dock: React.FC<DockProps> = ({
  products,
  activeWindowId,
  minimizedWindowIds,
  activeView,
  onChangeView,
  onSelectProduct,
  onOpenSettings,
  onOpenSpotlight
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getProductIcon = (iconName: string): LucideIcon => {
    switch (iconName) {
      case 'bot': return Bot;
      case 'calculator': return Calculator;
      case 'utensils': return Utensils;
      case 'users': return Users;
      case 'calendar': return Calendar;
      case 'layers': return Layers;
      default: return Database;
    }
  };

  const isAppRunning = (id: string) => {
    return activeWindowId === id || minimizedWindowIds.includes(id);
  };

  return (
    <div className="fixed bottom-3 inset-x-0 flex justify-center items-end z-40 pointer-events-none">
      {/* Dock Container with Liquid Glassmorphism & Reflection */}
      <div className="pointer-events-auto relative px-3 py-2 rounded-2xl liquid-dock flex items-end space-x-2 border border-white/20 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        
        {/* Mirror Reflection beneath dock */}
        <div className="absolute -bottom-6 inset-x-4 h-6 opacity-25 blur-sm overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),transparent)]">
          <div className="w-full h-full bg-white/10 rounded-full" />
        </div>

        {/* 1. App Launcher Grid Icon */}
        <div className="relative group flex flex-col items-center">
          {hoveredItem === 'launcher' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg liquid-glass text-[11px] font-medium text-white shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
              Launcher de Apps
            </div>
          )}
          <button
            onClick={() => {
              soundManager.playClick();
              onChangeView(activeView === 'launcher' ? 'split' : 'launcher');
            }}
            onMouseEnter={() => setHoveredItem('launcher')}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 transform origin-bottom hover:scale-125 hover:-translate-y-2 active:scale-95 ${
              activeView === 'launcher'
                ? 'bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-[0_0_15px_rgba(0,242,254,0.5)] border border-cyan-300'
                : 'bg-white/10 hover:bg-white/20 border border-white/15'
            }`}
          >
            <LayoutGrid className="w-6 h-6 text-white" />
          </button>
          {/* Active indicator dot */}
          <span className={`w-1 h-1 rounded-full mt-1 transition-all ${activeView === 'launcher' ? 'bg-cyan-400 shadow-[0_0_6px_#00f2fe]' : 'bg-transparent'}`} />
        </div>

        {/* 2. Dashboard Analytics Icon */}
        <div className="relative group flex flex-col items-center">
          {hoveredItem === 'dashboard' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg liquid-glass text-[11px] font-medium text-white shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
              Dashboard Analítico
            </div>
          )}
          <button
            onClick={() => {
              soundManager.playClick();
              onChangeView(activeView === 'dashboard' ? 'split' : 'dashboard');
            }}
            onMouseEnter={() => setHoveredItem('dashboard')}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 transform origin-bottom hover:scale-125 hover:-translate-y-2 active:scale-95 ${
              activeView === 'dashboard'
                ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-[0_0_15px_rgba(138,43,226,0.5)] border border-violet-300'
                : 'bg-white/10 hover:bg-white/20 border border-white/15'
            }`}
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </button>
          {/* Active indicator dot */}
          <span className={`w-1 h-1 rounded-full mt-1 transition-all ${activeView === 'dashboard' ? 'bg-fuchsia-400 shadow-[0_0_6px_#f72585]' : 'bg-transparent'}`} />
        </div>

        {/* Subtle Separator */}
        <div className="w-[1px] h-8 bg-white/20 mx-1 self-center" />

        {/* 3. Predefined SaaS Products */}
        {products.map((prod) => {
          const IconComp = getProductIcon(prod.icon);
          const running = isAppRunning(prod.id);

          return (
            <div key={prod.id} className="relative group flex flex-col items-center">
              {hoveredItem === prod.id && (
                <div className="absolute -top-11 px-3 py-1 rounded-lg liquid-glass text-[11px] font-medium text-white shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 flex flex-col items-center">
                  <span>{prod.name}</span>
                  <span className="text-[9px] text-cyan-300 opacity-80">{prod.tagline}</span>
                </div>
              )}
              <button
                onClick={() => {
                  soundManager.playWindowOpen();
                  onSelectProduct(prod);
                }}
                onMouseEnter={() => setHoveredItem(prod.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 transform origin-bottom hover:scale-125 hover:-translate-y-2 active:scale-95 group shadow-lg ${
                  running 
                    ? 'ring-2 ring-cyan-400/80 shadow-[0_0_20px_rgba(0,242,254,0.4)]' 
                    : ''
                }`}
                style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)`,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}
              >
                {/* Product 3D Stylized Background Glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${prod.gradient} opacity-85 group-hover:opacity-100 transition-opacity`} />
                
                {/* Glossy Top Glass Glare */}
                <div className="absolute top-0 inset-x-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

                {/* Inner Icon */}
                <IconComp className="relative z-10 w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110" />

                {/* Status dot if Beta or Maintenance */}
                {prod.status === 'Beta' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] border border-black/40 z-20" />
                )}
                {prod.status === 'Manutenção' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#ef4444] border border-black/40 z-20" />
                )}
              </button>

              {/* Luminescent Active Running Dot */}
              <span 
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-all ${
                  running 
                    ? 'bg-cyan-300 shadow-[0_0_8px_#00f2fe]' 
                    : 'bg-transparent'
                }`} 
              />
            </div>
          );
        })}

        {/* Subtle Separator */}
        <div className="w-[1px] h-8 bg-white/20 mx-1 self-center" />

        {/* 4. Spotlight Command Palette */}
        <div className="relative group flex flex-col items-center">
          {hoveredItem === 'search' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg liquid-glass text-[11px] font-medium text-white shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
              Spotlight (⌘K)
            </div>
          )}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSpotlight();
            }}
            onMouseEnter={() => setHoveredItem('search')}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all duration-200 transform origin-bottom hover:scale-125 hover:-translate-y-2 active:scale-95"
          >
            <Search className="w-5 h-5 text-slate-200" />
          </button>
          <span className="w-1 h-1 rounded-full mt-1 bg-transparent" />
        </div>

        {/* 5. Settings / Supabase Manager */}
        <div className="relative group flex flex-col items-center">
          {hoveredItem === 'settings' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg liquid-glass text-[11px] font-medium text-white shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
              Configurações & Supabase
            </div>
          )}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            onMouseEnter={() => setHoveredItem('settings')}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all duration-200 transform origin-bottom hover:scale-125 hover:-translate-y-2 active:scale-95 group"
          >
            <Settings className="w-5 h-5 text-slate-200 group-hover:rotate-45 transition-transform duration-300" />
          </button>
          <span className="w-1 h-1 rounded-full mt-1 bg-transparent" />
        </div>

        {/* 6. Clean Cache / Trash */}
        <div className="relative group flex flex-col items-center">
          {hoveredItem === 'trash' && (
            <div className="absolute -top-10 px-2.5 py-1 rounded-lg liquid-glass text-[11px] font-medium text-white shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
              Limpar Cache
            </div>
          )}
          <button
            onClick={() => {
              soundManager.playClick();
              sessionStorage.clear();
              alert('Cache da sessão do Orkestri HOS limpo com sucesso.');
            }}
            onMouseEnter={() => setHoveredItem('trash')}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all duration-200 transform origin-bottom hover:scale-125 hover:-translate-y-2 active:scale-95"
          >
            <Trash2 className="w-5 h-5 text-slate-300" />
          </button>
          <span className="w-1 h-1 rounded-full mt-1 bg-transparent" />
        </div>

      </div>
    </div>
  );
};
