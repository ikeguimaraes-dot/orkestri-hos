import type { SalesMetricData, ReservationMetricData, OperationalMetricData, EventLog } from '../types';

// Example units partition the local demo totals. They are never used for live data.
export const DEMO_UNITS = [
  { id: 'casa-01', name: 'Casa 01', share: 0.4 },
  { id: 'casa-02', name: 'Casa 02', share: 0.34 },
  { id: 'casa-03', name: 'Casa 03', share: 0.26 },
];

function portion(total: number, index: number) {
  if (index === DEMO_UNITS.length - 1) {
    return total - DEMO_UNITS.slice(0, -1).reduce((sum, unit) => sum + Math.round(total * unit.share), 0);
  }
  return Math.round(total * DEMO_UNITS[index].share);
}

export function scopeDemoUnit(index: number, sales: SalesMetricData, reservations: ReservationMetricData, operational: OperationalMetricData, events: EventLog[]) {
  const occupiedTables = portion(reservations.occupiedTables, index);
  const totalTables = portion(reservations.totalTables, index);
  return {
    sales: {
      ...sales,
      totalRevenue: portion(sales.totalRevenue, index),
      monthlyGoal: portion(sales.monthlyGoal, index),
      history: sales.history.map(item => ({ ...item, amount: portion(item.amount, index) })),
      breakdown: sales.breakdown.map(item => ({ ...item, amount: portion(item.amount, index) })),
    },
    reservations: {
      ...reservations, occupiedTables, totalTables,
      occupancyRate: totalTables ? Math.round(occupiedTables / totalTables * 100) : 0,
      reservedToday: portion(reservations.reservedToday, index),
      waitlistCount: portion(reservations.waitlistCount, index),
    },
    operational: {
      ...operational,
      totalOrdersToday: operational.shifts.reduce((sum, shift) => sum + portion(shift.orders, index), 0),
      shifts: operational.shifts.map(item => ({ ...item, orders: portion(item.orders, index) })),
    },
    events: events.filter((_, eventIndex) => eventIndex % DEMO_UNITS.length === index),
  };
}
