import type { Dish, Establishment } from './types';

const K_ESTABLISHMENT = 'trueplate.establishment.v1';
const K_DISHES = 'trueplate.dishes.v1';

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid ambiguity

export function generateShortId(len = 5): string {
  let out = '';
  for (let i = 0; i < len; i++) out += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  return out;
}

export function getEstablishment(): Establishment | null {
  try {
    const raw = localStorage.getItem(K_ESTABLISHMENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveEstablishment(nome: string): Establishment {
  const est: Establishment = { id: generateShortId(8), nome, createdAt: Date.now() };
  localStorage.setItem(K_ESTABLISHMENT, JSON.stringify(est));
  return est;
}

export function clearEstablishment() {
  localStorage.removeItem(K_ESTABLISHMENT);
}

export function getDishes(): Dish[] {
  try {
    const raw = localStorage.getItem(K_DISHES);
    const list = raw ? (JSON.parse(raw) as Dish[]) : [];
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function getDish(id: string): Dish | null {
  return getDishes().find((d) => d.id === id) ?? null;
}

function persist(list: Dish[]) {
  localStorage.setItem(K_DISHES, JSON.stringify(list));
}

export function upsertDish(dish: Dish): Dish {
  const list = getDishes();
  const idx = list.findIndex((d) => d.id === dish.id);
  if (idx >= 0) list[idx] = dish;
  else list.push(dish);
  persist(list);
  return dish;
}

export function deleteDish(id: string) {
  persist(getDishes().filter((d) => d.id !== id));
}

export function newDishId(): string {
  const existing = new Set(getDishes().map((d) => d.id));
  let id = generateShortId();
  while (existing.has(id)) id = generateShortId();
  return id;
}
