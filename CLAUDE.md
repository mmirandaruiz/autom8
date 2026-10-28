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
- `consent.js` — aviso de cookies de todas las páginas. Los IDs de Google Ads (y su etiqueta de conversión), GA4 y el píxel de Meta van en `CONFIG` al principio del archivo; sin IDs no aparece ningún aviso. Nada de terceros se carga antes de aceptar. El formulario llama a `autom8Track('lead')` al enviarse. La tabla de `/cookies` sale de los servicios configurados.
- `vercel.json` — `cleanUrls` y cabeceras de seguridad/caché, incluida una Content-Security-Policy. **Si se añade un servicio externo (script, fuente, API, iframe), hay que añadir su dominio a la CSP** o el navegador lo bloqueará.
- URLs limpias: canonical, sitemap y `og:url` usan `/aviso-legal`, `/privacidad`, `/cookies` (sin `.html`).
- `og-image.png` (1200×630) — imagen para compartir en redes; si cambia el titular, regenerarla.
- `404.html` — página de error que Vercel sirve automáticamente.
- Páginas de servicio para SEO (una por búsqueda objetivo): `precios.html` («cuánto cuesta una página web»; los planes salen literalmente de la oferta, sin inventar precios ni condiciones) y `diseno-web-barcelona.html` («diseño web barcelona»). Comparten el mismo CSS en línea, solo modo oscuro. Cada una con title/H1 propio, JSON-LD (Service, BreadcrumbList, FAQPage), enlace desde el inicio y entrada en `sitemap.xml`. Enlazar con URL limpia (sin `.html`). `vercel.json` redirige temporalmente `/automatizacion-de-procesos` al inicio.
- El titular es autónomo (no hay sociedad): el aviso legal necesita nombre completo, NIF y domicilio.
- Sitio estático: se despliega en Vercel sin build (Framework preset: Other). Vista previa local: `python3 -m http.server 4173`.

## Formulario de contacto
- Envía a **marcos@autom8.es** vía Web3Forms (`fetch` a `https://api.web3forms.com/submit`).
- La Access Key ya está en `WEB3FORMS_KEY` (`index.html`). Es pública por diseño en Web3Forms; no sustituirla por el marcador.
- Antispam: campo `botcheck` oculto con la clase `.hp` (no usar `display:none`).
- Solo 3 campos: nombre, email, descripción. No añadir más campos.

## Demo gratis
- La sección `#tu-web` («Gratis · en 10 minutos», titular «Pide tu demo en segundos.» y «Totalmente gratis y sin compromiso.»), justo después del hero, explica la demo y tiene el botón grande «Pide tu demo gratis →» a `https://demo.autom8.es/demo/` (repo `autom8-sites`).
- La ventana WebGL se transforma en la escena CSS `#tw-escena` mediante un único progreso de scroll `window.autom8Hand` (0–1, unas 1,2 alturas de pantalla al entrar `#tu-web`), expuesto como `--hand`. Anticipación con inclinación, brillo y barrido lima; separación escalonada con giros, estelas y polvo; convergencia al rectángulo medido de `.tw-form`, desproyectado a profundidad fija cada frame; onda, flash y halo al aterrizar. Todo se recorre al revés al subir. En móvil se reducen las distancias y se mide la misma tarjeta. Las tarjetas entran desde profundidad (formulario primero, luego correo y web); el bucle solo arranca al terminar el aterrizaje y se pausa fuera de pantalla. Sin WebGL o con movimiento reducido se usa un fundido sencillo; con movimiento reducido queda el momento 3 estático. Más abajo el canvas queda oculto y no renderiza. El bucle muestra:
  1. el formulario se rellena solo y el cursor pulsa «Pide tu demo gratis»;
  2. una bandeja de correo realista (`.tw-mail`), con barra superior de búsqueda y avatar, barra lateral y lista: se selecciona la fila sin leer de Autom8 «Confirma tu demo gratis de tuempresa.es», se abre el mensaje y el cursor pulsa «Confirmar mi demo»;
  3. se monta la web nueva con «Tu demo está lista ✓» y un reloj hasta 10:00.

  El cursor (`.tw-cursor`) es un SVG de mano señalando y se hunde (`scale: .84`) mientras algún botón tiene la clase `.press`. Los pasos de la lista se iluminan con la escena y, al pulsarlos, la llevan a ese momento. Con `prefers-reduced-motion`, se queda quieta en el momento 3.
