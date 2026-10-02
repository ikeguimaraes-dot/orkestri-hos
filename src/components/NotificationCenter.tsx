import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Trash2, 
  Sparkles,
  Database
} from 'lucide-react';
import { EventLog } from '../types';
import { soundManager } from '../lib/sound';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventLog[];
  onClearEvents?: () => void;
  onSelectProductById?: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  events,
  onClearEvents,
  onSelectProductById
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 md:w-96 liquid-glass border-l border-white/20 shadow-2xl p-5 flex flex-col justify-between text-left text-slate-200 animate-in slide-in-from-right duration-200">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Central de Notificações
              </h3>
              <span className="text-[10px] text-slate-400">Orkestri HOS Telemetria</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {onClearEvents && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClearEvents();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Limpar Notificações"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {
                soundManager.playWindowClose();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
          {events.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <span>Nenhuma nova notificação no momento.</span>
            </div>
          ) : (
            events.map(evt => {
              const getIcon = () => {
                switch (evt.status) {
                  case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
                  case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
                  case 'error': return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
                  default: return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
                }
              };

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectProductById && onSelectProductById(evt.product.toLowerCase().replace(/\s+/g, '-'))}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-semibold text-cyan-300">{evt.product}</span>
                    <span className="text-slate-400 font-mono text-[9px]">{evt.relativeTime}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    {getIcon()}
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center space-x-1">
          <Database className="w-3 h-3 text-emerald-400" />
          <span>Supabase Realtime Stream: Ativo</span>
        </span>
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="text-cyan-400 hover:underline"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
