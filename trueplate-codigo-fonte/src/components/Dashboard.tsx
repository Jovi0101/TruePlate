import React, { useState } from 'react';
import type { Establishment } from '../types';
import { computeTotals } from '../types';
import { deleteDish, getDishes } from '../store';
import { navigate } from '../router';
import { Icon } from './ui';

export default function Dashboard({ establishment }: { establishment: Establishment }) {
  const [dishes, setDishes] = useState(getDishes());
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function remove(id: string) {
    deleteDish(id);
    setDishes(getDishes());
    setConfirmId(null);
  }

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, gap: 12 }}>
        <div>
          <p className="hint">{establishment.nome}</p>
          <h2>Seus pratos</h2>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/painel/novo')}>
          <Icon name="plus" size={17} /> Novo prato
        </button>
      </div>

      {dishes.length === 0 ? (
        <div className="empty-state card">
          <h3>Nenhum prato cadastrado ainda</h3>
          <p style={{ marginBottom: 20 }}>Cadastre o primeiro prato para gerar sua página pública e o QR Code.</p>
          <button className="btn btn-primary" onClick={() => navigate('/painel/novo')}>Cadastrar primeiro prato</button>
        </div>
      ) : (
        <div className="dish-list">
          {dishes.map((d) => {
            const totals = computeTotals(d);
            return (
              <div className="dish-row" key={d.id}>
                <div className="dish-thumb">
                  {d.fotoUrl ? <img src={d.fotoUrl} alt="" /> : d.nome.slice(0, 1).toUpperCase()}
                </div>
                <div className="dish-row-main">
                  <div className="dish-row-title">{d.nome}</div>
                  <div className="dish-row-sub">
                    {Math.round(totals.calorias)} kcal · {d.modo === 'rapido' ? 'modo rápido' : `${d.ingredientes?.length ?? 0} ingredientes`} · /p/{d.id}
                  </div>
                </div>
                <div className="dish-row-actions">
                  <button className="icon-btn" title="Ver QR Code" onClick={() => navigate(`/painel/${d.id}/qr`)}><Icon name="qr" size={17} /></button>
                  <button className="icon-btn" title="Editar" onClick={() => navigate(`/painel/${d.id}/editar`)}><Icon name="edit" size={16} /></button>
                  <button className="icon-btn" title="Excluir" onClick={() => setConfirmId(d.id)}><Icon name="trash" size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card" style={{ marginTop: 28, background: 'transparent', border: '1px dashed var(--line-strong)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="info" size={17} />
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
            Análises de acesso agregadas (quantas pessoas visualizaram ou ativaram a AR) exigem um servidor coletando
            visitas de qualquer cliente, o que esta versão de demonstração ainda não tem — fica para uma próxima etapa.
          </p>
        </div>
      </div>

      {confirmId ? (
        <div className="sheet-backdrop" onClick={() => setConfirmId(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460, margin: '0 auto' }}>
            <div className="sheet-handle" />
            <h3 style={{ marginBottom: 8 }}>Excluir prato?</h3>
            <p className="hint" style={{ marginBottom: 20 }}>O link e o QR Code deste prato deixam de funcionar.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmId(null)}>Cancelar</button>
              <button className="btn btn-danger" style={{ flex: 1, borderColor: 'var(--danger)' }} onClick={() => remove(confirmId)}>Excluir</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
