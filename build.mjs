import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { tools } from "./model.mjs";

const origin = new URL(process.env.SITE_URL || "https://cuenta-clara-taller.pages.dev").origin;
const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[ch]);
const paths = [];
const cards = exclude => Object.entries(tools).filter(([id]) => id !== exclude).map(([id, tool], index) => `
  <a class="card" href="/${id}/"><span class="icon" aria-hidden="true">${["↗","%","−","=","⇄"][index]}</span><h3>${tool.short}</h3><p>${tool.description}</p><span class="arrow" aria-hidden="true">↗</span></a>`).join("");

async function page(path, title, description, content, id = "", index = true) {
  const canonical = origin + path;
  if (index) paths.push(canonical);
  const folder = path.endsWith("/") ? "dist" + path : "dist/";
  await mkdir(folder, { recursive: true });
  const file = path.endsWith("/") ? "index.html" : path.slice(1);
  await writeFile(folder + file, `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Cuenta Clara</title><meta name="description" content="${esc(description)}">
${index ? `<link rel="canonical" href="${esc(canonical)}">` : '<meta name="robots" content="noindex">'}
${path === "/" ? '<meta name="google-site-verification" content="SZGJCAaREGKhoSxTgrZL-Dch8cmgte_31dIS84pl0WQ">' : ""}
<meta name="google-adsense-account" content="ca-pub-5383899139851098">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)} · Cuenta Clara"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}">
<link rel="icon" href="/marca.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css">
${id ? '<script type="module" src="/app.mjs"></script>' : ""}</head>
<body${id ? ` data-tool="${id}"` : ""}>
<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="header"><div class="wrap top"><a class="brand" href="/"><img src="/marca.svg" alt="" width="35" height="35">Cuenta Clara</a><nav aria-label="Principal"><a href="/#herramientas">Herramientas</a><a href="/guia/">Guía</a></nav></div></header>
<main id="contenido">${content}</main>
<footer><div class="wrap bottom"><a class="brand" href="/">Cuenta Clara</a><nav aria-label="Información"><a href="/acerca/">Acerca de</a><a href="/contacto/">Contacto</a><a href="/privacidad/">Privacidad</a><a href="/condiciones/">Condiciones</a></nav></div></footer></body></html>`);
}
await page("/", "Calculadoras para pequeños negocios", "Calcula precios de venta, márgenes, descuentos y punto de equilibrio. Compara promociones y descarga resultados sin cuenta.", `
<section class="hero"><div class="wrap hero-grid"><div><p class="eyebrow">CALCULADORAS PARA PEQUEÑOS NEGOCIOS</p>
<h1>Pon precio.<br><em>Cuida tu margen.</em></h1>
<p class="lead">Prueba precios, comisiones y promociones antes de vender. Haz las cuentas en tu navegador y descarga el resultado.</p>
<a class="button" href="/precio-de-venta/">Calcular mi precio <span aria-hidden="true">↗</span></a></div>
<div class="receipt"><div class="receipt-head"><span>Una venta de ejemplo</span><span aria-hidden="true">↗</span></div><dl><div><dt>Precio cobrado</dt><dd>S/ 50,00</dd></div><div><dt>Costo variable</dt><dd>− S/ 30,00</dd></div><div><dt>Comisión del 5 %</dt><dd>− S/ 2,50</dd></div></dl><div class="receipt-total"><span>Aporte por venta</span><strong>S/ 17,50</strong></div></div>
</div></section>
<section id="herramientas" class="wrap section"><h2>Elige qué quieres calcular</h2><div class="cards">${cards()}</div></section>
<section class="wrap section guide"><div><h2>Del costo a la primera promoción</h2><p>Usa un ejemplo completo para decidir cuánto cobrar, cuánto puedes descontar y cuántas ventas necesitas al mes.</p></div><a class="button secondary" href="/guia/">Leer la guía ↗</a></section>`);

