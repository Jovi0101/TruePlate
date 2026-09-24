import React, { useState } from 'react';
import { getEstablishment, saveEstablishment } from '../store';
import { navigate } from '../router';

export default function Auth({ onReady }: { onReady: () => void }) {
  const existing = getEstablishment();
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');

  if (existing) {
    return (
      <div className="container" style={{ paddingTop: 48, maxWidth: 460 }}>
        <div className="card">
          <h2 style={{ marginBottom: 6 }}>Continuar como {existing.nome}</h2>
          <p className="hint" style={{ marginBottom: 20 }}>Este navegador já tem um estabelecimento de demonstração cadastrado.</p>
          <button className="btn btn-primary btn-block" onClick={() => { onReady(); navigate('/painel'); }}>Entrar no painel</button>
        </div>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (nome.trim().length < 2) {
      setError('Informe o nome do seu estabelecimento.');
      return;
    }
    saveEstablishment(nome.trim());
    onReady();
    navigate('/painel');
  }

  return (
    <div className="container" style={{ paddingTop: 48, maxWidth: 460 }}>
      <h2 style={{ marginBottom: 6 }}>Cadastrar estabelecimento</h2>
      <p className="hint" style={{ marginBottom: 22 }}>
        Fluxo de demonstração — sem senha, apenas para identificar seus pratos neste navegador.
      </p>
      <form onSubmit={submit} className="card">
        <div className="field">
          <label className="label" htmlFor="nome-estabelecimento">Nome do estabelecimento</label>
          <input
            id="nome-estabelecimento"
            className="input"
            placeholder="Ex.: Cantina da Serra"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoFocus
          />
          {error ? <span className="hint" style={{ color: 'var(--danger)' }}>{error}</span> : null}
        </div>
        <button className="btn btn-primary btn-block" type="submit">Criar e entrar no painel</button>
      </form>
    </div>
  );
}
