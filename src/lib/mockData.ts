import { ProductApp, SalesMetricData, ReservationMetricData, EventLog, OperationalMetricData } from '../types';

export const INITIAL_PRODUCTS: ProductApp[] = [
  {
    id: 'serena-ai',
    name: 'Serena AI',
    tagline: 'Automação & Reservas Inteligentes',
    category: 'Inteligência Artificial',
    status: 'Ativo',
    url: 'https://serena.ai',
    icon: 'bot',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    description: 'Plataforma cognitiva de atendimento omnicanal com IA generativa para automação de reservas, confirmações no WhatsApp e respostas personalizadas 24/7.',
    version: 'v3.4.2',
    metricsPreview: {
      label: 'Conversas Ativas',
      value: '1.428',
      trend: '+24.6%'
    },
    features: [
      'Agente conversacional treinado com cardápios e políticas',
      'Confirmação automática de no-show via WhatsApp',
      'Integração nativa com Tagme e sistemas de PDV',
      'Insights preditivos de cancelamento'
    ]
  },
  {
    id: 'dre-auditor',
    name: 'DRE Auditor',
    tagline: 'Auditoria Financeira & DRE Gerencial',
    category: 'Controladoria & Finanças',
    status: 'Ativo',
    url: 'https://dreauditor.io',
    icon: 'calculator',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    description: 'Demonstrativo de Resultado do Exercício com auditoria algorítmica contínua. Conciliação bancária automatizada, análise de margem e alertas de CMV fora da curva.',
    version: 'v2.8.0',
    metricsPreview: {
      label: 'Margem EBITDA',
      value: '23.8%',
      trend: '+3.2%'
    },
    features: [
      'DRE estruturado em tempo real (competência e caixa)',
      'Auditoria de notas fiscais vs pedidos de compra',
      'Deteção preditiva de desvios e furos de estoque',
      'Exportação executiva para PDF e BI'
    ]
  },
  {
    id: 'kph-operacao',
    name: 'KPH Operação',
    tagline: 'Gestão Operacional & Cozinha Industrial',
    category: 'Operações & Cozinha',
    status: 'Ativo',
    url: 'https://kph.orkestri.com/operacao',
    icon: 'utensils',
    gradient: 'from-amber-400 via-orange-500 to-rose-600',
    description: 'Sistema avançado de KDS (Kitchen Display System), roteirização de praças, monitoramento de tempo de preparo e redução drástica de desperdício.',
    version: 'v4.1.0',
    metricsPreview: {
      label: 'SLA Cozinha',
      value: '96.4%',
      trend: '+1.8%'
    },
    features: [
      'KDS multipraça com balanceamento de carga automático',
      'Cronômetro dinâmico com alerta visual de atraso',
      'Módulo de checklist higiênico e abertura de turno',
      'Integração instantânea com salão e delivery'
    ]
  },
  {
    id: 'kph-pessoas',
    name: 'KPH Pessoas',
    tagline: 'Gestão de Equipes & RH Estratégico',
    category: 'Capital Humano',
    status: 'Beta',
    url: 'https://kph.orkestri.com/pessoas',
    icon: 'users',
    gradient: 'from-purple-400 via-pink-500 to-rose-500',
    description: 'Escalas inteligentes de atendimento baseadas na previsão de fluxo de clientes, controle de banco de horas, avaliação de performance e gamificação.',
    version: 'v1.2-beta',
    metricsPreview: {
      label: 'Colaboradores Ativos',
      value: '84',
      trend: '+6 novos'
    },
    features: [
      'Geração algorítmica de escala respeitando CLT',
      'Ponto eletrônico com reconhecimento facial / geolocalização',
      'Matriz de polivalência e treinamentos obrigatórios',
      'NPS interno de satisfação da equipe'
    ]
  },
  {
    id: 'tagme-hub',
    name: 'Tagme Hub',
    tagline: 'Integração & Gestão de Reservas',
    category: 'Hospitalidade',
    status: 'Ativo',
    url: 'https://tagme.com.br',
    icon: 'calendar',
    gradient: 'from-violet-500 via-indigo-600 to-blue-700',
    description: 'Sincronizador central de mesas e reservas omnicanal. Unifica reservas do site, Google Reserve, concierge e aplicativo em um único mapa interativo de salão.',
    version: 'v5.0.3',
    metricsPreview: {
      label: 'Reservas Hoje',
      value: '192',
      trend: '+18.4%'
    },
    features: [
      'Mapa de salão interativo em 2D/3D',
      'Sincronização em tempo real de cancelamentos e check-ins',
      'Gestão de fila de espera com notificação por SMS/WhatsApp',
      'Histórico e preferências VIP do cliente'
    ]
  },
  {
    id: 'totvs-erp',
    name: 'TOTVS ERP',
    tagline: 'Conector de Gestão Empresarial',
    category: 'Backoffice & Fiscal',
    status: 'Manutenção',
    url: 'https://totvs.com',
    icon: 'layers',
    gradient: 'from-slate-400 via-zinc-600 to-neutral-800',
    description: 'Conector corporativo e sincronização de dados mestre com TOTVS Protheus / Chef Web. Gestão fiscal, emissão de NF-e e controle de contas a pagar/receber.',
    version: 'v3.1.9',
    metricsPreview: {
      label: 'Sync Status',
      value: 'Pausado',
      trend: 'Job #412'
    },
    features: [
      'Sincronização bidirecional de pedidos e notas fiscais',
      'Módulo de auditoria fiscal e SPED pré-validado',
      'Gestão de contratos com fornecedores e insumos',
      'Fila de mensageria com retry automático e dead-letter'
    ]
  }
];