for (const [id, tool] of Object.entries(tools)) {
  const fields = Object.entries(tool.fields).map(([key, [label, value, , whole]]) =>
    `<label>${label}<input name="${key}" value="${value}" inputmode="${whole ? "numeric" : "decimal"}" maxlength="15" autocomplete="off" required></label>`).join("");
  await page("/" + id + "/", tool.title, tool.description, `
  <div class="wrap section inner"><a class="back" href="/#herramientas">← Todas las herramientas</a><h1>${tool.title}</h1><p class="lead">${tool.description}</p>
  <div class="workbench"><form id="calculator" class="panel"><h2>Datos de la operación</h2><p>Usa importes sin impuesto, en una sola moneda.</p>
  <div class="fields">${fields}<label>Moneda<select name="currency"><option value="">Sin símbolo</option><option value="PEN">PEN · Sol peruano</option><option value="MXN">MXN · Peso mexicano</option><option value="COP">COP · Peso colombiano</option><option value="USD">USD · Dólar</option><option value="EUR">EUR · Euro</option><option value="CLP">CLP · Peso chileno</option><option value="ARS">ARS · Peso argentino</option></select></label></div>
  <div class="actions"><button class="button" type="submit">Calcular</button><button class="button secondary" type="reset">Cargar ejemplo</button></div>
  <p id="error" class="error" role="alert" hidden></p><noscript><p>Activa JavaScript para calcular. La fórmula y el ejemplo están debajo.</p></noscript></form>
  <section class="panel results" aria-labelledby="result-title"><h2 id="result-title">Resultado</h2><dl id="values" aria-live="polite"><div><dt>Usa el ejemplo o ingresa tus datos.</dt></div></dl><div class="actions"><button id="export" class="button secondary" type="button" disabled>Descargar CSV</button></div></section></div>
  <article class="prose"><h2>Cómo se calcula</h2><p class="formula">${tool.formula}</p><h2>Ejemplo práctico</h2><p>${tool.example}</p><h2>Antes de usar el resultado</h2><p>${tool.note}</p></article>
  <section><h2>También puedes calcular</h2><div class="cards">${cards(id)}</div></section></div>`, id);
}

