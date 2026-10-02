import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Search, 
  Sliders, 
  Bell, 
  Database, 
  ExternalLink,
  RefreshCw,
  Sparkles,
  Layers,
  BarChart3,
  Settings,
  ChevronDown
} from 'lucide-react';
import { SupabaseConfig } from '../types';
import { soundManager } from '../lib/sound';

interface TopBarProps {
  supabaseConfig: SupabaseConfig;
  onOpenSettings: (tab?: 'products' | 'supabase') => void;
  onOpenSpotlight: () => void;
  onToggleControlCenter: () => void;
  onToggleNotifications: () => void;
  unreadCount?: number;
  activeView: 'launcher' | 'dashboard' | 'split';
  onChangeView: (view: 'launcher' | 'dashboard' | 'split') => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  supabaseConfig,
  onOpenSettings,
  onOpenSpotlight,
  onToggleControlCenter,
  onToggleNotifications,
  unreadCount = 3,
  activeView,
  onChangeView,
  onRefreshData,
  isRefreshing = false
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showStatusPopover, setShowStatusPopover] = useState(false);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Portuguese formatting: e.g. "Sexta, 2 Out"
      const dateStr = now.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
      // Capitalize first letter
      const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
      
      const timeStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setCurrentDate(formattedDate);
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-container') && !target.closest('.status-pill-container')) {
        setActiveMenu(null);
        setShowStatusPopover(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: string) => {
    soundManager.playClick();
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <header className="relative z-40 h-8 w-full px-3 liquid-glass-subtle border-b border-white/10 flex items-center justify-between text-xs text-slate-200 select-none backdrop-blur-2xl">
      {/* Left Menu Items (macOS Style) */}
      <div className="flex items-center space-x-1 menu-container">
        {/* Apple / Orkestri Logo */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('apple')}
            className={`px-2 py-0.5 rounded flex items-center space-x-1.5 transition-colors hover:bg-white/10 ${activeMenu === 'apple' ? 'bg-white/15' : ''}`}
            title="Menu do Sistema Orkestri"
          >
            {/* Official Orkestri Logo */}
            <img 
              src="/logos/orkestri.png" 
              alt="Orkestri" 
              className="h-4 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]"
            />
            <span className="font-semibold text-white tracking-wide text-xs">HOS</span>
          </button>

          {/* Apple Dropdown */}
          {activeMenu === 'apple' && (
            <div className="absolute top-7 left-0 w-64 rounded-xl liquid-glass py-1.5 px-1 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-3 py-1.5 border-b border-white/10">
                <div className="font-semibold text-white text-xs">Orkestri HOS 2026.1</div>
                <div className="text-[10px] text-slate-400">macOS / VisionOS Liquid Glass Edition</div>
              </div>
              <button
                onClick={() => { setActiveMenu(null); onOpenSettings('supabase'); }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-cyan-500/20 rounded-lg flex items-center justify-between"
              >
                <span>Preferências do Sistema...</span>
                <span className="text-[10px] text-slate-400">⌘,</span>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onOpenSpotlight(); }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-cyan-500/20 rounded-lg flex items-center justify-between"
              >
                <span>Spotlight Search</span>
                <span className="text-[10px] text-slate-400">⌘K</span>
              </button>
              <button
                onClick={() => { setActiveMenu(null); onRefreshData(); }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-cyan-500/20 rounded-lg flex items-center justify-between"
              >
                <span>Sincronizar Métricas</span>
                <span className="text-[10px] text-slate-400">⌘R</span>
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => { 
                  setActiveMenu(null); 
                  localStorage.removeItem('orkestri_custom_products_v3');
                  window.location.reload();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 rounded-lg"
              >
                Reiniciar Workspace Padrão
              </button>
            </div>
          )}
        </div>

        {/* View Mode Switchers */}
        <div className="flex items-center ml-2 space-x-0.5 bg-white/5 rounded-md p-0.5 border border-white/10">
          <button
            onClick={() => { soundManager.playClick(); onChangeView('launcher'); }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              activeView === 'launcher' 
                ? 'bg-cyan-500/30 text-white shadow-sm border border-cyan-400/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Launcher
          </button>
          <button
            onClick={() => { soundManager.playClick(); onChangeView('split'); }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              activeView === 'split' 
                ? 'bg-cyan-500/30 text-white shadow-sm border border-cyan-400/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Híbrido
          </button>
          <button
            onClick={() => { soundManager.playClick(); onChangeView('dashboard'); }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              activeView === 'dashboard' 
                ? 'bg-cyan-500/30 text-white shadow-sm border border-cyan-400/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Analítico
          </button>
        </div>

        {/* System Submenus */}
        <div className="hidden md:flex items-center space-x-1 pl-2">
          {['Arquivo', 'Visualizar', 'Widgets', 'Janela'].map((menu) => (
            <div key={menu} className="relative">
              <button
                onClick={() => handleMenuClick(menu)}
                className={`px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-[11px] ${
                  activeMenu === menu ? 'bg-white/15 text-white' : ''
                }`}
              >
                {menu}
              </button>

              {activeMenu === menu && (
                <div className="absolute top-7 left-0 w-52 rounded-xl liquid-glass py-1 px-1 shadow-2xl border border-white/20 z-50">
                  {menu === 'Arquivo' && (
                    <>
                      <button
                        onClick={() => { setActiveMenu(null); onOpenSettings('products'); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-cyan-500/20 rounded-lg flex items-center justify-between"
                      >
                        <span>Adicionar Novo Produto...</span>
                        <span className="text-[10px] text-slate-400">⌘N</span>
                      </button>
                      <button
                        onClick={() => { setActiveMenu(null); onRefreshData(); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-cyan-500/20 rounded-lg flex items-center justify-between"
                      >
                        <span>Atualizar Dados</span>
                        <span className="text-[10px] text-slate-400">⌘R</span>
                      </button>
                    </>
                  )}
                  {menu === 'Visualizar' && (
                    <>
                      <button
                        onClick={() => { setActiveMenu(null); onChangeView('launcher'); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-cyan-500/20 rounded-lg flex items-center justify-between"
                      >
                        <span>Modo Launcher de Apps</span>
                        <span className="text-[10px] text-slate-400">⌘1</span>
                      </button>
                      <button
                        onClick={() => { setActiveMenu(null); onChangeView('split'); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-cyan-500/20 rounded-lg flex items-center justify-between"
                      >
                        <span>Modo Visão Híbrida</span>
                        <span className="text-[10px] text-slate-400">⌘2</span>
                      </button>
                      <button
                        onClick={() => { setActiveMenu(null); onChangeView('dashboard'); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-cyan-500/20 rounded-lg flex items-center justify-between"
                      >
                        <span>Modo Dashboard Analítico</span>
                        <span className="text-[10px] text-slate-400">⌘3</span>
                      </button>
                    </>
                  )}
                  {menu === 'Widgets' && (
                    <>
                      <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400">Widgets Ativos</div>
                      <div className="px-3 py-1 text-xs text-emerald-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Faturamento / Vendas</span>
                      </div>
                      <div className="px-3 py-1 text-xs text-cyan-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>Reservas & Ocupação</span>
                      </div>
                      <div className="px-3 py-1 text-xs text-purple-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>Feed de Logs Realtime</span>
                      </div>
                      <div className="px-3 py-1 text-xs text-amber-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Indicadores KPH (SLA)</span>
                      </div>
                    </>
                  )}
                  {menu === 'Janela' && (
                    <>
                      <button
                        onClick={() => { setActiveMenu(null); onOpenSettings('supabase'); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-cyan-500/20 rounded-lg"
                      >
                        Configurações Supabase...
                      </button>
                      <button
                        onClick={() => { setActiveMenu(null); onOpenSpotlight(); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-cyan-500/20 rounded-lg"
                      >
                        Abrir Spotlight (⌘K)
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Menu Items (Clock, Status, Shortcuts, Profile) */}
      <div className="flex items-center space-x-2">
        {/* Refresh button */}
        <button
          onClick={() => { soundManager.playClick(); onRefreshData(); }}
          className={`p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-all ${
            isRefreshing ? 'animate-spin text-cyan-400' : ''
          }`}
          title="Recarregar Métricas do Supabase"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Supabase Status Pill with ping pulse */}
        <div className="relative status-pill-container">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowStatusPopover(!showStatusPopover);
            }}
            className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)]"
            title="Status da Conexão Supabase"
          >
            {/* Live Ping Pulse Ring */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
            </span>
            <span className="text-[11px] font-medium text-emerald-300 tracking-wide flex items-center space-x-1">
              <span>Supabase Conectado</span>
              <span className="text-[9px] opacity-75 font-mono">({supabaseConfig.latencyMs || 42}ms)</span>
            </span>
          </button>

          {/* Supabase Diagnostic Popover */}
          {showStatusPopover && (
            <div className="absolute right-0 top-7 w-80 rounded-2xl liquid-glass p-3.5 shadow-2xl border border-white/20 z-50 text-left animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Conexão Supabase</h4>
                    <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Cliente Nativo Ativo</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {supabaseConfig.latencyMs || 42}ms
                </span>
              </div>

              <div className="mt-2.5 space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">Endpoint URL:</span>
                  <div className="font-mono text-cyan-300 truncate bg-black/30 p-1.5 rounded-md border border-white/5 select-all">
                    {supabaseConfig.url}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Modo Operacional:</span>
                  <div className="text-slate-200 text-[11px] bg-white/5 p-1.5 rounded-md">
                    Híbrido (Streaming em Tempo Real com Fallback Dinâmico de Segurança)
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setShowStatusPopover(false);
                      onOpenSettings('supabase');
                    }}
                    className="w-full text-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-md transition-all flex items-center justify-center space-x-1"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Gerenciar Credenciais & Tabelas</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spotlight Search Icon */}
        <button
          onClick={() => { soundManager.playClick(); onOpenSpotlight(); }}
          className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Spotlight Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Wi-Fi Icon */}
        <div className="px-1 text-slate-300 hover:text-white transition-colors" title="Wi-Fi: Orkestri 5G (Conectado)">
          <Wifi className="w-3.5 h-3.5 text-cyan-400" />
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => { soundManager.playClick(); onToggleNotifications(); }}
          className="relative p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Notificações"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute 0 top-0.5 right-0.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f2fe]" />
          )}
        </button>

        {/* Control Center Toggle */}
        <button
          onClick={() => { soundManager.playClick(); onToggleControlCenter(); }}
          className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Central de Controle macOS"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Live Digital Clock & Date */}
        <div className="px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors text-slate-100 font-medium text-[11px] tracking-wide flex items-center space-x-1.5">
          <span>{currentDate}</span>
          <span className="text-slate-400">•</span>
          <span className="font-mono text-cyan-300 drop-shadow-[0_0_8px_rgba(0,242,254,0.3)]">{currentTime || '08:58:00'}</span>
        </div>

        {/* User Profile Avatar */}
        <div 
          onClick={() => { soundManager.playClick(); onOpenSettings(); }}
          className="flex items-center space-x-1.5 pl-1 cursor-pointer group"
          title="Perfil do Administrador"
        >
          <div className="relative">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-[1px] ring-1 ring-white/20 group-hover:ring-cyan-400 transition-all">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                HG
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-slate-950" />
          </div>
        </div>
      </div>
    </header>
  );
};
