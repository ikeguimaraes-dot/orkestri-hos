import React, { useState } from 'react';
import { 
  Bot, 
  Calculator, 
  Utensils, 
  Users, 
  Calendar, 
  Layers, 
  Search, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  LucideIcon,
  CheckCircle2,
  Clock,
  Wrench,
  Database
} from 'lucide-react';
import { ProductApp, AppStatus } from '../types';
import { soundManager } from '../lib/sound';

interface AppLauncherProps {
  products: ProductApp[];
  onSelectProduct: (product: ProductApp) => void;
  onOpenSettings: (tab?: 'products' | 'supabase') => void;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({
  products,
  onSelectProduct,
  onOpenSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

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

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: AppStatus) => {
    switch (status) {
      case 'Ativo':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ativo</span>
          </span>
        );
      case 'Beta':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Beta</span>
          </span>
        );
      case 'Manutenção':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
            <Wrench className="w-2.5 h-2.5" />
            <span>Manutenção</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 xl:px-8 pt-4 pb-28">
      {/* Header section with search and filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Ecosystem Hub
            </span>
            <span className="text-xs text-slate-400">Orkestri Cloud Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center space-x-2">
            <span>Launcher de Aplicativos SaaS</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </h1>
        </div>

        {/* Action Bar (Search, Category, Add) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar produtos, recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-60 rounded-xl liquid-glass text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 border border-white/10"
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings('products');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Produto</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white/20 text-white border border-white/30 shadow-md shadow-white/10 backdrop-blur-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => {
          const IconComp = getProductIcon(prod.icon);

          return (
            <div
              key={prod.id}
              onClick={() => {
                soundManager.playWindowOpen();
                onSelectProduct(prod);
              }}
              className="group relative rounded-2xl liquid-glass-card p-5 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Top ambient illumination glow */}
              <div 
                className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${prod.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500`}
              />

              {/* Card Header: 3D Icon + Badges */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  {/* 3D Glass Icon / Logo */}
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${prod.gradient} p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-[14px] bg-black/40 backdrop-blur-sm flex items-center justify-center relative overflow-hidden p-2">
                        {/* Upper highlight */}
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                        {prod.logoUrl ? (
                          <img 
                            src={prod.logoUrl} 
                            alt={prod.name} 
                            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]" 
                          />
                        ) : (
                          <IconComp className="w-7 h-7 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(prod.status)}
                    <span className="text-[10px] font-mono text-slate-400">{prod.version}</span>
                  </div>
                </div>

                {/* Title & Category */}
                <div className="mb-2">
                  <span className="text-[10px] font-medium tracking-wide uppercase text-cyan-400">
                    {prod.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center justify-between">
                    <span>{prod.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-xs font-medium text-slate-300 mt-0.5 line-clamp-1">
                    {prod.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {prod.description}
                </p>
              </div>

              {/* Card Footer: Live Metric preview + Action buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                {prod.metricsPreview ? (
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded bg-white/5 border border-white/10">
                      <TrendingUp className="w-3 h-3 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">{prod.metricsPreview.label}</div>
                      <div className="text-xs font-bold text-white flex items-center space-x-1">
                        <span>{prod.metricsPreview.value}</span>
                        <span className="text-[10px] text-emerald-400 font-normal">
                          {prod.metricsPreview.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Pronto para uso</span>
                  </div>
                )}

                {/* Quick launch badge */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playWindowOpen();
                    onSelectProduct(prod);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-[11px] font-medium transition-colors border border-white/10 flex items-center space-x-1"
                >
                  <span>Abrir App</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