const info = {
  guia: ["Cómo fijar un precio y probar una promoción", "Un ejemplo de costos, comisiones, margen y ventas para un pequeño negocio.", `
<h2>1. Suma el costo por venta</h2><p>Imagina que preparas un paquete de café. Pagas 24 por el producto, 4 por la bolsa y etiqueta y 2 por el material de despacho. Tu costo variable es 30. Una plataforma cobra además el 5 % del precio pagado. Mantén ese porcentaje aparte para que se ajuste cuando cambies el precio.</p>
<h2>2. Elige un precio con margen</h2><p>Con un objetivo de 25 %, solo puedes destinar 70 % del precio al costo de 30. El resto son 25 % de aporte y 5 % de comisión. El <a href="/precio-de-venta/">precio mínimo</a> es 42,86. Si cobras 50, el <a href="/margen-de-ganancia/">aporte pasa a 17,50</a> y el margen al 35 %.</p>
<h2>3. Pon un límite al descuento</h2><p>Si aceptas bajar el margen hasta 20 %, puedes vender el paquete a 40. Sobre un precio normal de 50, el <a href="/descuento-maximo/">descuento máximo</a> es 20 %. Comprueba después cómo aplica tu plataforma el descuento, el impuesto y la comisión.</p>
<h2>4. Comprueba el volumen</h2><p>Con 750 de gastos mensuales, a precio normal necesitas 43 paquetes. En promoción quedan 8 por unidad, por lo que necesitas 94 paquetes para pagar esos mismos gastos. Calcula ambos escenarios con el <a href="/punto-de-equilibrio/">punto de equilibrio</a>.</p>
<h2>5. Compara con tu historial</h2><p>Si vendes 30 paquetes a precio normal, aportas 525. A precio promocional tendrías que vender 66 para superar esa cifra. <a href="/comparar-promociones/">Compara las ofertas</a> con cantidades realistas y descarga el CSV para revisar la decisión con tu equipo.</p>`],
  acerca: ["Acerca de Cuenta Clara", "Qué calcula Cuenta Clara y cómo se construyen sus estimaciones.", `<p>Cuenta Clara es un proyecto independiente de David Ponce para pequeños negocios que venden por unidad. Sus herramientas cubren el proceso de fijar un precio, calcular el aporte y decidir si una promoción se sostiene.</p><p>Publicamos las fórmulas y un caso resuelto en cada página para que puedas revisar el cálculo. Usamos un modelo de costo variable por unidad y comisión porcentual sobre el precio sin impuestos. Los gastos fijos aparecen en el cálculo mensual.</p><p>Si detectas un error, puedes <a href="/contacto/">reportarlo</a> con un ejemplo ficticio.</p>`],
  contacto: ["Contacto", "Cómo enviar comentarios o reportar un error de cálculo.", `<p>Para reportar un error o pedir una mejora, <a href="https://github.com/Davichin21/cuenta-clara-taller/issues/new">abre una incidencia en GitHub</a>. Necesitas iniciar sesión en GitHub para escribir.</p><p>Incluye el nombre de la herramienta, los pasos y el resultado esperado. Las incidencias son públicas. Usa cifras ficticias y evita datos personales o de clientes.</p>`],
  privacidad: ["Privacidad", "Qué datos se procesan al usar las calculadoras y los servicios del sitio.", `<p>Los importes que ingresas se calculan en tu navegador. El sitio no los envía por red ni los guarda al cerrar la página. El archivo CSV se genera en tu equipo al descargarlo.</p><h2>Alojamiento y medición</h2><p>Cloudflare entrega las páginas y puede procesar datos técnicos de la conexión para prestar el servicio. Si se activa Cloudflare Web Analytics, recoge métricas de visita y rendimiento de la página sin incluir los importes de las calculadoras. Puedes consultar la <a href="https://www.cloudflare.com/privacypolicy/">política de Cloudflare</a>.</p><h2>Contacto externo</h2><p>Al abrir una incidencia, GitHub aplica su <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">política de privacidad</a>. Las incidencias de este repositorio son públicas.</p><h2>Publicidad</h2><p>La versión inicial no carga anuncios. Si incorporamos publicidad, actualizaremos esta página para explicar qué proveedores intervienen y cómo gestionar el consentimiento cuando corresponda.</p>`],
  condiciones: ["Condiciones de uso", "Alcance y supuestos de los cálculos de Cuenta Clara.", `<p>Las herramientas ofrecen estimaciones informativas a partir de los datos ingresados. Revisa los resultados frente a tus costos reales, los convenios de tu plataforma y los criterios de tu negocio antes de fijar precios.</p><p>Usa una sola moneda y valores antes de impuestos. Las calculadoras no convierten monedas ni calculan impuestos. Las comisiones que tu proveedor cobra sobre otra base requieren un ajuste previo. Los resultados no sustituyen asesoría profesional.</p>`]
};
for (const [id, [title, description, content]] of Object.entries(info)) {
  await page("/" + id + "/", title, description, `<article class="wrap section prose info"><a class="back" href="/">← Inicio</a><h1>${title}</h1>${content}</article>`);
}
await page("/404.html", "Página no encontrada", "Vuelve al catálogo de calculadoras.", '<section class="wrap section info"><h1>Página no encontrada</h1><a class="button" href="/">Volver al inicio</a></section>', "", false);

await writeFile("dist/sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + paths.map(path => "<url><loc>" + esc(path) + "</loc></url>").join("\n") + "\n</urlset>\n");
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
for (const file of ["style.css", "marca.svg", "app.mjs", "model.mjs", "_headers"]) await copyFile(file, "dist/" + file);
console.log(`Generadas ${paths.length} páginas indexables y una página 404.`);
