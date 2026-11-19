import { ProductLogo } from './ProductLogo';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Layers, 
  Database, 
  Sparkles, 
  ArrowRight,
} from 'lucide-react';
import { ProductApp } from '../types';
import { soundManager } from '../lib/sound';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductApp[];
  onSelectProduct: (product: ProductApp) => void;
  onOpenSettings: (tab?: 'products' | 'supabase') => void;
  onChangeView: (view: 'launcher' | 'dashboard' | 'split') => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onOpenSettings,
  onChangeView
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter items
  const matchedProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.tagline.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const systemActions = [
    {
      id: 'action-supabase',
      name: 'Configurar Supabase & Chaves',
      description: 'Testar conexão e credenciais do banco',
      action: () => onOpenSettings('supabase'),
      icon: Database
    },
    {
      id: 'action-add-product',
      name: 'Adicionar Novo Produto SaaS',
      description: 'Cadastrar novo aplicativo ao launcher',
      action: () => onOpenSettings('products'),
      icon: Sparkles
    },
    {
      id: 'action-view-dash',
      name: 'Abrir Dashboard Operacional & Executivo',
      description: 'Ver métricas e gráficos em tela cheia',
      action: () => onChangeView('dashboard'),
      icon: Layers
    }
  ].filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase()));

  const totalItems = matchedProducts.length + systemActions.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((selectedIndex + 1) % (totalItems || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((selectedIndex - 1 + (totalItems || 1)) % (totalItems || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < matchedProducts.length) {
        soundManager.playWindowOpen();
        onSelectProduct(matchedProducts[selectedIndex]);
        onClose();
      } else {
        const actionIdx = selectedIndex - matchedProducts.length;
        if (systemActions[actionIdx]) {
          soundManager.playClick();
          systemActions[actionIdx].action();
          onClose();
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-28 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-2xl liquid-glass border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-left animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/[0.04]">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search: Busque produtos, comandos, métricas..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400 ml-2">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {totalItems === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhum resultado encontrado para "{query}".
            </div>
          ) : (
            <>
              {matchedProducts.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Aplicativos SaaS
                  </div>
                  {matchedProducts.map((prod, idx) => {
                    const isSelected = selectedIndex === idx;

                    return (
                      <div
                        key={prod.id}
                        onClick={() => {
                          soundManager.playWindowOpen();
                          onSelectProduct(prod);
                          onClose();
                        }}
                        className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/25 border border-cyan-400/40 text-white'
                            : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-24 h-12 shrink-0 flex items-center justify-center">
                            <ProductLogo product={prod} className="max-w-full max-h-full" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center space-x-2">
                              <span>{prod.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-normal">
                                {prod.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">{prod.tagline}</div>
                          </div>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              )}

              {systemActions.length > 0 && (
                <div className="pt-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Ações do Sistema
                  </div>
                  {systemActions.map((act, idx) => {
                    const actualIdx = matchedProducts.length + idx;
                    const isSelected = selectedIndex === actualIdx;
                    const IconComp = act.icon;

                    return (
                      <div
                        key={act.id}
                        onClick={() => {
                          soundManager.playClick();
                          act.action();
                          onClose();
                        }}
                        className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/25 border border-cyan-400/40 text-white'
                            : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{act.name}</div>
                            <div className="text-[11px] text-slate-400">{act.description}</div>
                          </div>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[10px] text-slate-400">
          <span>Navegar: <strong className="text-slate-300">↑ ↓</strong></span>
          <span>Executar: <strong className="text-slate-300">ENTER</strong></span>
          <span>Fechar: <strong className="text-slate-300">ESC</strong></span>
        </div>
      </div>
    </div>
  );
};
