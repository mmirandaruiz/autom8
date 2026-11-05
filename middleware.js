export const config = { matcher: ['/'] };

export function chooseLang({ acceptLanguage, country, cookie, userAgent } = {}) {
  // Crawlers and requests without a user agent always see Spanish.
  if (!userAgent || /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|preview|lighthouse|pagespeed|inspectiontool|feedfetcher|ia_archiver|headlesschrome/i.test(userAgent)) return 'es';
  // An explicit language selection wins over browser and country preferences.
  for (const part of (cookie || '').split(';')) {
    const match = /^\s*autom8-lang=(en|es)\s*$/.exec(part);
    if (match) return match[1];
  }
  // Compare the highest nonzero quality for each supported primary language.
  const best = { en: { q: 0, pos: Infinity }, es: { q: 0, pos: Infinity } };
  (acceptLanguage || '').split(',').forEach((entry, pos) => {
    const [tag, ...params] = entry.trim().split(';');
    const lang = tag.toLowerCase().split('-')[0];
    if (lang !== 'en' && lang !== 'es') return;
    const quality = params.find(param => /^\s*q\s*=/i.test(param));
    const q = quality === undefined ? 1 : Number(quality.split('=')[1].trim());
    if (!Number.isFinite(q) || q <= 0 || q > 1) return;
    if (q > best[lang].q) best[lang] = { q, pos };
  });
  if (best.en.q > best.es.q) return 'en';
  if (best.es.q > best.en.q) return 'es';
  // Country breaks equal qualities, including when neither language is present.
  if ((country || '').toUpperCase() === 'US') return 'en';
  if ((country || '').toUpperCase() === 'ES') return 'es';
  // Otherwise the first listed language wins; Spanish is the fallback.
  return best.en.pos < best.es.pos ? 'en' : 'es';
}

export default function middleware(request) {
  const lang = chooseLang({
    acceptLanguage: request.headers.get('accept-language'),
    country: request.headers.get('x-vercel-ip-country'),
    cookie: request.headers.get('cookie'),
    userAgent: request.headers.get('user-agent')
  });
  if (lang === 'en') {
    const url = new URL(request.url);
    url.pathname = '/en';
    return new Response(null, { status: 307, headers: {
      Location: url.href,
      'Cache-Control': 'private, no-store',
      Vary: 'Accept-Language, Cookie'
    } });
  }
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}
