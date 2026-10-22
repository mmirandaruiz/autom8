# Autom8 — web (contexto para Claude Code)

Web de una sola página para **Autom8**, consultoría de eficiencia operativa: detectamos procesos lentos, manuales o con errores y los resolvemos con automatización, integraciones, desarrollo a medida e IA *solo donde tiene sentido*. También diseñamos y creamos páginas web, siempre conectadas a las herramientas del cliente (CRM, ERP, reservas): sección `#web` del inicio y página `/diseno-web`. Todo el contenido está en **español (España)**.

## Estructura
- `index.html` — todo el sitio (HTML + CSS + JS en un archivo).
- `vendor/three.min.js` — Three.js r128 alojado en el propio sitio (no usar CDN).
- `fonts/` — Bricolage Grotesque e Instrument Sans en woff2, cargadas con `@font-face` y `preload` (no usar Google Fonts: privacidad/RGPD y rendimiento).
- `aviso-legal.html`, `privacidad.html`, `cookies.html` — páginas legales enlazadas desde el pie.
- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`.
- `robots.txt`, `sitemap.xml`; metadatos SEO, Open Graph y JSON-LD en el `<head>` de `index.html`.
- `vercel.json` — `cleanUrls` y cabeceras de seguridad/caché, incluida una Content-Security-Policy. **Si se añade un servicio externo (script, fuente, API, iframe), hay que añadir su dominio a la CSP** o el navegador lo bloqueará.
- URLs limpias: canonical, sitemap y `og:url` usan `/aviso-legal`, `/privacidad`, `/cookies` (sin `.html`).
- `og-image.png` (1200×630) — imagen para compartir en redes; si cambia el titular, regenerarla.
- `404.html` — página de error que Vercel sirve automáticamente.
- Páginas de servicio para SEO (una por búsqueda objetivo): `automatizacion-de-procesos.html`, `diseno-web.html`. Cada una con title/H1 propio, JSON-LD (Service, BreadcrumbList, FAQPage), enlace desde el inicio y entrada en `sitemap.xml`. Enlazar con URL limpia (`/automatizacion-de-procesos`).
- El titular es autónomo (no hay sociedad): el aviso legal necesita nombre completo, NIF y domicilio.
- Sitio estático: se despliega en Vercel sin build (Framework preset: Other). Vista previa local: `python3 -m http.server 4173`.

## Formulario de contacto
- Envía a **marcos@autom8.es** vía Web3Forms (`fetch` a `https://api.web3forms.com/submit`).
- La Access Key ya está en `WEB3FORMS_KEY` (`index.html`). Es pública por diseño en Web3Forms; no sustituirla por el marcador.
- Antispam: campo `botcheck` oculto con la clase `.hp` (no usar `display:none`).
- Solo 3 campos: nombre, email, descripción. No añadir más campos.
- El formulario de la calculadora envía el email + el resultado calculado.

## Marca y paleta
| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| Lima (fill) | #D4F57A | #D4F57A | botones, bloques 3D, highlights |
| Lavanda / señal | #9B8CFF | #5B4BD6 | problemas, detección |
| Fondo | #07090C | #F4F6F9 | |
| Texto | #F5F7FA | #0B0F14 | |
| Secundario | #AEB8C4 | #4F5A68 | |
- Regla en modo claro: **el lima nunca es texto**. Se usa como relleno, subrayado, punto o "rotulador" detrás (logo y números de paso). El texto va en negro.
- Botones primarios: lima con texto oscuro (modo oscuro) / negro con texto lima (modo claro).
- Logo: texto "Autom8" en Bricolage Grotesque 800; el 8 mitad lima arriba (oscuro) o con rotulador lima (claro). Sin icono.
- Tipografías: Bricolage Grotesque (titulares) + Instrument Sans (texto).
- Tema: oscuro por defecto, botón sol/luna en el menú, se guarda en `localStorage('autom8-theme')`.

## La historia 3D (scroll)
Un único `InstancedMesh` de 720 bloques redondeados que cambia entre estados según el scroll:
- `0` caos: papeles blancos (con líneas de texto sutiles), ~1/20 papeles lima, cubos lavanda que crecen con `heat`.
- `2` detectar: maqueta en cuadrícula con focos lavanda (cuellos de botella).
- `3` ordenar: maqueta plana con carriles lima.
- `4` circuito en forma de 8 con paquetes de datos (paso final "Autom8").
- `5` barras de crecimiento (medir).
- Las secciones `.pin` (`story`, `method`, `final`) tienen un objeto de keyframes en `PINS` con: `p` progreso, `st` estado, `cp/cl` cámara, `sh` desplazamiento horizontal del encuadre, `heat`, `g` brillo lima, `h` brillo lavanda.
- Textos de la historia: `data-beat="inicio,fin"` (progreso 0–1). Barra de progreso: `data-hud`.
- El tema se aplica al 3D en `TH` / `applyTheme()`; en claro cada escena tiene su exposición (`ex`).
- Fuera de los pins el canvas se oculta y no renderiza (rendimiento).

## Inicio
- La primera pantalla solo lleva el titular "Automatizamos los procesos de tu empresa." y "Desliza para ordenar el caos". Sin más texto: los papeles son el protagonista.

## Reglas a respetar
- Accesibilidad WCAG 2.1 AA: texto ≥ 4.5:1, bordes de campos ≥ 3:1, foco visible, `prefers-reduced-motion`, enlace "Saltar al contenido".
- Los textos sobre el 3D llevan un velo (`.scrim`) detrás; si se mueve un texto, comprobar el contraste.
- Tiene que funcionar en móvil (texto abajo, 3D arriba, tarjeta del método a todo el ancho). Probar al menos 320×568, 375×667, 390×844, 430×932 y horizontal 667×375 / 844×390: sin scroll lateral y ningún texto tapado por la cabecera o la barra de progreso.
- Campos de formulario con texto ≥ 16px (si no, iOS hace zoom) y zonas táctiles ≥ 44px.
- No inventar cifras ni testimonios; usar marcadores tipo [LOGO CLIENTE].
- En la animación inicial no usar ejemplos concretos (facturas, etc.); esos van en la sección "Qué automatizamos".
