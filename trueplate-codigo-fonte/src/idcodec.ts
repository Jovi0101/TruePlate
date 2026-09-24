import type { Dish, Ingredient, Modo, TemplateId } from './types';
import dishTemplates from './data/dishTemplates.json';

type CompactIngredient = [string, number, string, number, number, number, number, number | null, number | null];

interface CompactDish {
  n: string;
  e: string;
  ds: string;
  c: string;
  f?: string;
  w: number;
  pr?: number;
  m: 'r' | 'd';
  t?: [number, number, number, number, number | null, number | null];
  ig?: CompactIngredient[];
  tp: TemplateId;
  pm: string[];
}

function partOrder(tp: TemplateId): string[] {
  return (dishTemplates.templates as any)[tp].parts.map((p: any) => p.role);
}

export function encodeDish(dish: Dish, establishmentName: string): string {
  const compact: CompactDish = {
    n: dish.nome,
    e: establishmentName,
    ds: dish.descricao,
    c: dish.categoria,
    f: dish.fotoUrl || undefined,
    w: dish.pesoPorcao,
    pr: dish.preco,
    m: dish.modo === 'rapido' ? 'r' : 'd',
    tp: dish.templateId,
    pm: [],
  };

  if (dish.modo === 'rapido' && dish.totalsManual) {
    const t = dish.totalsManual;
    compact.t = [t.calorias, t.proteinas, t.carboidratos, t.gorduras, t.fibras ?? null, t.sodio ?? null];
  }

  const ingList = dish.ingredientes ?? [];
  if (dish.modo === 'detalhado') {
    compact.ig = ingList.map((i) => [
      i.nome,
      i.quantidade,
      i.unidade,
      i.calorias,
      i.proteinas,
      i.carboidratos,
      i.gorduras,
      i.fibras ?? null,
      i.sodio ?? null,
    ]);
  }

  const order = partOrder(dish.templateId);
  compact.pm = order.map((role) => {
    const val = dish.partMap[role] ?? '';
    if (dish.modo === 'detalhado') {
      const idx = ingList.findIndex((i) => i.id === val);
      return String(idx >= 0 ? idx : 0);
    }
    return val;
  });

  const json = JSON.stringify(compact);
  return toBase64Url(new TextEncoder().encode(json));
}

export function decodeDish(encoded: string): { dish: Dish; establishmentName: string } | null {
  try {
    const bytes = fromBase64Url(encoded);
    const json = new TextDecoder().decode(bytes);
    const c: CompactDish = JSON.parse(json);

    const modo: Modo = c.m === 'r' ? 'rapido' : 'detalhado';
    let ingredientes: Ingredient[] | undefined;
    if (c.ig) {
      ingredientes = c.ig.map((row, idx) => ({
        id: 'ing' + idx,
        nome: row[0],
        quantidade: row[1],
        unidade: row[2] as any,
        calorias: row[3],
        proteinas: row[4],
        carboidratos: row[5],
        gorduras: row[6],
        fibras: row[7] ?? undefined,
        sodio: row[8] ?? undefined,
      }));
    }

    const order = partOrder(c.tp);
    const partMap: Record<string, string> = {};
    order.forEach((role, i) => {
      const raw = c.pm[i] ?? '';
      if (modo === 'detalhado' && ingredientes) {
        const idx = Number(raw);
        partMap[role] = ingredientes[idx]?.id ?? ingredientes[0]?.id ?? '';
      } else {
        partMap[role] = raw;
      }
    });

    const dish: Dish = {
      id: '',
      createdAt: 0,
      updatedAt: 0,
      nome: c.n,
      descricao: c.ds,
      categoria: c.c,
      fotoUrl: c.f,
      pesoPorcao: c.w,
      preco: c.pr,
      modo,
      totalsManual: c.t
        ? { calorias: c.t[0], proteinas: c.t[1], carboidratos: c.t[2], gorduras: c.t[3], fibras: c.t[4] ?? undefined, sodio: c.t[5] ?? undefined }
        : undefined,
      ingredientes,
      templateId: c.tp,
      partMap,
    };

    return { dish, establishmentName: c.e };
  } catch {
    return null;
  }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
