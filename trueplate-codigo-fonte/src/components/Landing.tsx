import React from 'react';
import { navigate } from '../router';
import { Icon } from './ui';

export default function Landing() {
  return (
    <div>
      <div className="container hero-landing">
        <span className="badge badge-accent"><Icon name="sparkle" size={13} /> cardápio em realidade aumentada</span>
        <h1 style={{ marginTop: 16 }}>Seu prato, explicado antes da primeira garfada.</h1>
        <p>
          O cliente aponta o celular para o QR Code na mesa e vê o prato em 3D, com cada
          ingrediente e sua informação nutricional — sem baixar aplicativo, sem criar conta.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/entrar')}>Cadastrar meu estabelecimento</button>
          <button className="btn btn-ghost" onClick={() => navigate('/entrar')}>Já tenho conta</button>
        </div>
      </div>

      <div className="container section">
        <h2 className="section-title">Como funciona</h2>
        <p className="section-sub">Do cadastro do prato até a mesa do cliente.</p>
        <div className="steps-list">
          <Step n={1} title="Cadastre o prato" text="Nome, descrição, foto e informações nutricionais — direto ou por ingrediente." />
          <Step n={2} title="Monte a versão 3D" text="Escolha uma composição visual e associe cada parte a um ingrediente cadastrado." />
          <Step n={3} title="Gere o QR Code" text="Cada prato ganha um link e um código próprios, prontos para imprimir na mesa." />
          <Step n={4} title="O cliente escaneia" text="A página do prato abre na hora, com o botão para abrir a experiência em 3D." />
          <Step n={5} title="Explora em 3D" text="Ele gira, aproxima e toca em cada alimento para ver as calorias e macros daquela parte." />
        </div>
      </div>

      <div className="container">
        <div className="card" style={{ background: 'var(--brand-soft)', border: 'none' }}>
          <h3 style={{ color: 'var(--brand-strong)', marginBottom: 8 }}>Sem cadastro para o cliente</h3>
          <p style={{ color: 'var(--brand-strong)', opacity: 0.85, fontSize: 14.5 }}>
            Ninguém precisa instalar nada nem criar login para ver o prato — o link já abre a experiência completa em qualquer celular.
          </p>
        </div>
      </div>

      <div className="container">
        <p className="limits-note">
          Versão de demonstração: os pratos ficam salvos neste navegador, ligados a este estabelecimento de teste.
          Os modelos 3D usam formas simples para representar cada alimento — não são fotos ou digitalizações reais do prato.
          A experiência de realidade aumentada nativa (câmera detectando a mesa) depende do aparelho e do navegador de quem
          escaneia o código; quando não está disponível, a página abre automaticamente o visualizador 3D interativo no lugar,
          em vez de simular uma AR que não existe.
        </p>
      </div>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="step-row">
      <span className="step-num">{n}</span>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
}
