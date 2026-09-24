export type Unidade = 'g' | 'ml' | 'un';

export interface NutritionTotals {
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  fibras?: number;
  sodio?: number; // mg
}

export interface Ingredient extends NutritionTotals {
  id: string;
  nome: string;
  quantidade: number;
  unidade: Unidade;
}

export type TemplateId = 't3' | 't4' | 't5';

export type Modo = 'rapido' | 'detalhado';

export interface Dish {
  id: string; // short public id, e.g. "8F42K"
  createdAt: number;
  updatedAt: number;
  nome: string;
  descricao: string;
  categoria: string;
  fotoUrl?: string;
  pesoPorcao: number; // grams
  preco?: number;
  modo: Modo;
  totalsManual?: NutritionTotals; // used when modo === 'rapido'
  ingredientes?: Ingredient[]; // used when modo === 'detalhado'
  templateId: TemplateId;
  /** role -> ingredient id (modo detalhado) or free-text label (modo rapido) */
  partMap: Record<string, string>;
}

export interface Establishment {
  id: string;
  nome: string;
  createdAt: number;
}

export function computeTotals(dish: Dish): NutritionTotals {
  if (dish.modo === 'rapido' && dish.totalsManual) return dish.totalsManual;
  const list = dish.ingredientes ?? [];
  const totals: NutritionTotals = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0, sodio: 0 };
  let hasFibra = false;
  let hasSodio = false;
  for (const ing of list) {
    totals.calorias += num(ing.calorias);
    totals.proteinas += num(ing.proteinas);
    totals.carboidratos += num(ing.carboidratos);
    totals.gorduras += num(ing.gorduras);
    if (ing.fibras !== undefined) {
      hasFibra = true;
      totals.fibras = (totals.fibras ?? 0) + num(ing.fibras);
    }
    if (ing.sodio !== undefined) {
      hasSodio = true;
      totals.sodio = (totals.sodio ?? 0) + num(ing.sodio);
    }
  }
  if (!hasFibra) delete totals.fibras;
  if (!hasSodio) delete totals.sodio;
  return totals;
}

function num(v: number | undefined): number {
  return typeof v === 'number' && !Number.isNaN(v) ? v : 0;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
