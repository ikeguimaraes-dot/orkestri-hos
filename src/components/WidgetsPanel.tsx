import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  RefreshCw, 
  Activity, 
  ShieldCheck,
  Pause,
  Play
} from 'lucide-react';
import { SalesMetricData, ReservationMetricData, OperationalMetricData, EventLog } from '../types';
import { DEMO_UNITS, scopeDemoUnit } from '../lib/dashboardScope';
import { soundManager } from '../lib/sound';

interface WidgetsPanelProps {
  selectedUnit: string;
  onSelectUnit: (unitId: string) => void;
  isDemo: boolean;
  salesData: SalesMetricData;
  reservationData: ReservationMetricData;
  operationalData: OperationalMetricData;
  eventsData: EventLog[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onSelectProductById?: (productId: string) => void;
}

export const WidgetsPanel: React.FC<WidgetsPanelProps> = ({
  salesData: allSales,
  reservationData: allReservations,
  operationalData: allOperational,
  eventsData: allEvents,
  selectedUnit,
  onSelectUnit,
  isDemo,
  isLoading = false,
  onRefresh,
  onSelectProductById
}) => {
  const unitIndex = isDemo ? DEMO_UNITS.findIndex(unit => unit.id === selectedUnit) : -1;
  const unit = DEMO_UNITS[unitIndex];
  const scoped = unit ? scopeDemoUnit(unitIndex, allSales, allReservations, allOperational, allEvents) : null;
  const salesData = scoped?.sales ?? allSales;
  const reservationData = scoped?.reservations ?? allReservations;
  const operationalData = scoped?.operational ?? allOperational;
  const eventsData = scoped?.events ?? allEvents;
  const scopeLabel = unit ? unit.name : isDemo ? 'Todas as unidades · 3 casas' : 'Visão geral · unidade não informada';
  const [eventFilter, setEventFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; amount: number } | null>(null);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);

  // SVG Sparkline calculation
  const maxSale = Math.max(...salesData.history.map(h => h.amount));
  const minSale = Math.min(...salesData.history.map(h => h.amount));
  const svgWidth = 360;
  const svgHeight = 90;
  const paddingX = 15;
  const paddingY = 15;

  const points = salesData.history.map((item, index) => {
    const x = paddingX + (index / (salesData.history.length - 1)) * (svgWidth - paddingX * 2);
    const range = maxSale - minSale || 1;
    const y = svgHeight - paddingY - ((item.amount - minSale) / range) * (svgHeight - paddingY * 2);
    return { x, y, day: item.day, amount: item.amount };
  });

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPointsString = `${points[0].x},${svgHeight} ${pointsString} ${points[points.length - 1].x},${svgHeight}`;

  // Filtered Events
  const filteredEvents = eventsData.filter(evt => {
    if (eventFilter === 'all') return true;
    return evt.status === eventFilter;
  });

  // Circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (salesData.monthlyGoal > 0 ? (reservationData.occupancyRate / 100) : 0) * circumference;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 xl:px-8 pt-7 pb-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-cyan-300">Visão da operação</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
            Dashboard Operacional &amp; Executivo
          </h2>
          <p className="text-sm text-slate-400 mt-2">Resultados, salão e cozinha no mesmo lugar.</p>
        </div>

