/* ===== Consentimiento de cookies (LSSI-CE art. 22.2, RGPD y Guía de cookies de la AEPD, 2023) =====
   Nada que instale cookies no necesarias se carga antes de que el visitante acepte: las
   etiquetas de Google (Ads y Analytics) y el píxel de Meta solo se insertan después.
   El banner solo aparece si hay algún servicio configurado aquí abajo. «Rechazar» está al
   mismo nivel que «Aceptar», se puede configurar por categorías y cambiar de opinión en
   cualquier momento (botón «Configurar cookies» del pie). La elección se guarda en
   localStorage (no es una cookie), caduca a los 13 meses y se vuelve a pedir si cambian
   los servicios. Al retirar el consentimiento se borran sus cookies y se recarga la página.
   Al añadir un servicio, sus dominios ya están en la CSP de vercel.json. */
(function(){
  var CONFIG = {
    googleAds: '',      // ID de Google Ads, p. ej. 'AW-123456789'
    googleAdsLead: '',  // etiqueta de la conversión «formulario enviado», p. ej. 'AbC-D_efG-h12_34-567'
    ga4: '',            // Google Analytics 4, p. ej. 'G-ABC123DEF4'
    metaPixel: ''       // píxel de Meta, p. ej. '123456789012345'
  };

  var KEY = 'autom8-consent', VERSION = 1, MAX_AGE = 395 * 24 * 3600 * 1000;
  var ADS = /^AW-\d{6,14}$/, LABEL = /^[A-Za-z0-9_-]{4,40}$/, GA4 = /^G-[A-Z0-9]{4,14}$/, PIXEL = /^\d{6,20}$/;
  var ads = ADS.test(CONFIG.googleAds) ? CONFIG.googleAds : '';
  var lead = ads && LABEL.test(CONFIG.googleAdsLead) ? CONFIG.googleAdsLead : '';
  var ga4 = GA4.test(CONFIG.ga4) ? CONFIG.ga4 : '';
  var pixel = PIXEL.test(CONFIG.metaPixel) ? CONFIG.metaPixel : '';

  var SERVICES = [];
  if (ga4) SERVICES.push({cat:'analytics', name:'Google Analytics', provider:'Google Ireland Ltd.', policy:'https://policies.google.com/technologies/cookies?hl=es',
    rows:[['_ga','Distingue visitantes de forma anónima','2 años'],['_ga_<ID>','Mantiene el estado de la sesión','2 años']]});
  if (ads) SERVICES.push({cat:'marketing', name:'Google Ads', provider:'Google Ireland Ltd.', policy:'https://policies.google.com/technologies/cookies?hl=es',
    rows:[['_gcl_au, _gcl_aw','Mide qué anuncios de Google acaban en una solicitud de contacto','3 meses']]});
  if (pixel) SERVICES.push({cat:'marketing', name:'Píxel de Meta', provider:'Meta Platforms Ireland Ltd.', policy:'https://www.facebook.com/policies/cookies/',
    rows:[['_fbp, _fbc','Mide la eficacia de los anuncios en Facebook e Instagram','3 meses']]});

  var CATS = {
    analytics:{label:'Analítica', text:'Nos ayudan a saber cuántas personas visitan la web y qué páginas consultan, de forma agregada.'},
    marketing:{label:'Publicidad', text:'Permiten medir nuestras campañas en Google, Facebook e Instagram y saber qué anuncios funcionan.'}
  };
  var cats = [];
  SERVICES.forEach(function(s){ if (cats.indexOf(s.cat) < 0) cats.push(s.cat); });
  cats.sort(function(a,b){ return a === 'analytics' ? -1 : b === 'analytics' ? 1 : 0; });
  var SIG = [ads, lead, ga4, pixel].join('|');

  function read(){
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.v === VERSION && c.sig === SIG && Date.now() - c.at < MAX_AGE) return c;
    } catch(e) {}
    return null;
  }
  function write(choice){
    var c = {v:VERSION, sig:SIG, at:Date.now(), analytics:!!choice.analytics, marketing:!!choice.marketing};
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch(e) {}
    return c;
  }

  /* ----- Carga de etiquetas, solo con consentimiento ----- */
  var loaded = {gtag:false, meta:false}, configured = [], state = {analytics:false, marketing:false};
  function addScript(src){ var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }
  function load(c){
    state = {analytics:!!c.analytics, marketing:!!c.marketing};
    var g = [];
    if (state.analytics && ga4) g.push(ga4);
    if (state.marketing && ads) g.push(ads);
    if (g.length){
      var m = state.marketing ? 'granted' : 'denied';
      var signals = {analytics_storage: state.analytics ? 'granted' : 'denied', ad_storage:m, ad_user_data:m, ad_personalization:m};
      if (!loaded.gtag){
        loaded.gtag = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){ window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', signals);
        window.gtag('js', new Date());
        addScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(g[0]));
      } else window.gtag('consent', 'update', signals);
      g.forEach(function(id){ if (configured.indexOf(id) < 0){ configured.push(id); window.gtag('config', id); } });
    }
    if (state.marketing && pixel && !loaded.meta){
      loaded.meta = true;
      var f = window.fbq = function(){ f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
      if (!window._fbq) window._fbq = f;
      f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
      f('init', pixel); f('track', 'PageView');
      addScript('https://connect.facebook.net/en_US/fbevents.js');
    }
  }
  function clearCookies(){
    var names = document.cookie.split(';').map(function(p){ return p.split('=')[0].trim(); })
      .filter(function(n){ return /^(_ga|_gid|_gcl_|_fbp|_fbc)/.test(n); });
    var host = location.hostname, domains = ['', host, '.' + host.replace(/^www\./, '')];
    names.forEach(function(n){ domains.forEach(function(d){
      document.cookie = n + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
    }); });
  }

  /* Conversión de contacto: el formulario llama a autom8Track('lead') al enviarse bien. */
  window.autom8Track = function(ev){
    if (ev !== 'lead') return;
    if (state.marketing && loaded.gtag && lead) window.gtag('event', 'conversion', {send_to: ads + '/' + lead});
    if (state.analytics && loaded.gtag && ga4) window.gtag('event', 'generate_lead');
    if (state.marketing && loaded.meta) window.fbq('track', 'Lead');
  };

  /* ----- Banner y panel ----- */
  var CSS = '.ck{--ck-bg:#0F1318;--ck-line:#2E3845;--ck-text:#F5F7FA;--ck-soft:#D5DCE4;--ck-lime:#D4F57A;--ck-btn:#D4F57A;--ck-btn-text:#0B0F05;--ck-focus:#D4F57A;'
    + 'position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;max-width:560px;margin-left:auto;max-height:calc(100vh - 32px);overflow:auto;'
    + 'background:var(--ck-bg);color:var(--ck-text);border:1px solid var(--ck-line);border-radius:18px;padding:22px;box-shadow:0 18px 50px rgba(0,0,0,.45);'
    + 'font-family:"Instrument Sans","Helvetica Neue",Arial,sans-serif;font-size:16px;line-height:1.5}'
    + ':root[data-theme="light"] .ck{--ck-bg:#FFFFFF;--ck-line:#C9D1DB;--ck-text:#0B0F14;--ck-soft:#4F5A68;--ck-lime:#0B0F14;--ck-btn:#0B0F14;--ck-btn-text:#D4F57A;--ck-focus:#0B0F14;box-shadow:0 18px 50px rgba(11,15,20,.18)}'
    + '.ck h2{font-family:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;font-weight:800;letter-spacing:-.03em;font-size:22px;line-height:1.1;margin:0 0 8px}'
    + '.ck p{margin:0;color:var(--ck-soft)}.ck a{color:var(--ck-lime)}'
    + '.ck-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}'
    + '.ck button{font:inherit;font-weight:600;min-height:44px;padding:0 20px;border-radius:999px;cursor:pointer;border:1px solid var(--ck-btn);background:var(--ck-btn);color:var(--ck-btn-text)}'
    + '.ck button.ck-link{background:transparent;border-color:transparent;color:var(--ck-text);text-decoration:underline;text-underline-offset:3px;padding:0 8px}'
    + '.ck button:focus-visible,.ck input:focus-visible,.ck a:focus-visible{outline:3px solid var(--ck-focus);outline-offset:3px}'
    + '.ck-cats{display:grid;gap:12px;margin-top:16px}'
    + '.ck-cat{border:1px solid var(--ck-line);border-radius:12px;padding:12px 14px}'
    + '.ck-cat label{display:flex;align-items:center;justify-content:space-between;gap:12px;font-weight:600;min-height:44px;cursor:pointer}'
    + '.ck-cat input{width:22px;height:22px;accent-color:var(--ck-btn);flex:0 0 auto}'
    + '.ck-cat p{font-size:15px}'
    + '@media (max-width:560px){.ck{left:8px;right:8px;bottom:8px;padding:18px}.ck-row button{flex:1 1 auto}}'
    + '[data-cookie-settings]{font:inherit;color:inherit;background:none;border:0;padding:0;min-height:44px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}';

  var box = null, opener = null;
  function el(tag, attrs, text){
    var n = document.createElement(tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }
  function button(text, onClick, cls){
    var b = el('button', cls ? {type:'button', 'class':cls} : {type:'button'}, text);
    b.addEventListener('click', onClick);
    return b;
  }
  function close(){
    if (!box) return;
    box.remove(); box = null;
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  }
  function decide(choice){
    var before = read();
    var c = write(choice);
    close();
    var revoked = before && ((before.analytics && !c.analytics) || (before.marketing && !c.marketing));
    if (revoked) {
      clearCookies();
      if (loaded.gtag || loaded.meta) { location.reload(); return; }
    }
    load(c);
  }
  function all(v){ var o = {}; cats.forEach(function(k){ o[k] = v; }); return o; }
  function who(){
    var names = [];
    SERVICES.forEach(function(s){ var p = s.provider.split(' ')[0]; if (names.indexOf(p) < 0) names.push(p); });
    return names.join(' y ');
  }
  function show(panel){
    close();
    css();
    var saved = read();
    box = el('div', {'class':'ck', role:'dialog', 'aria-modal':'false', 'aria-labelledby':'ck-t', 'aria-describedby':'ck-d'});
    box.appendChild(el('h2', {id:'ck-t'}, panel ? 'Configurar cookies' : 'Cookies'));
    var p = el('p', {id:'ck-d'});
    var uses = cats.map(function(k){ return k === 'analytics' ? 'analizar las visitas' : 'medir nuestras campañas de publicidad'; }).join(' y ');
    p.appendChild(document.createTextNode('Usamos cookies de terceros (' + who() + ') para ' + uses + '. Solo se activan si aceptas, y puedes cambiar de opinión cuando quieras. '));
    var more = el('a', {href:'/cookies'}, 'Más información');
    p.appendChild(more); p.appendChild(document.createTextNode('.'));
    box.appendChild(p);
    var row = el('div', {'class':'ck-row'});
    if (panel) {
      var list = el('div', {'class':'ck-cats'}), boxes = {};
      cats.forEach(function(k){
        var c = el('div', {'class':'ck-cat'}), lab = el('label', {}, CATS[k].label);
        var input = el('input', {type:'checkbox', name:k});
        input.checked = !!(saved && saved[k]);
        boxes[k] = input; lab.appendChild(input); c.appendChild(lab); c.appendChild(el('p', {}, CATS[k].text));
        list.appendChild(c);
      });
      var nec = el('div', {'class':'ck-cat'});
      nec.appendChild(el('p', {}, 'Técnicas (siempre activas): guardan tu tema claro u oscuro y esta elección en tu navegador. No son cookies ni se envían a ningún servidor.'));
      list.appendChild(nec);
      box.appendChild(list);
      row.appendChild(button('Guardar mi elección', function(){ var o = {}; cats.forEach(function(k){ o[k] = boxes[k].checked; }); decide(o); }));
      row.appendChild(button('Rechazar todo', function(){ decide(all(false)); }));
      row.appendChild(button('Aceptar todo', function(){ decide(all(true)); }));
    } else {
      row.appendChild(button('Rechazar', function(){ decide(all(false)); }));
      row.appendChild(button('Aceptar', function(){ decide(all(true)); }));
      row.appendChild(button('Configurar', function(){ opener = null; show(true); box.querySelector('input').focus(); }, 'ck-link'));
    }
    box.appendChild(row);
    box.addEventListener('keydown', function(e){ if (e.key === 'Escape' && read()) close(); });
    document.body.appendChild(box);
  }

  /* Tabla de la política de cookies (/cookies): sigue a los servicios configurados. */
  function policy(){
    var host = document.getElementById('cookie-policy');
    if (!host) return;
    host.textContent = '';
    if (!SERVICES.length) {
      host.appendChild(el('p', {}, 'Ahora mismo no usamos ninguna cookie de analítica ni de publicidad, por eso no verás ningún aviso de cookies.'));
      return;
    }
    host.appendChild(el('p', {}, 'Estas cookies solo se instalan si las aceptas en el aviso de cookies, y puedes retirar el consentimiento en cualquier momento con el botón «Configurar cookies».'));
    var t = el('table', {}), head = el('tr', {});
    ['Cookie', 'Servicio y titular', 'Finalidad', 'Duración', 'Tipo'].forEach(function(h){ head.appendChild(el('th', {scope:'col'}, h)); });
    var th = el('thead', {}); th.appendChild(head); t.appendChild(th);
    var tb = el('tbody', {});
    SERVICES.forEach(function(s){ s.rows.forEach(function(r){
      var tr = el('tr', {});
      tr.appendChild(el('td', {}, r[0]));
      var td = el('td', {}, s.name + ' (' + s.provider + ') · '); td.appendChild(el('a', {href:s.policy, rel:'noopener'}, 'su política')); tr.appendChild(td);
      tr.appendChild(el('td', {}, r[1])); tr.appendChild(el('td', {}, r[2])); tr.appendChild(el('td', {}, CATS[s.cat].label));
      tb.appendChild(tr);
    }); });
    t.appendChild(tb);
    var wrap = el('div', {'class':'table'}); wrap.appendChild(t);
    host.appendChild(wrap);
  }

  function css(){
    if (document.getElementById('ck-css')) return;
    var st = el('style', {id:'ck-css'}); st.textContent = CSS; document.head.appendChild(st);
  }
  function init(){
    policy();
    if (SERVICES.length) css();
    var links = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < links.length; i++) {
      if (!SERVICES.length) continue;
      links[i].hidden = false;
      links[i].addEventListener('click', function(){ opener = this; show(true); box.querySelector('input').focus(); });
    }
    if (!SERVICES.length) return;
    var c = read();
    if (c) load(c); else show(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
