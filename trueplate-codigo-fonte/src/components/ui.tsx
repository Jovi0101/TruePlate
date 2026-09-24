import React, { useEffect } from 'react';
import type { NutritionTotals } from '../types';
import { round1 } from '../types';

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'back':
      return <svg {...common}><path d="M15 18l-6-6 6-6" /></svg>;
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case 'qr':
      return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" /></svg>;
    case 'download':
      return <svg {...common}><path d="M12 3v12m0 0l-4-4m4 4l4-4" /><path d="M4 19h16" /></svg>;
    case 'copy':
      return <svg {...common}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3" /></svg>;
    case 'nfc':
      return <svg {...common}><path d="M4 8a10 10 0 0114 0" /><path d="M7 11a6 6 0 018 0" /><circle cx="11" cy="15" r="1.4" fill="currentColor" stroke="none" /></svg>;
    case 'cube':
      return <svg {...common}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4.5 7.5L12 12l7.5-4.5M12 12v9" /></svg>;
    case 'edit':
      return <svg {...common}><path d="M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3z" /></svg>;
    case 'trash':
      return <svg {...common}><path d="M4 7h16M9 7V4h6v3m-8 0l1 13h8l1-13" /></svg>;
    case 'check':
      return <svg {...common}><path d="M5 13l4 4L19 7" /></svg>;
    case 'close':
      return <svg {...common}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case 'external':
      return <svg {...common}><path d="M14 5h5v5M9 15L19 5M6 5H5v14h14v-1" /></svg>;
    case 'camera':
      return <svg {...common}><path d="M4 8h3l2-2h6l2 2h3v11H4z" /><circle cx="12" cy="13.5" r="3.3" /></svg>;
    case 'info':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.6v.1" /></svg>;
    case 'sparkle':
      return <svg {...common}><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" /></svg>;
    case 'dashboard':
      return <svg {...common}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>;
  }
}

export type IconName =
  | 'back' | 'plus' | 'qr' | 'download' | 'copy' | 'nfc' | 'cube' | 'edit' | 'trash'
  | 'check' | 'close' | 'external' | 'camera' | 'info' | 'sparkle' | 'dashboard';

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [message, onDone]);
  return <div className="toast" role="status">{message}</div>;
}

export function MacroGrid({ totals, pesoPorcao }: { totals: NutritionTotals; pesoPorcao?: number }) {
  const items: { key: string; label: string; value: number; unit: string; color: string }[] = [
    { key: 'kcal', label: 'Calorias', value: totals.calorias, unit: 'kcal', color: 'var(--ink)' },
    { key: 'prot', label: 'Proteína', value: totals.proteinas, unit: 'g', color: 'var(--protein)' },
    { key: 'carb', label: 'Carboidratos', value: totals.carboidratos, unit: 'g', color: 'var(--carb)' },
    { key: 'gord', label: 'Gorduras', value: totals.gorduras, unit: 'g', color: 'var(--fat)' },
  ];
  if (totals.fibras !== undefined) items.push({ key: 'fibra', label: 'Fibras', value: totals.fibras, unit: 'g', color: 'var(--fiber)' });
  if (totals.sodio !== undefined) items.push({ key: 'sodio', label: 'Sódio', value: totals.sodio, unit: 'mg', color: 'var(--ink-soft)' });

  return (
    <div>
      <div className="macro-grid">
        {items.map((it) => (
          <div className="macro-item" key={it.key}>
            <span className="value" style={{ color: it.color }}>{round1(it.value)}<span className="unit"> {it.unit}</span></span>
            <div className="name">{it.label}</div>
          </div>
        ))}
      </div>
      {pesoPorcao ? <p className="hint" style={{ marginTop: 10 }}>Porção média: aproximadamente {pesoPorcao} g</p> : null}
    </div>
  );
}