        {/* Quick controls */}
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              disabled={isLoading}
              onClick={() => {
                soundManager.playClick();
                onRefresh();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl liquid-glass text-xs text-slate-200 hover:text-white hover:bg-white/10 border border-white/15 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Atualizar indicadores</span>
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div aria-live="polite">
          <p className="text-xs text-slate-400">{unit ? 'Operação da unidade' : 'Visão consolidada'}</p>
          <p className="text-lg font-semibold text-white mt-1">{scopeLabel}</p>
          <p className="text-xs text-slate-400 mt-1">{unit ? 'Todos os indicadores e eventos abaixo são desta casa.' : isDemo ? 'Totais somam as três casas de exemplo; taxas representam a visão do grupo.' : 'Os dados recebidos ainda não identificam a unidade de origem.'}</p>
        </div>
        <div className="flex flex-col gap-2 md:min-w-64">
          <label htmlFor="dashboard-unit" className="text-xs font-medium text-slate-300">Unidade</label>
          <select id="dashboard-unit" value={unit?.id ?? 'all'} onChange={event => onSelectUnit(event.target.value)} disabled={!isDemo}
            className="w-full rounded-xl border border-white/20 bg-slate-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60">
            <option value="all">{isDemo ? 'Todas as unidades' : 'Unidades não disponíveis'}</option>
            {isDemo && DEMO_UNITS.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
      </div>
      {isDemo && <p className="text-xs text-amber-200/90 mb-5">Demonstração · Casas e valores ilustrativos. A seleção de unidades reais depende da vinculação dos dados de cada operação.</p>}

      <div className="dashboard-grid grid gap-4">
        {/* CARD 1: VENDAS / FATURAMENTO */}
        <div className="rounded-3xl liquid-glass-card p-5 relative overflow-hidden flex flex-col justify-between group">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-cyan-500/20 blur-2xl group-hover:bg-cyan-500/30 transition-all pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Faturamento & Vendas</h3>
                  <span className="text-[10px] text-slate-400">Mês Atual (Competência)</span>
                </div>
              </div>
              <span className="flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="w-3 h-3" />
                <span>+{salesData.growthPercentage}%</span>
              </span>
            </div>

            {/* Skeleton or Content */}
            {isLoading ? (
              <div className="space-y-3 animate-pulse py-2">
                <div className="h-8 bg-white/10 rounded-lg w-3/4" />
                <div className="h-4 bg-white/5 rounded-md w-1/2" />
                <div className="h-20 bg-white/5 rounded-xl w-full" />
              </div>
            ) : (
              <>
                {/* Total Value */}
                <div className="mt-2 mb-1">
                  <div className="text-2xl font-black text-white tracking-tight">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(salesData.totalRevenue)}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(salesData.monthlyGoal)}</span>
                    <span className="text-cyan-400 font-medium">
                      {Math.round((salesData.totalRevenue / salesData.monthlyGoal) * 100)}%
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(0,242,254,0.6)] transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.round((salesData.totalRevenue / salesData.monthlyGoal) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Interactive SVG Sparkline */}
                <div className="relative mt-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Tendência dos últimos 7 dias</span>
                    {hoveredPoint && (
                      <span className="font-mono text-cyan-300">
                        {hoveredPoint.day}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(hoveredPoint.amount)}
                      </span>
                    )}
                  </div>
                  <svg 
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                    className="w-full h-20 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Shaded Area */}
                    <polygon points={areaPointsString} fill="url(#salesGradient)" />

                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke="#00f2fe"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsString}
                      filter="url(#glow)"
                    />

