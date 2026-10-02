import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Save, 
  Undo,
  Bot,
  Calculator,
  Utensils,
  Users,
  Calendar,
  Layers,
  LucideIcon
} from 'lucide-react';
import { ProductApp, SupabaseConfig, AppStatus } from '../types';
import { soundManager } from '../lib/sound';
import { supabaseService } from '../lib/supabase';
import { INITIAL_PRODUCTS } from '../lib/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  initialTab?: 'products' | 'supabase';
  onClose: () => void;
  products: ProductApp[];
  onSaveProducts: (products: ProductApp[]) => void;
  supabaseConfig: SupabaseConfig;
  onSaveSupabaseConfig: (config: SupabaseConfig) => void;
  onRefreshTelemetry: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  initialTab = 'products',
  onClose,
  products,
  onSaveProducts,
  supabaseConfig,
  onSaveSupabaseConfig,
  onRefreshTelemetry
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'supabase'>(initialTab);

  // Supabase form state
  const [url, setUrl] = useState(supabaseConfig.url);
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey);
  const [salesTable, setSalesTable] = useState(supabaseConfig.tables.sales);
  const [reservationsTable, setReservationsTable] = useState(supabaseConfig.tables.reservations);
  const [eventsTable, setEventsTable] = useState(supabaseConfig.tables.events);
  const [operationalTable, setOperationalTable] = useState(supabaseConfig.tables.operational);
  const [useFallback, setUseFallback] = useState(supabaseConfig.useFallbackIfKeyDisabled);

  // Ping test state
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    latency: number;
    message: string;
    details?: string;
  } | null>(null);

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductTagline, setNewProductTagline] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Inteligência Artificial');
  const [newProductStatus, setNewProductStatus] = useState<AppStatus>('Ativo');
  const [newProductUrl, setNewProductUrl] = useState('https://');
  const [newProductIcon, setNewProductIcon] = useState('bot');
  const [newProductGradient, setNewProductGradient] = useState('from-cyan-400 via-blue-500 to-indigo-600');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    soundManager.playClick();
    setIsTestingPing(true);
    setPingResult(null);

    // Apply temporary credentials for testing
    supabaseService.updateConfig({ url, anonKey });
    const res = await supabaseService.testConnection();

    setIsTestingPing(false);
    setPingResult(res);

    if (res.success) {
      soundManager.playSuccess();
    }
  };

  const handleSaveSupabase = () => {
    soundManager.playSuccess();
    const updated: SupabaseConfig = {
      ...supabaseConfig,
      url,
      anonKey,
      useFallbackIfKeyDisabled: useFallback,
      tables: {
        ...supabaseConfig.tables,
        sales: salesTable,
        reservations: reservationsTable,
        events: eventsTable,
        operational: operationalTable
      }
    };
    onSaveSupabaseConfig(updated);
    setSaveSuccessMessage('Configurações do Supabase salvas com sucesso!');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
    onRefreshTelemetry();
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    soundManager.playSuccess();
    const id = newProductName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const newProduct: ProductApp = {
      id,
      name: newProductName.trim(),
      tagline: newProductTagline.trim() || 'Solução Cloud Orkestri',
      category: newProductCategory,
      status: newProductStatus,
      url: newProductUrl.trim() || 'https://orkestri.com',
      icon: newProductIcon,
      gradient: newProductGradient,
      description: newProductDescription.trim() || 'Aplicativo integrado ao ecossistema Orkestri HOS.',
      version: 'v1.0.0',
      metricsPreview: {
        label: 'Status Operacional',
        value: '100%',
        trend: '+5.0%'
      }
    };

    const updated = [newProduct, ...products];
    onSaveProducts(updated);
    localStorage.setItem('orkestri_custom_products_v3', JSON.stringify(updated));

    // Reset form
    setNewProductName('');
    setNewProductTagline('');
    setNewProductDescription('');
    setShowAddForm(false);
    setSaveSuccessMessage(`Produto "${newProduct.name}" adicionado com sucesso!`);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    soundManager.playClick();
    if (confirm(`Deseja remover o produto "${name}" do launcher?`)) {
      const updated = products.filter(p => p.id !== id);
      onSaveProducts(updated);
      localStorage.setItem('orkestri_custom_products_v3', JSON.stringify(updated));
    }
  };

  const handleResetDefaults = () => {
    soundManager.playClick();
    if (confirm('Restaurar os 6 produtos padrão do ecossistema Orkestri?')) {
      onSaveProducts(INITIAL_PRODUCTS);
      localStorage.removeItem('orkestri_custom_products_v3');
      setSaveSuccessMessage('Produtos restaurados com sucesso!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-md animate-in fade-in duration-150">
      {/* macOS Sheet / Drawer Container */}
      <div className="relative w-full max-w-3xl max-h-[88vh] rounded-3xl liquid-glass border border-white/25 shadow-2xl flex flex-col overflow-hidden text-left text-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
              Painel de Preferências
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Gerenciamento do Sistema & Supabase
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playWindowClose();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 pb-1 border-b border-white/10 flex items-center space-x-2 bg-white/[0.01]">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('products');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Ecossistema & Produtos SaaS ({products.length})
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('supabase');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'supabase'
                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-white border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conexão Supabase & Métricas</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {saveSuccessMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PRODUTOS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Gerencie os atalhos de produtos exibidos no App Launcher e no Dock do Orkestri HOS.
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetDefaults}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors flex items-center space-x-1 border border-white/10"
                    title="Restaurar produtos padrão"
                  >
                    <Undo className="w-3 h-3" />
                    <span>Restaurar Padrão</span>
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowAddForm(!showAddForm);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{showAddForm ? 'Fechar Formulário' : 'Novo Produto'}</span>
                  </button>
                </div>
              </div>

              {/* Add Product Form */}
              {showAddForm && (
                <form onSubmit={handleAddProduct} className="p-4 rounded-2xl liquid-glass border border-cyan-400/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cadastrar Novo Produto</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Nome do Produto</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Serena Menu AI"
                        value={newProductName}
                        onChange={e => setNewProductName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Tagline / Subtítulo</label>
                      <input
                        type="text"
                        placeholder="Ex: Cardápio Digital & Upsell"
                        value={newProductTagline}
                        onChange={e => setNewProductTagline(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Categoria</label>
                      <select
                        value={newProductCategory}
                        onChange={e => setNewProductCategory(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="Inteligência Artificial">Inteligência Artificial</option>
                        <option value="Controladoria & Finanças">Controladoria & Finanças</option>
                        <option value="Operações & Cozinha">Operações & Cozinha</option>
                        <option value="Capital Humano">Capital Humano</option>
                        <option value="Hospitalidade">Hospitalidade</option>
                        <option value="Backoffice & Fiscal">Backoffice & Fiscal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Status Operacional</label>
                      <select
                        value={newProductStatus}
                        onChange={e => setNewProductStatus(e.target.value as AppStatus)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="Ativo">Ativo (Produção)</option>
                        <option value="Beta">Beta (Testes)</option>
                        <option value="Manutenção">Manutenção</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1">URL de Acesso</label>
                      <input
                        type="url"
                        required
                        placeholder="https://..."
                        value={newProductUrl}
                        onChange={e => setNewProductUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Ícone</label>
                      <select
                        value={newProductIcon}
                        onChange={e => setNewProductIcon(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="bot">Bot / Robô (IA)</option>
                        <option value="calculator">Calculadora / Finanças</option>
                        <option value="utensils">Talheres / Cozinha</option>
                        <option value="users">Usuários / RH</option>
                        <option value="calendar">Calendário / Reservas</option>
                        <option value="layers">Camadas / ERP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Paleta de Gradiente</label>
                      <select
                        value={newProductGradient}
                        onChange={e => setNewProductGradient(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="from-cyan-400 via-blue-500 to-indigo-600">Ciano & Azul Neon</option>
                        <option value="from-emerald-400 via-teal-500 to-cyan-600">Esmeralda & Verde Água</option>
                        <option value="from-amber-400 via-orange-500 to-rose-600">Âmbar & Laranja Fogo</option>
                        <option value="from-purple-400 via-pink-500 to-rose-500">Roxo & Magenta</option>
                        <option value="from-violet-500 via-indigo-600 to-blue-700">Violeta & Indigo</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1">Descrição</label>
                      <textarea
                        rows={2}
                        placeholder="Breve resumo da proposta de valor do aplicativo..."
                        value={newProductDescription}
                        onChange={e => setNewProductDescription(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md"
                    >
                      Salvar Produto
                    </button>
                  </div>
                </form>
              )}

              {/* Products List */}
              <div className="space-y-2">
                {products.map(prod => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${prod.gradient} flex items-center justify-center shadow-md overflow-hidden`}>
                        {prod.logoUrl ? (
                          <img src={prod.logoUrl} alt={prod.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-xs">{prod.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                            {prod.category}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                            {prod.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{prod.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Remover Produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SUPABASE & TELEMETRIA */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl liquid-glass border border-emerald-500/30">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Integração Nativa Supabase
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Conexão direta via <code className="text-cyan-300 font-mono">@supabase/supabase-js</code>. Os Liquid Widgets buscam métricas de vendas, ocupação em tempo real, SLA da cozinha e logs de auditoria.
                    </p>
                  </div>
                </div>
              </div>

              {/* Endpoint & Key Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    placeholder="https://xxx.supabase.co"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Anon / Publishable API Key
                  </label>
                  <textarea
                    rows={3}
                    value={anonKey}
                    onChange={e => setAnonKey(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    placeholder="eyJhbGciOi..."
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Utilize a chave pública anônima do Supabase. Se o projeto desabilitou chaves JWT legadas, o sistema mantém os widgets ativos com fallback dinâmico de segurança.
                  </span>
                </div>

                {/* Table Names Mapping */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">
                    Mapeamento das Tabelas Supabase
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Tabela de Vendas / Faturamento</label>
                      <input
                        type="text"
                        value={salesTable}
                        onChange={e => setSalesTable(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Tabela de Reservas & Ocupação</label>
                      <input
                        type="text"
                        value={reservationsTable}
                        onChange={e => setReservationsTable(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Tabela de Logs & Eventos</label>
                      <input
                        type="text"
                        value={eventsTable}
                        onChange={e => setEventsTable(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Tabela de Operação KPH</label>
                      <input
                        type="text"
                        value={operationalTable}
                        onChange={e => setOperationalTable(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Fallback Switch */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Modo Fallback & Simulação Inteligente</div>
                    <div className="text-[11px] text-slate-400">
                      Mantém gráficos e métricas alimentados se a tabela ainda não tiver registros.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={useFallback}
                    onChange={e => setUseFallback(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>

                {/* Connection Ping Diagnostic Box */}
                {pingResult && (
                  <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-in fade-in ${
                    pingResult.success 
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' 
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                  }`}>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{pingResult.message}</span>
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/30">
                        Latência: {pingResult.latency}ms
                      </span>
                    </div>
                    {pingResult.details && (
                      <p className="text-[11px] text-slate-300 leading-relaxed font-mono opacity-90 pt-1">
                        {pingResult.details}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingPing}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-colors border border-white/10 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>{isTestingPing ? 'Testando Conexão...' : 'Testar Conexão Agora'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSupabase}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Configurações</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
