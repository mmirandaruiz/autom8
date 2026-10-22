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
- Regla en modo claro: **el lima nunca es texto**. Barras y líneas de progreso usan `--meter` sobre `--track` (lima/oscuro en modo oscuro; negro sobre #DDE3EA en claro, ≥3:1). En los dibujos, el lima en modo claro siempre lleva contorno negro; nada de tintes `--lime-rgb` (en claro es verde oliva y ensucia). Se usa como relleno, subrayado, punto o "rotulador" detrás (logo y números de paso). El texto va en negro.
- Botones primarios: lima con texto oscuro (modo oscuro) / negro con texto lima (modo claro).
- Logo: texto "Autom8" en Bricolage Grotesque 800; el 8 mitad lima arriba (oscuro) o con rotulador lima (claro). Sin icono.
- Tipografías: Bricolage Grotesque (titulares) + Instrument Sans (texto).
- Tema: oscuro por defecto, botón sol/luna en el menú, se guarda en `localStorage('autom8-theme')`.

## Hero 3D (una ventana de navegador que se monta con el scroll)
- El hero es a pantalla completa y queda fijo (`.hero` 320vh con `.stick` sticky). El canvas `#gl` ocupa todo el fondo; el texto va encima a la izquierda con un velo (`.veil`). En móvil: ventana arriba y texto abajo; móvil en horizontal: lado a lado. `resize()` mide el hueco libre (a la derecha del texto, o entre la cabecera y el texto en móvil) y encaja la ventana dentro con margen para el rebote (`region()`, `bounds()`, `setViewOffset`). Las piezas llegan desde el lado contrario al texto.
- Una ventana de navegador flotante (`site`, 12×8) con volumen: marco, barra, tres puntos y barra de dirección (`fixed`, visibles desde el inicio). La barra de dirección se llena de lima (`load`) según se completa la web.
- Piezas con relieve y bordes biselados (`piece(rol, izquierda, arriba, ancho, alto, superficie, fondo, radio)`; `superficie`: `F` ventana, `C` tarjeta): menú, titulares, botón lima (`cta`), panel de cristal (`MAT.glass`, MeshPhysicalMaterial translúcido con reflejos de un entorno propio `envTex`, color interior `glassTex()` y bordes de luz) en lugar de foto y tres tarjetas.
- **La web se monta mientras se lee**: el canvas `#gl` es una capa fija de toda la página. Casi la mitad de las piezas encajan en el hero (240vh) y el resto a lo largo de las secciones (`pageP()`), hasta terminar al llegar a `#contacto`. Al salir del hero, el contenido de cada sección se alterna a izquierda y derecha (clases `side-l`/`side-r`, 60% del ancho) y la ventana se desplaza al lado libre (`sideRegion()`, mezcla `hf` con `lf`/`rf` según `dock` y `side`), girada hacia el texto. El cambio de lado va ligado al scroll: cruza por la franja vacía entre dos secciones (`seam`), encogiéndose un poco (`cross`); brillos y puntos se apagan. La ventana se hace más pequeña (≤30% del ancho) y siempre queda visible por encima del contenido (`#gl` z-index 3, secciones z-index 2). En móvil (≤600px) el texto ocupa todo el ancho y la ventana se queda pequeña abajo a la derecha (no cambia de lado), con una pastilla de progreso encima (`#mini`). Cerca de `#contacto` la capa se desvanece y deja de renderizar. Al subir, las piezas se van.
- Raíl de progreso (`#rail`, HTML encima del canvas): con la ventana acoplada, una línea arriba y otra abajo que se rellenan de lima, con una caja arriba (% de la web) y otra abajo (piezas colocadas). Sigue a la ventana proyectando su caja en pantalla (`railUpdate()`); se oculta en el cruce de lado, en móvil (≤600px) y sin WebGL.
- Partículas (`dust`, `THREE.Points` en `site`): orbitan alrededor de la ventana y van apareciendo más según avanza la web (`setDrawRange` con el progreso). Cada pieza que encaja suelta chispas (`burst()`).
- Cada pieza que encaja golpea la página: retroceso con muelle (`kick()` / `spring()`: se hunde, baja, se inclina hacia el impacto y se aplasta) y una onda lima (`ripple()`). El botón lima se ilumina al encajar y luego respira.
- Vida: flotación, brillos que laten, puntos desenfocados (`bokeh`), cámara que se acerca con el scroll y órbita lenta; la ventana gira hacia el usuario al completarse.
- Sin JS, sin WebGL (`.nogl`) o con `prefers-reduced-motion`: el hero no queda fijo y la web aparece montada.
- No mostrar texto legible dentro del 3D: titulares y textos son barras.

## Inicio
- Titular: "Creamos la web de tu empresa." sobre el 3D a pantalla completa (en móvil, 3D arriba y texto abajo).
- Secciones: problema → qué incluye → tipos de web → cómo trabajamos → más que una web → preguntas → contacto.

## Contenido de las secciones
- Qué incluye: tarjetas tipo bento (`.bento`), cada una con un pequeño dibujo CSS (`.viz`: web, dispositivos, carga segura, resultado de Google, puesta en marcha, legal) que se anima al aparecer.
- Tipos de web: cada tarjeta muestra un esquema de esa web (`.wire`: corporativa, landing, antes/después).
- Cómo trabajamos: línea de tiempo vertical (`.steps.tl`) que se rellena de lima con el scroll (`--p`) y enciende cada paso (`.lit`).
- Los dibujos son decorativos (`aria-hidden`) y no muestran cifras inventadas.

## Reglas a respetar
- Accesibilidad WCAG 2.1 AA: texto ≥ 4.5:1, bordes de campos ≥ 3:1, foco visible, `prefers-reduced-motion`, enlace "Saltar al contenido".
- Tiene que funcionar en móvil (3D arriba, texto debajo). Probar al menos 320×568, 375×667, 390×844, 430×932 y horizontal 667×375 / 844×390: sin scroll lateral y ningún texto tapado por la cabecera o la barra de progreso.
- Campos de formulario con texto ≥ 16px (si no, iOS hace zoom) y zonas táctiles ≥ 44px.
- No inventar cifras ni testimonios; usar marcadores tipo [LOGO CLIENTE].