export const INITIAL_SALES_METRIC: SalesMetricData = {
  totalRevenue: 487650.00,
  monthlyGoal: 520000.00,
  growthPercentage: 18.4,
  history: [
    { day: 'Seg', amount: 54200 },
    { day: 'Ter', amount: 62400 },
    { day: 'Qua', amount: 58900 },
    { day: 'Qui', amount: 74100 },
    { day: 'Sex', amount: 89300 },
    { day: 'Sáb', amount: 96800 },
    { day: 'Dom', amount: 51950 }
  ],
  breakdown: [
    { name: 'Serena AI (Reservas)', share: 44, amount: 214566, color: '#00f2fe' },
    { name: 'KPH Operação (Consumo)', share: 36, amount: 175554, color: '#10b981' },
    { name: 'Tagme Hub (Eventos)', share: 15, amount: 73147, color: '#8a2be2' },
    { name: 'Outros Canais', share: 5, amount: 24383, color: '#f59e0b' }
  ]
};

export const INITIAL_RESERVATION_METRIC: ReservationMetricData = {
  occupancyRate: 84,
  occupiedTables: 42,
  totalTables: 50,
  reservedToday: 192,
  waitlistCount: 14,
  peakWindow: '19:30 - 22:30',
  hourlyFlow: [
    { hour: '12h', occupancy: 45 },
    { hour: '13h', occupancy: 82 },
    { hour: '14h', occupancy: 65 },
    { hour: '18h', occupancy: 35 },
    { hour: '19h', occupancy: 70 },
    { hour: '20h', occupancy: 94 },
    { hour: '21h', occupancy: 98 },
    { hour: '22h', occupancy: 78 }
  ]
};

export const INITIAL_OPERATIONAL_METRIC: OperationalMetricData = {
  kitchenSla: 96.4,
  slaTarget: 95.0,
  avgPreparationTime: '11m 42s',
  wasteRate: 0.8,
  totalOrdersToday: 418,
  currentShift: 'Jantar (Pico Ativo)',
  shifts: [
    { name: 'Almoço', efficiency: 97.2, orders: 154 },
    { name: 'Tarde / Prep', efficiency: 98.5, orders: 42 },
    { name: 'Jantar', efficiency: 94.8, orders: 222 }
  ]
};

export const INITIAL_EVENTS: EventLog[] = [
  {
    id: 'evt-1',
    product: 'Serena AI',
    title: 'Reserva Confirmada via WhatsApp',
    description: 'Mesa #14 para 6 pessoas às 20h30 confirmada com sucesso após lembrete automático.',
    status: 'success',
    timestamp: '2026-10-02T08:58:10Z',
    relativeTime: 'Há 1 minuto'
  },
  {
    id: 'evt-2',
    product: 'Tagme Hub',
    title: 'Sincronização Omnicanal Concluída',
    description: '18 novas reservas importadas do canal Google Reserve com reconciliação imediata.',
    status: 'success',
    timestamp: '2026-10-02T08:54:22Z',
    relativeTime: 'Há 4 minutos'
  },
  {
    id: 'evt-3',
    product: 'KPH Operação',
    title: 'Tempo de Espera em Atenção',
    description: 'Prato #104 (Bife Ancho Especial) na praça da grelha atingiu 13m 30s de preparo.',
    status: 'warning',
    timestamp: '2026-10-02T08:49:05Z',
    relativeTime: 'Há 9 minutos'
  },
  {
    id: 'evt-4',
    product: 'DRE Auditor',
    title: 'Conciliação Bancária Finalizada',
    description: 'Lote diário de faturamento conciliado com 100% de precisão (R$ 96.800,00).',
    status: 'success',
    timestamp: '2026-10-02T08:35:12Z',
    relativeTime: 'Há 23 minutos'
  },
  {
    id: 'evt-5',
    product: 'TOTVS ERP',
    title: 'Manutenção Preventiva de Conector',
    description: 'Job de sincronização em pausa para atualização de certificados de segurança TLS 1.3.',
    status: 'warning',
    timestamp: '2026-10-02T08:15:00Z',
    relativeTime: 'Há 43 minutos'
  },
  {
    id: 'evt-6',
    product: 'KPH Pessoas',
    title: 'Escala do Turno Noturno Validada',
    description: '100% dos postos chave preenchidos com saldo positivo no banco de horas.',
    status: 'info',
    timestamp: '2026-10-02T07:50:00Z',
    relativeTime: 'Há 1 hora'
  }
];
