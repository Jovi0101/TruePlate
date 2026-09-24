import { useEffect, useState } from 'react';

export type Route =
  | { name: 'landing' }
  | { name: 'auth' }
  | { name: 'dashboard' }
  | { name: 'novo' }
  | { name: 'editar'; id: string }
  | { name: 'qr'; id: string }
  | { name: 'publico'; id: string; data: string | null };

export function parseRoute(hash: string): Route {
  let h = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!h.startsWith('/')) h = '/' + h;
  const [pathPart, queryPart] = h.split('?');
  const segments = pathPart.split('/').filter(Boolean);

  if (segments.length === 0) return { name: 'landing' };
  if (segments[0] === 'entrar') return { name: 'auth' };

  if (segments[0] === 'painel') {
    if (segments.length === 1) return { name: 'dashboard' };
    if (segments[1] === 'novo') return { name: 'novo' };
    if (segments.length >= 3 && segments[2] === 'editar') return { name: 'editar', id: segments[1] };
    if (segments.length >= 3 && segments[2] === 'qr') return { name: 'qr', id: segments[1] };
    return { name: 'dashboard' };
  }

  if (segments[0] === 'p' && segments[1]) {
    let data: string | null = null;
    if (queryPart) data = new URLSearchParams(queryPart).get('d');
    return { name: 'publico', id: segments[1], data };
  }

  return { name: 'landing' };
}

export function useRoute(): Route {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parseRoute(hash);
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function buildPublicUrl(id: string, data: string): string {
  const base = window.location.href.split('#')[0];
  return `${base}#/p/${id}?d=${data}`;
}