- La sección no es `side-l`/`side-r`. El encuadre de transición conserva `sideRegion()`; las secciones posteriores usan el canvas compartido `#gl2`.
- El botón principal del hero, «Pide tu demo gratis ↓», baja a esa sección con scroll suave (`scroll-behavior: smooth`, salvo con `prefers-reduced-motion`). «Pedir presupuesto» queda como segundo botón.
- También enlazan a `/demo/`: la tarjeta «Rediseño», la pregunta «Ya tengo web, ¿podéis renovarla?», la sección de contacto y, en `/precios`, debajo de las webs de ejemplo y en el bloque final.
- `demo.autom8.es/demo/` usa el mismo diseño que este sitio (fuentes, colores, cabecera). Si cambia la marca aquí, hay que cambiarla también allí.
- Es solo un enlace a propósito: el formulario, su antibots (Cloudflare Turnstile) y sus datos viven en `demo.autom8.es`. Así esta web no cambia su CSP ni recibe datos de esas solicitudes. No incrustar ese formulario aquí.

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
- **La web se monta mientras se lee**: el canvas `#gl` es fijo y el montaje se completa durante el hero. Conserva el encuadre de transición hacia la demo y `sideRegion()`. No vuelve junto a las secciones posteriores; al subir reaparece.
- `handoff(t)` sustituye el antiguo despiece: rutas deterministas para `fixed`, `pieces` y `load`, estelas en un buffer reutilizado, vectores reutilizados para desproyección y cámara con un pequeño dolly. El progreso compartido lo publica `mezcla()` (script «tw»); `--form`, `--mail`, `--web` y `--bloom` sincronizan las tarjetas y el halo. No hay despiece con movimiento reducido.
- Partículas (`dust`, `THREE.Points` en `site`): orbitan alrededor de la ventana y van apareciendo más según avanza la web (`setDrawRange` con el progreso). Cada pieza que encaja suelta chispas (`burst()`).
- Cada pieza que encaja golpea la página: retroceso con muelle (`kick()` / `spring()`: se hunde, baja, se inclina hacia el impacto y se aplasta) y una onda lima (`ripple()`). El botón lima se ilumina al encajar y luego respira.
- Vida: flotación, brillos que laten, puntos desenfocados (`bokeh`), cámara que se acerca con el scroll y órbita lenta; la ventana gira hacia el usuario al completarse.
- Sin JS, sin WebGL (`.nogl`) o con `prefers-reduced-motion`: el hero no queda fijo y la web aparece montada.
- No mostrar texto legible dentro del 3D: titulares y textos son barras.

## Inicio
- Titular: "Creamos la web de tu empresa." sobre el 3D a pantalla completa (en móvil, 3D arriba y texto abajo).
- Secciones: problema → qué incluye → tipos de web → cómo trabajamos → más que una web → preguntas → contacto.

## Contenido de las secciones
- Seis escenas Three.js decorativas en un solo canvas fijo `#gl2` (`aria-hidden`, sin eventos de puntero), situado sobre los fondos y bajo el texto. Un segundo WebGLRenderer comparte geometrías biseladas `rbox()` y materiales del hero; el cristal clona `MAT.glass` y genera el mismo entorno en su propio contexto WebGL. Cada `.esc3d` conserva su espacio y tiene Scene, PerspectiveCamera y `update(t, progress, scroll)` propios. `setViewport` / `setScissor` recortan cada vista a su rectángulo, sin invadir el texto. DPR máximo 1,5 en móvil y 2 en escritorio.
- `#problema`: ventana antigua desaturada, bloques desplazados, cristal roto en cuatro fragmentos, carga atascada y teléfono con contenido desbordado. `#incluye`: cinco placas de cristal con etiquetas Diseño, Móvil, Google, Velocidad y Formularios que se unen con impacto, onda y partículas. `#webs`: tres ventanas en abanico, corporativa con páginas detrás, landing con CTA lima y polvo. `#proceso`: cuatro pilares numerados, esfera luminosa que sube y pequeña web que se monta arriba. `#conectada`: ventana central con cuatro conexiones curvas y pulsos hacia WhatsApp, Calendario, Email y CRM (glifos propios, sin logos). `#faq`: burbujas de cristal a distintas profundidades, escritura, nueva respuesta y salida de la más antigua.
- IntersectionObserver activa las vistas visibles; el bucle se detiene cuando ninguna intersecta la pantalla. Entrada con muelle de 1,4s, paralaje con scroll, deriva sutil, luces de borde lima y brillo de suelo. Buffers y geometrías se crean antes del bucle. El tema usa `curTheme()` y `themechange`, como el hero. Con movimiento reducido se dibuja un estado asentado por vista, sin bucle continuo; scroll, tamaño y tema invalidan el fotograma. Si falla WebGL o se pierde el contexto, se conserva la escena CSS original como fallback: su markup solo se oculta después del primer render correcto de cada vista (`.webgl`).
- En escritorio, las vistas conservan la columna libre sticky de hasta min(560px, 40vw) × 440px; a ≤900px aparecen antes del titular en un espacio de 280px. Los paneles y animaciones CSS originales se usan únicamente como fallback.
- Qué incluye: tarjetas tipo bento (`.bento`), cada una con un pequeño dibujo CSS (`.viz`: web, dispositivos, carga segura, resultado de Google, puesta en marcha, legal) que se anima al aparecer.
- Tipos de web: cada tarjeta muestra un esquema de esa web (`.wire`: corporativa, landing, antes/después).
- Cómo trabajamos: línea de tiempo vertical (`.steps.tl`) que se rellena de lima con el scroll (`--p`) y enciende cada paso (`.lit`).
- Los dibujos son decorativos (`aria-hidden`) y no muestran cifras inventadas.

## Reglas a respetar
- Accesibilidad WCAG 2.1 AA: texto ≥ 4.5:1, bordes de campos ≥ 3:1, foco visible, `prefers-reduced-motion`, enlace "Saltar al contenido".
- Tiene que funcionar en móvil (3D arriba, texto debajo). Probar al menos 320×568, 375×667, 390×844, 430×932 y horizontal 667×375 / 844×390: sin scroll lateral y ningún texto tapado por la cabecera.
- Campos de formulario con texto ≥ 16px (si no, iOS hace zoom) y zonas táctiles ≥ 44px.
- No inventar cifras ni testimonios; usar marcadores tipo [LOGO CLIENTE].
