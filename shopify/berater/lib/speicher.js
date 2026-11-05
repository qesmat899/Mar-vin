// Kleiner Schlüssel-Wert-Speicher für Rate-Limit, Antwort-Cache und Kostenübersicht.
// Mit KV_REST_API_URL + KV_REST_API_TOKEN (Upstash Redis, über den Vercel Marketplace) dauerhaft;
// ohne diese Variablen nur im Arbeitsspeicher der jeweiligen Server-Instanz (geht bei Neustart verloren).

export function erstelleSpeicher(env = process.env, fetchFn = globalThis.fetch) {
  const url = env.KV_REST_API_URL;
  const token = env.KV_REST_API_TOKEN;
  if (url && token) return redisSpeicher(url.replace(/\/$/, ''), token, fetchFn);
  return speicherImArbeitsspeicher();
}

function redisSpeicher(url, token, fetchFn) {
  const cmd = async (...args) => {
    const r = await fetchFn(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args.map(String)),
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) throw new Error(`KV ${r.status}`);
    return (await r.json()).result;
  };
  return {
    art: 'redis',
    get: async (k) => cmd('GET', k),
    set: async (k, v, ttl) => (ttl ? cmd('SET', k, v, 'EX', ttl) : cmd('SET', k, v)),
    incr: async (k, ttl) => { const n = await cmd('INCR', k); if (n === 1 && ttl) await cmd('EXPIRE', k, ttl); return n; },
    expire: async (k, ttl) => cmd('EXPIRE', k, ttl),
    hincrby: async (k, f, n) => cmd('HINCRBY', k, f, Math.round(n)),
    hgetall: async (k) => {
      const flach = await cmd('HGETALL', k);
      const o = {};
      if (Array.isArray(flach)) for (let i = 0; i < flach.length; i += 2) o[flach[i]] = flach[i + 1];
      else if (flach && typeof flach === 'object') Object.assign(o, flach);
      return o;
    },
  };
}

export function speicherImArbeitsspeicher(jetzt = () => Date.now()) {
  const werte = new Map();
  const ablauf = new Map();
  const lebt = (k) => { const a = ablauf.get(k); if (a && a <= jetzt()) { werte.delete(k); ablauf.delete(k); } return werte.has(k); };
  return {
    art: 'arbeitsspeicher',
    get: async (k) => (lebt(k) ? werte.get(k) : null),
    set: async (k, v, ttl) => { werte.set(k, v); if (ttl) ablauf.set(k, jetzt() + ttl * 1000); else ablauf.delete(k); return 'OK'; },
    incr: async (k, ttl) => { const n = (lebt(k) ? Number(werte.get(k)) : 0) + 1; werte.set(k, String(n)); if (n === 1 && ttl) ablauf.set(k, jetzt() + ttl * 1000); return n; },
    expire: async (k, ttl) => { if (lebt(k)) ablauf.set(k, jetzt() + ttl * 1000); return 1; },
    hincrby: async (k, f, n) => { const h = lebt(k) ? werte.get(k) : {}; h[f] = String(Number(h[f] ?? 0) + Math.round(n)); werte.set(k, h); return Number(h[f]); },
    hgetall: async (k) => (lebt(k) ? { ...werte.get(k) } : {}),
  };
}
