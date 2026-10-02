import React, { useState } from 'react';
import { 
  X, 
  Minus, 
  Maximize2, 
  ExternalLink, 
  Bot, 
  Calculator, 
  Utensils, 
  Users, 
  Calendar, 
  Layers, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Clock, 
  RefreshCw,
  LucideIcon,
  Database
} from 'lucide-react';
import { ProductApp, EventLog } from '../types';
import { soundManager } from '../lib/sound';

interface AppWindowProps {
  product: ProductApp;
  onClose: () => void;
  onMinimize: () => void;
  events?: EventLog[];
}

export const AppWindow: React.FC<AppWindowProps> = ({
  product,
  onClose,
  onMinimize,
  events = []
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'logs' | 'browser'>('overview');
  const [isMaximized, setIsMaximized] = useState(false);
  const [browserUrl, setBrowserUrl] = useState(product.url);

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

  const IconComp = getProductIcon(product.icon);
  const productEvents = events.filter(e => e.product.toLowerCase().includes(product.name.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      {/* Window Body */}
      <div 
        className={`relative w-full rounded-2xl liquid-glass border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden transition-all duration-300 ${
          isMaximized 
            ? 'h-[92vh] max-w-6xl' 
            : 'h-[78vh] max-w-4xl'
        }`}
      >
        {/* macOS Window Header (Titlebar & Traffic Lights) */}
        <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between bg-white/[0.04] backdrop-blur-xl select-none shrink-0">
          
          {/* Traffic Lights 🔴 🟡 🟢 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundManager.playWindowClose();
                onClose();
              }}
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-110 active:brightness-90 flex items-center justify-center group cursor-pointer shadow-sm border border-black/20"
              title="Fechar (Esc)"
            >
              <X className="w-2.5 h-2.5 text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onMinimize();
              }}
              className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:brightness-110 active:brightness-90 flex items-center justify-center group cursor-pointer shadow-sm border border-black/20"
              title="Minimizar para o Dock"
            >
              <Minus className="w-2.5 h-2.5 text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setIsMaximized(!isMaximized);
              }}
              className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:brightness-110 active:brightness-90 flex items-center justify-center group cursor-pointer shadow-sm border border-black/20"
              title="Maximizar Janela"
            >
              <Maximize2 className="w-2 h-2 text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Center Window Title */}
          <div className="flex items-center space-x-2">
            <div className={`w-5 h-5 rounded-md bg-gradient-to-tr ${product.gradient} p-0.5 flex items-center justify-center overflow-hidden`}>
              {product.logoUrl ? (
                <img src={product.logoUrl} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <IconComp className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="font-semibold text-xs text-white tracking-wide">
              {product.name}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              — {product.tagline}
            </span>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {product.version}
            </span>
            <a
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Abrir URL em Nova Aba"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Window Tabs Bar */}
        <div className="px-4 py-2 border-b border-white/10 bg-white/[0.02] flex items-center space-x-1 shrink-0">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'metrics', label: 'Métricas Rápidas' },
            { id: 'logs', label: `Logs & Auditoria (${productEvents.length})` },
            { id: 'browser', label: 'Navegador Embutido' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/25 text-white border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Window Content Area */}
        <div className="flex-1 overflow-y-auto p-5 text-left text-slate-200">
          
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Product Hero Banner */}
              <div className="relative rounded-2xl overflow-hidden p-6 border border-white/15 bg-gradient-to-r from-white/[0.08] to-transparent">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${product.gradient} p-0.5 shadow-xl`}>
                      <div className="w-full h-full rounded-[14px] bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 overflow-hidden">
                        {product.logoUrl ? (
                          <img src={product.logoUrl} alt={product.name} className="w-full h-full object-contain filter drop-shadow-md" />
                        ) : (
                          <IconComp className="w-8 h-8 text-white drop-shadow-md" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                          {product.category}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {product.status}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mt-0.5">{product.name}</h2>
                      <p className="text-xs text-slate-300">{product.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all"
                    >
                      <span>Acessar Plataforma Web</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Description & Capabilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sobre a Solução</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Versão Instalada: <strong className="text-white font-mono">{product.version}</strong></span>
                    <span>Protocolo: <strong className="text-cyan-300">HTTPS / TLS 1.3</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Recursos & Módulos Ativos</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {product.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f2fe]" />
                        <span>{feat}</span>
                      </li>
                    )) || (
                      <li className="text-slate-400">Integração nativa com ecossistema Orkestri Cloud.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MÉTRICAS DEDICADAS */}
          {activeTab === 'metrics' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Métrica Principal</span>
                  <div className="text-2xl font-black text-white mt-1">
                    {product.metricsPreview?.value || '100%'}
                  </div>
                  <div className="text-xs text-emerald-400 font-medium mt-1">
                    {product.metricsPreview?.trend || '+12.4%'} este mês
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Disponibilidade / Uptime</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">99.98%</div>
                  <div className="text-xs text-slate-400 mt-1">Últimos 30 dias</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Latência de Resposta</span>
                  <div className="text-2xl font-black text-cyan-300 mt-1 font-mono">18ms</div>
                  <div className="text-xs text-slate-400 mt-1">Edge Cloud Provider</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-xs font-bold text-white mb-2">Conexão de Dados & Webhook</h4>
                <div className="text-xs text-slate-300 font-mono bg-black/30 p-3 rounded-lg border border-white/5 overflow-x-auto">
                  ENDPOINT: {product.url}/api/v1/telemetry
                  <br />
                  STATUS: 200 OK • SYNC_INTERVAL: 15s • ENCRYPTION: AES-256-GCM
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGS & AUDITORIA */}
          {activeTab === 'logs' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                <span>Registros Recentes de Eventos para {product.name}</span>
                <span className="font-mono text-cyan-400">{productEvents.length} eventos</span>
              </div>

              {productEvents.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Nenhum evento recente registrado especificamente para este aplicativo.
                </div>
              ) : (
                <div className="space-y-2">
                  {productEvents.map(evt => (
                    <div key={evt.id} className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-white">{evt.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{evt.relativeTime}</span>
                      </div>
                      <p className="text-xs text-slate-300">{evt.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NAVEGADOR EMBUTIDO */}
          {activeTab === 'browser' && (
            <div className="h-full flex flex-col space-y-3 animate-in fade-in duration-150">
              {/* Address Bar */}
              <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-xl border border-white/10">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={browserUrl}
                  onChange={(e) => setBrowserUrl(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-slate-200 font-mono focus:outline-none"
                />
                <a
                  href={browserUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs flex items-center space-x-1"
                >
                  <span>Abrir Externa</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Sandbox Preview Card */}
              <div className="flex-1 min-h-[300px] rounded-xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center p-8 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${product.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                  <IconComp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Visualização do Ecossistema {product.name}</h3>
                <p className="text-xs text-slate-400 max-w-md mb-4">
                  Por políticas de segurança (CORS e X-Frame-Options de domínios corporativos SaaS), o aplicativo pode ser acessado diretamente na nuvem em tela cheia.
                </p>
                <a
                  href={browserUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/30 flex items-center space-x-2 transition-all"
                >
                  <span>Iniciar Sessão em Nova Janela</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
