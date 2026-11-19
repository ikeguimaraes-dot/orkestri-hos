import { Bot, Calculator, Utensils, Users, Calendar, Layers, Database } from 'lucide-react';
import type { ProductApp } from '../types';

const transparentLogos: Record<string, string> = Object.fromEntries(
  ['phi', 'mise', 'le-chef', 'maestri', 'ops', 'pipou-academy', 'talki'].map(name => [
    `/logos/${name}.png`, `/logos/transparent/${name}.png`,
  ]),
);
const fallbackIcons = { bot: Bot, calculator: Calculator, utensils: Utensils, users: Users, calendar: Calendar, layers: Layers };

export function ProductLogo({ product, className = '' }: { product: ProductApp; className?: string }) {
  if (product.logoUrl) {
    return <img src={transparentLogos[product.logoUrl] ?? product.logoUrl} alt={product.name} className={`object-contain ${className}`} />;
  }
  const Icon = fallbackIcons[product.icon as keyof typeof fallbackIcons] ?? Database;
  return <Icon aria-label={product.name} className={`text-slate-200 ${className}`} />;
}
