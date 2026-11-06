import test from 'node:test';
import assert from 'node:assert/strict';
import middleware, { chooseLang, config } from '../middleware.js';

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const cases = [
  ['en-US', undefined, undefined, 'en'],
  ['es-ES', undefined, undefined, 'es'],
  ['es-ES,es;q=0.9,en;q=0.8', undefined, undefined, 'es'],
  ['en-US,en;q=0.9,es;q=0.8', undefined, undefined, 'en'],
  ['fr-FR,fr;q=0.9,en;q=0.8', undefined, undefined, 'en'],
  ['fr-FR', 'US', undefined, 'en'],
  ['fr-FR', 'ES', undefined, 'es'],
  ['ca-ES,ca;q=0.9', 'ES', undefined, 'es'],
  ['de-DE', 'DE', undefined, 'es'],
  ['', 'US', undefined, 'en'],
  ['en-US', undefined, 'other=x; autom8-lang=es', 'es'],
  ['es-ES', undefined, 'autom8-lang=en; other=x', 'en'],
  ['en;q=0.5,es;q=0.5', 'US', undefined, 'en'],
  ['en;q=0.5,es;q=0.5', 'ES', undefined, 'es'],
  ['en;q=0.5,es;q=0.5', 'DE', undefined, 'en'],
  ['es;q=0.5,en;q=0.5', 'DE', undefined, 'es'],
  ['en;q=0,*', undefined, 'autom8-language=en; autom8-lang=fr', 'es'],
  ['en;q=0.3,es;q=0.7,en-US;q=0.8', undefined, undefined, 'en']
];
for (const [acceptLanguage, country, cookie, expected] of cases) {
  test(`${acceptLanguage || '(empty)'} / ${country || '-'} / ${cookie || '-'}`, () => {
    assert.equal(chooseLang({ acceptLanguage, country, cookie, userAgent }), expected);
  });
}
for (const ua of ['Googlebot', '', undefined, 'HeadlessChrome', 'FacebookExternalHit']) {
  test(`crawler or missing UA: ${ua}`, () => {
    assert.equal(chooseLang({ acceptLanguage: 'en-US', country: 'US', cookie: 'autom8-lang=en', userAgent: ua }), 'es');
  });
}
test('root-only matcher', () => assert.deepEqual(config.matcher, ['/']));
test('English redirect preserves query and disables caching', () => {
  const response = middleware(new Request('https://autom8.es/?utm_source=x', { headers: { 'accept-language': 'en-US', 'user-agent': userAgent } }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), 'https://autom8.es/en?utm_source=x');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('vary'), 'Accept-Language, Cookie');
});
test('Spanish continues to static page', () => {
  const response = middleware(new Request('https://autom8.es/', { headers: { 'accept-language': 'es-ES', 'user-agent': userAgent } }));
  assert.equal(response.headers.get('x-middleware-next'), '1');
});
