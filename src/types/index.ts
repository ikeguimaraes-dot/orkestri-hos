export type AppStatus = 'Ativo' | 'Beta' | 'Manutenção';

export interface ProductApp {
  id: string;
  name: string;
  tagline: string;
  category: string;
  status: AppStatus;
  url: string;
  icon: string; // icon identifier: 'bot' | 'calculator' | 'utensils' | 'users' | 'calendar' | 'layers' | 'database' | 'cpu'
  gradient: string;
  description: string;
  version: string;
  metricsPreview?: {
    label: string;
    value: string;
    trend: string;
  };
  features?: string[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  status: 'connected' | 'simulated' | 'error' | 'testing';
  statusMessage: string;
  lastPing: number | null;
  latencyMs: number | null;
  useFallbackIfKeyDisabled: boolean;
  tables: {
    sales: string;
    reservations: string;
    events: string;
    operational: string;
    products: string;
  };
}

export interface SalesMetricData {
  totalRevenue: number;
  monthlyGoal: number;
  growthPercentage: number;
  history: { day: string; amount: number }[];
  breakdown: {
    name: string;
    share: number;
    amount: number;
    color: string;
  }[];
}

export interface ReservationMetricData {
  occupancyRate: number;
  occupiedTables: number;
  totalTables: number;
  reservedToday: number;
  waitlistCount: number;
  hourlyFlow: { hour: string; occupancy: number }[];
  peakWindow: string;
}

export interface EventLog {
  id: string;
  product: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  relativeTime: string;
}

export interface OperationalMetricData {
  kitchenSla: number;
  slaTarget: number;
  avgPreparationTime: string;
  wasteRate: number;
  totalOrdersToday: number;
  currentShift: string;
  shifts: {
    name: string;
    efficiency: number;
    orders: number;
  }[];
}

export type ActiveView = 'launcher' | 'dashboard' | 'split';
