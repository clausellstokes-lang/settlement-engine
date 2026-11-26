let mod = null;
const find = (o, k, d = 0) => { if (!o || typeof o !== 'object' || d > 6) return undefined; if (k in o) return o[k]; for (const v of Object.values(o)) { const r = find(v, k, d + 1); if (r !== undefined) return r; } return undefined; };
export async function measure(t, { tree }) {
  mod ||= await import(`${tree}/src/components/new/economyDeskRead.js`);
  const r = mod.economyDeskRead(t);
  const h = find(r, 'prosperityHeader');
  return { h: h == null ? null : (typeof h === 'string' ? h : JSON.stringify(h)), access: t.config?.tradeRouteAccess ?? null, prosperity: t.economicState?.prosperity ?? null, name: t.name };
}
