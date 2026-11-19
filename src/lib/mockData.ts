import { ProductApp, SalesMetricData, ReservationMetricData, EventLog, OperationalMetricData } from '../types';

export const INITIAL_PRODUCTS: ProductApp[] = [
  {
    id: 'phi',
    name: 'Phi',
    tagline: 'Gestão Financeira & DRE',
    category: 'Controladoria & Finanças',
    status: 'Ativo',
    url: 'https://kph-os-financeiro.vercel.app',
    icon: 'calculator',
    logoUrl: '/logos/phi.png',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    description: 'Controladoria financeira de alta precisão, fluxo de caixa, conciliação bancária automatizada e DRE gerencial em tempo real.',
    version: 'v2.8.0',
    metricsPreview: {
      label: 'Margem EBITDA',
      value: '24.2%',
      trend: '+3.4%'
    },
    features: [
      'DRE gerencial em tempo real (competência e caixa)',
      'Conciliação bancária automatizada e contas a pagar/receber',
      'Auditoria contínua de custos e notas fiscais',
      'Exportação executiva para PDF e relatórios para investidores'
    ]
  },
  {
    id: 'mise',
    name: 'Mise',
    tagline: 'Backoffice, Estoque & Compras',
    category: 'Backoffice & Suprimentos',
    status: 'Ativo',
    url: 'https://mise-backoffice-nine.vercel.app',
    icon: 'layers',
    logoUrl: '/logos/mise.png',
    gradient: 'from-orange-500 via-amber-500 to-rose-600',
    description: 'Gestão integrada de suprimentos, compras automáticas com fornecedores, estoque mínimo, controle de lote e conferência de notas fiscais.',
    version: 'v3.1.2',
    metricsPreview: {
      label: 'Giro de Estoque',
      value: '98.2%',
      trend: 'Estável'
    },
    features: [
      'Cotação e emissão de pedidos de compra automatizados',
      'Controle rigoroso de lote e validade de insumos perecíveis',
      'Entrada direta de NF-e via SEFAZ / XML',
      'Auditoria de rupturas e perdas operacionais'
    ]
  },
  {
    id: 'le-chefe',
    name: 'Le Chefe',
    tagline: 'Fichas Técnicas, Custos & CMV',
    category: 'Engenharia de Cardápio',
    status: 'Ativo',
    url: 'https://fichatecnica-sandy.vercel.app',
    icon: 'utensils',
    logoUrl: '/logos/le-chef.png',
    gradient: 'from-rose-500 via-pink-600 to-purple-600',
    description: 'Engenharia de receitas, cálculo dinâmico de Custo de Mercadoria Vendida (CMV), tabelas nutricionais e rendimentos de preparação.',
    version: 'v2.4.0',
    metricsPreview: {
      label: 'CMV Médio',
      value: '28.4%',
      trend: '-1.2%'
    },
    features: [
      'Fichas técnicas operacionais e gerenciais completas',
      'Recálculo automático de custos por variação de insumos',
      'Matriz de engenharia de cardápio (Menu Engineering Matrix)',
      'Modo passo a passo de preparo para a equipe de cozinha'
    ]
  },
  {
    id: 'maestri',
    name: 'Maestri',
    tagline: 'Inteligência de Negócios & BI',
    category: 'Inteligência & Analytics',
    status: 'Ativo',
    url: 'https://kph-os.vercel.app/inteligencia',
    icon: 'bot',
    logoUrl: '/logos/maestri.png',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    description: 'Central de inteligência analítica com previsibilidade de demanda, ticket médio, análise de comportamento de consumo e alertas preditivos.',
    version: 'v3.5.0',
    metricsPreview: {
      label: 'Previsão de Demanda',
      value: '96.8%',
      trend: '+4.1%'
    },
    features: [
      'Previsão de faturamento por modelos de machine learning',
      'Segmentação RFM e hábitos de consumo de clientes',
      'Painel executivo com metas dinâmicas por unidade',
      'Alertas preditivos de desvio de KPI e anomalias'
    ]
  },
  {
    id: 'ops',
    name: 'Ops.',
    tagline: 'KDS, Produção & Despacho',
    category: 'Operações & Cozinha',
    status: 'Ativo',
    url: 'https://kph-os.vercel.app/operacao',
    icon: 'utensils',
    logoUrl: '/logos/ops.png',
    gradient: 'from-amber-400 via-orange-500 to-yellow-600',
    description: 'Kitchen Display System (KDS), balanceamento de praças de produção, tempos de espera em tempo real e eficiência da expedição.',
    version: 'v4.1.0',
    metricsPreview: {
      label: 'SLA de Cozinha',
      value: '96.4%',
      trend: '+1.8%'
    },
    features: [
      'KDS multipraça com balanceamento dinâmico de pedidos',
      'Cronômetro visual de atraso com alertas por cores',
      'Checklist de abertura e fechamento de turno higiênico',
      'Integração instantânea entre salão, bar e delivery'
    ]
  },
  {
    id: 'pipou',
    name: 'Pipou',
    tagline: 'Escalas, Pessoas & Academy',
    category: 'Gestão de Equipes & RH',
    status: 'Ativo',
    url: 'https://kph-os.vercel.app/pessoas',
    icon: 'users',
    logoUrl: '/logos/vector/pipou.svg',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    description: 'Gestão de pessoas e escalas dinâmicas orientadas pelo fluxo previsto de salão, controle de ponto e treinamentos contínuos no Pipou Academy.',
    version: 'v2.0',
    metricsPreview: {
      label: 'Engajamento Equipe',
      value: '94.0%',
      trend: '+8 novos'
    },
    features: [
      'Geração inteligente de escalas com conformidade CLT',
      'Pipou Academy: trilhas de capacitação e onboarding de novos talentos',
      'Controle de ponto eletrônico com geolocalização',
      'Matriz de polivalência e histórico de desempenho'
    ]
  },
  {
    id: 'talki',
    name: 'Talki',
    tagline: 'Atendimento Omnichannel & Reservas',
    category: 'Comunicação & Atendimento',
    status: 'Ativo',
    url: 'https://talki-eight.vercel.app',
    icon: 'bot',
    logoUrl: '/logos/talki.png',
    gradient: 'from-violet-500 via-indigo-600 to-blue-600',
    description: 'Plataforma omnichannel de atendimento conversacional com IA, confirmação automática de reservas no WhatsApp e engajamento 24/7.',
    version: 'v3.2.0',
    metricsPreview: {
      label: 'Conversas Ativas',
      value: '1.428',
      trend: '+24.6%'
    },
    features: [
      'Agente conversacional IA com cardápios integrados',
      'Confirmação e redução drástica de no-show via WhatsApp',
      'Sincronização em tempo real com mapa de salão',
      'Disparo de campanhas e pesquisas de NPS pós-experiência'
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
    { name: 'Phi (Controladoria)', share: 38, amount: 185307, color: '#10b981' },
    { name: 'Talki (Reservas)', share: 29, amount: 141418, color: '#00f2fe' },
    { name: 'Mise (Suprimentos)', share: 21, amount: 102406, color: '#f59e0b' },
    { name: 'Ops. (Cozinha)', share: 12, amount: 58519, color: '#8a2be2' }
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
    product: 'Talki',
    title: 'Reserva Confirmada via WhatsApp',
    description: 'Mesa #14 para 6 pessoas às 20h30 confirmada com sucesso após lembrete automático.',
    status: 'success',
    timestamp: '2026-10-02T08:58:10Z',
    relativeTime: 'Há 1 minuto'
  },
  {
    id: 'evt-2',
    product: 'Phi',
    title: 'Fechamento Contábil Conciliado',
    description: 'Lote diário de faturamento conciliado com 100% de precisão (R$ 96.800,00).',
    status: 'success',
    timestamp: '2026-10-02T08:54:22Z',
    relativeTime: 'Há 4 minutos'
  },
  {
    id: 'evt-3',
    product: 'Ops.',
    title: 'Tempo de Espera em Atenção',
    description: 'Prato #104 (Bife Ancho Especial) na praça da grelha atingiu 13m 30s de preparo.',
    status: 'warning',
    timestamp: '2026-10-02T08:49:05Z',
    relativeTime: 'Há 9 minutos'
  },
  {
    id: 'evt-4',
    product: 'Le Chefe',
    title: 'Atualização de Custo de Insumo',
    description: 'Cotação de Filé Mignon atualizada com recálculo automático de CMV na Ficha #42.',
    status: 'info',
    timestamp: '2026-10-02T08:35:12Z',
    relativeTime: 'Há 23 minutos'
  },
  {
    id: 'evt-5',
    product: 'Mise',
    title: 'Pedido de Reposição Enviado',
    description: 'Pedido automático #882 enviado para distribuidor de hortifrúti após atingir estoque mínimo.',
    status: 'success',
    timestamp: '2026-10-02T08:15:00Z',
    relativeTime: 'Há 43 minutos'
  },
  {
    id: 'evt-6',
    product: 'Pipou',
    title: 'Escala do Turno Noturno Validada',
    description: '100% dos postos chave preenchidos com saldo positivo no banco de horas.',
    status: 'info',
    timestamp: '2026-10-02T07:50:00Z',
    relativeTime: 'Há 1 hora'
  },
  {
    id: 'evt-7',
    product: 'Maestri',
    title: 'Projeção de Fluxo de Fim de Semana',
    description: 'Previsão de 420 atendimentos para sábado gerada com índice de confiança de 96.8%.',
    status: 'success',
    timestamp: '2026-10-02T07:30:00Z',
    relativeTime: 'Há 1h 30m'
  }
];