                    {/* Interactive dots */}
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={hoveredPoint?.day === p.day ? 5 : 3}
                        className="cursor-pointer transition-all fill-cyan-400 stroke-slate-900 stroke-2 hover:r-6"
                        onMouseEnter={() => setHoveredPoint({ day: p.day, amount: p.amount })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    ))}
                  </svg>
                </div>
              </>
            )}
          </div>

          {/* Breakdown Pills */}
          <div className="mt-3 pt-2 border-t border-white/10 grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="bg-white/5 rounded-lg p-1.5 flex flex-col">
              <span className="text-slate-400">Meta do mês</span>
              <span className="font-bold text-cyan-300">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(salesData.monthlyGoal)}</span>
            </div>
            <div className="bg-white/5 rounded-lg p-1.5 flex flex-col">
              <span className="text-slate-400">Atingimento</span>
              <span className="font-bold text-emerald-300">{Math.round(salesData.totalRevenue / salesData.monthlyGoal * 100)}%</span>
            </div>
          </div>
        </div>

        {/* CARD 2: RESERVAS & OCUPAÇÃO (REAL-TIME) */}
        <div className="rounded-3xl liquid-glass-card p-5 relative overflow-hidden flex flex-col justify-between group">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-violet-500/20 blur-2xl group-hover:bg-violet-500/30 transition-all pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/30">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Reservas & Ocupação</h3>
                  <span className="text-[10px] text-slate-400">Disponibilidade de mesas</span>
                </div>
              </div>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
                <span>{isDemo ? 'Demo' : 'Salão'}</span>
              </span>
            </div>

            {/* Skeleton or Content */}
            {isLoading ? (
              <div className="space-y-3 animate-pulse py-2">
                <div className="w-32 h-32 mx-auto rounded-full bg-white/5" />
                <div className="h-4 bg-white/5 rounded-md w-3/4 mx-auto" />
              </div>
            ) : (
              <>
                {/* Circular Gauge */}
                <div className="relative flex items-center justify-center py-2">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className="text-white/10 stroke-current"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className="stroke-current text-violet-500 transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.7))'
                      }}
                    />
                  </svg>

                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-white tracking-tight">
                      {reservationData.occupancyRate}%
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-violet-300">
                      Ocupação
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      {reservationData.occupiedTables} de {reservationData.totalTables} mesas
                    </span>
                  </div>
                </div>

                {/* Peak Window Badge */}
                <div className="bg-white/5 rounded-xl p-2 border border-white/5 text-center mt-1">
                  <div className="text-[10px] text-slate-400">Janela de Pico Prevista</div>
                  <div className="text-xs font-semibold text-violet-300 font-mono">
                    {reservationData.peakWindow}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-3 pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-center text-[10px]">
            <div className="bg-white/5 rounded-lg py-1">
              <span className="text-slate-400 block">Reservas Hoje</span>
              <span className="font-bold text-white text-xs">{reservationData.reservedToday}</span>
            </div>
            <div className="bg-white/5 rounded-lg py-1">
              <span className="text-slate-400 block">Fila de Espera</span>
              <span className="font-bold text-amber-400 text-xs">{reservationData.waitlistCount} pessoas</span>
            </div>
          </div>
        </div>

        {/* CARD 3: FEED DE EVENTOS & LOGS RECENTES */}
        <div className="rounded-3xl liquid-glass-card p-5 relative overflow-hidden flex flex-col justify-between group">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-pink-500/20 blur-2xl group-hover:bg-pink-500/30 transition-all pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/30">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Feed de Eventos & Logs</h3>
                  <span className="text-[10px] text-slate-400">Stream de Auditoria e Webhooks</span>
                </div>
              </div>
              <button
                onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
                className={`p-1 rounded-md text-[10px] transition-colors ${
                  isLiveStreamActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:bg-white/10'
                }`}
                title={isLiveStreamActive ? 'Pausar Live Feed' : 'Retomar Live Feed'}
              >
                {isLiveStreamActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 mb-2.5">
              {(['all', 'success', 'warning', 'error'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setEventFilter(filter)}
                  className={`px-2 py-0.5 rounded text-[10px] capitalize transition-colors ${
                    eventFilter === filter
                      ? 'bg-white/20 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {filter === 'all' ? 'Todos' : filter === 'success' ? 'Sucesso' : filter === 'warning' ? 'Atenção' : 'Erro'}
                </button>
              ))}
            </div>

            {/* Logs List */}
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-[195px] overflow-y-auto pr-1">
                {filteredEvents.length === 0 && <p className="text-xs text-slate-400 py-6">Nenhum evento neste filtro para {scopeLabel}.</p>}
                {filteredEvents.slice(0, 4).map(evt => {
                  const getStatusIcon = () => {
                    switch (evt.status) {
                      case 'success':
                        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
                      case 'warning':
                        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
                      case 'error':
                        return <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
                      default:
                        return <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
                    }
                  };

                  return (
                    <div
                      key={evt.id}
                      onClick={() => onSelectProductById && onSelectProductById(evt.product.toLowerCase().replace(/\s+/g, '-'))}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 transition-colors cursor-pointer group/item text-left"
                    >
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span className="font-semibold text-cyan-300">{evt.product}{isDemo && !unit ? ` · ${DEMO_UNITS[allEvents.indexOf(evt) % DEMO_UNITS.length].name}` : ''}</span>
                        <span className="text-slate-400 font-mono text-[9px]">{evt.relativeTime}</span>
                      </div>
                      <div className="flex items-start space-x-1.5 mt-0.5">
                        {getStatusIcon()}
                        <p className="text-[11px] text-slate-200 line-clamp-1 group-hover/item:text-white">
                          {evt.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer telemetry status */}
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveStreamActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isLiveStreamActive ? 'Streaming Ativo' : 'Feed Pausado'}</span>
            </span>
            <span>{filteredEvents.length} eventos registrados</span>
          </div>
        </div>

        {/* CARD 4: INDICADORES OPERACIONAIS (KPH) */}
        <div className="rounded-3xl liquid-glass-card p-5 relative overflow-hidden flex flex-col justify-between group">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-amber-500/20 blur-2xl group-hover:bg-amber-500/30 transition-all pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Operação & Cozinha</h3>
                  <span className="text-[10px] text-slate-400">Eficiência KPH & KDS</span>
                </div>
              </div>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Meta SLA {operationalData.slaTarget}%</span>
              </span>
            </div>

            {/* Skeleton or Content */}
            {isLoading ? (
              <div className="space-y-3 animate-pulse py-2">
                <div className="h-8 bg-white/10 rounded-lg w-3/4" />
                <div className="h-16 bg-white/5 rounded-xl w-full" />
              </div>
            ) : (
              <>
                {/* Main SLA Metric */}
                <div className="mt-1 mb-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white tracking-tight">
                      {operationalData.kitchenSla}%
                    </span>
                    <span className="text-xs font-medium text-emerald-400">
                      SLA Cozinha
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tempo Médio de Preparo: <span className="font-mono text-cyan-300 font-semibold">{operationalData.avgPreparationTime}</span>
                  </div>
                </div>

                {/* Shift Performance Bars */}
                <div className="space-y-2 mt-2 bg-white/5 rounded-xl p-2.5 border border-white/5">
                  <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                    Eficiência por Turno
                  </div>
                  {operationalData.shifts.map(shift => (
                    <div key={shift.name} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-300">
                        <span>{shift.name} ({shift.orders} pedidos)</span>
                        <span className="font-mono font-semibold text-amber-300">{shift.efficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                          style={{ width: `${shift.efficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Operational Quick Stats */}
          <div className="mt-3 pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-center text-[10px]">
            <div className="bg-white/5 rounded-lg py-1">
              <span className="text-slate-400 block">Desperdício / CMV</span>
              <span className="font-bold text-emerald-400 text-xs">{operationalData.wasteRate}% (Ótimo)</span>
            </div>
            <div className="bg-white/5 rounded-lg py-1">
              <span className="text-slate-400 block">Total Expedido</span>
              <span className="font-bold text-white text-xs">{operationalData.totalOrdersToday} pratos</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl liquid-glass-card p-5 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4"><CheckCircle2 className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-200">Pedidos expedidos</h3>
            <p className="text-xs text-slate-400 mt-1">Hoje · {unit?.name ?? 'Visão geral'}</p>
            <p className="text-3xl font-bold text-white mt-5">{operationalData.totalOrdersToday}</p>
            <p className="text-xs text-slate-400 mt-2">Produção concluída no dia</p>
          </div>
          <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
            {operationalData.shifts.map(shift => <div key={shift.name} className="flex justify-between gap-2 text-xs"><span className="text-slate-400">{shift.name}</span><span className="font-medium text-emerald-300">{shift.orders}</span></div>)}
          </div>
        </div>
        <div className="rounded-3xl liquid-glass-card p-5 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4"><Users className="w-5 h-5" /></div>
            <h3 className="text-sm font-semibold text-slate-200">Capacidade do salão</h3>
            <p className="text-xs text-slate-400 mt-1">{unit?.name ?? 'Visão geral'}</p>
            <p className="text-3xl font-bold text-white mt-5">{reservationData.totalTables - reservationData.occupiedTables} <span className="text-sm font-normal text-slate-400">mesas livres</span></p>
            <p className="text-xs text-slate-400 mt-2">de {reservationData.totalTables} mesas disponíveis na operação</p>
          </div>
          <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Mesas ocupadas</span><span className="text-blue-300">{reservationData.occupiedTables}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Pessoas na espera</span><span className="text-amber-300">{reservationData.waitlistCount}</span></div>
            <p className="text-slate-400">Pico previsto: {reservationData.peakWindow}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
