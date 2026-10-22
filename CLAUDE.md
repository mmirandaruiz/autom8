# Autom8 — web (contexto para Claude Code)

Web de una sola página para **Autom8**. **Producto actual: diseño y creación de páginas web a medida para empresas**, hechas para el cliente y entregadas publicadas. No mencionar IA en la web. Todo el contenido está en **español (España)**.

La versión anterior, centrada en automatización de procesos (historia 3D de papeles, calculadora, página `/automatizacion-de-procesos`), está guardada en la rama `backup/automatizacion` y la etiqueta `v1-automatizacion`. La sección "Más que una web" (`#conectada`) es el puente para volver a ofrecer automatización más adelante.

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
- Páginas de servicio para SEO (una por búsqueda objetivo; ahora mismo ninguna en `main`). Cada una con title/H1 propio, JSON-LD (Service, BreadcrumbList, FAQPage), enlace desde el inicio y entrada en `sitemap.xml`. Enlazar con URL limpia (sin `.html`). `vercel.json` redirige temporalmente `/automatizacion-de-procesos` al inicio.
- El titular es autónomo (no hay sociedad): el aviso legal necesita nombre completo, NIF y domicilio.
- Sitio estático: se despliega en Vercel sin build (Framework preset: Other). Vista previa local: `python3 -m http.server 4173`.

## Formulario de contacto
- Envía a **marcos@autom8.es** vía Web3Forms (`fetch` a `https://api.web3forms.com/submit`).
- La Access Key ya está en `WEB3FORMS_KEY` (`index.html`). Es pública por diseño en Web3Forms; no sustituirla por el marcador.
- Antispam: campo `botcheck` oculto con la clase `.hp` (no usar `display:none`).
- Solo 3 campos: nombre, email, descripción. No añadir más campos.

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

## Hero 3D (una ventana de navegador que monta una web)
- `#stage` con `<canvas id="gl">` dentro del hero (no es fijo ni ocupa toda la página). Three.js r128.
- Una sola ventana de navegador flotante (`site`, 12×8 unidades), inclinada, con barra superior, tres puntos y barra de dirección (`fixed`, visibles desde el inicio).
- Piezas con volumen y bordes biselados (`piece(rol, izquierda, arriba, ancho, alto, superficie, fondo, radio)`; `superficie` es la cara sobre la que se apoya: `F` ventana, `C` tarjeta): menú, titulares, botón lima (`cta`), imagen genérica abstracta pintada en código (`imageTex()`: degradado lima-lavanda con ondas, sin fotos ni imágenes externas) y tres tarjetas blancas.
- Bucle: `build()` (vuelan y encajan) → 5 s quietas → `scatter()` → vuelta a empezar. El botón lima se ilumina al encajar y cada pieza que llega empuja la página, que se hunde, se inclina hacia el impacto y rebota con un muelle (`kick()` / `spring()`).
- Detrás: brillo lima y lavanda, puntos desenfocados (`bokeh`) y sombra o reflejo debajo. Cámara con acercamiento y órbita lentos; el ratón y el scroll inclinan la escena.
- Colores por tema en `paint()`. Solo renderiza con el hero en pantalla. `prefers-reduced-motion`: montaje instantáneo y sin bucle. Sin WebGL, `.nogl` oculta el escenario.
- No mostrar texto legible dentro del 3D: titulares y textos son barras.

## Inicio
- Titular: "Creamos la web de tu empresa." Texto a la izquierda y 3D a la derecha (en móvil, 3D arriba).
- Secciones: problema → qué incluye → tipos de web → cómo trabajamos → más que una web → preguntas → contacto.

## Reglas a respetar
- Accesibilidad WCAG 2.1 AA: texto ≥ 4.5:1, bordes de campos ≥ 3:1, foco visible, `prefers-reduced-motion`, enlace "Saltar al contenido".
- Tiene que funcionar en móvil (3D arriba, texto debajo). Probar al menos 320×568, 375×667, 390×844, 430×932 y horizontal 667×375 / 844×390: sin scroll lateral y ningún texto tapado por la cabecera o la barra de progreso.
- Campos de formulario con texto ≥ 16px (si no, iOS hace zoom) y zonas táctiles ≥ 44px.
- No inventar cifras ni testimonios; usar marcadores tipo [LOGO CLIENTE].
