# Estado del Proyecto 01

Verificado el 16 de noviembre de 2026.

- [Cuenta Clara](https://cuenta-clara-taller.pages.dev/) y [repositorio](https://github.com/Davichin21/cuenta-clara-taller).
- Cloudflare Pages conectado a GitHub. Rama de producción main, comando node build.mjs, salida dist. Se observó el despliegue automático de la verificación de Search Console después de un push.
- Web Analytics activado. El navegador confirmó la inyección del beacon en producción. El panel Metrics incluye tráfico, rendimiento y respuestas de error.
- Search Console verificó la propiedad de prefijo HTTPS mediante etiqueta HTML. Google confirmó el envío de sitemap.xml. La solicitud de indexación manual de la portada mostró «Cuota superada». Google recomienda volver a intentar al día siguiente. El sitemap sigue enviado.
- AdSense: Google aceptó el subdominio, verificó la propiedad por metaetiqueta y registró la solicitud de revisión. El listado de Sitios muestra «Preparando el sitio». El panel de inicio marca como obligatoria la información en Pagos. Se dejó abierto «Información del cliente» para que el titular la complete en Google. Estado «Listo», ads.txt, consentimiento y código publicitario pendientes. La web inicial no sirve anuncios.

## Pruebas

- Node: el build generó 11 páginas indexables y una 404. Cinco ejemplos, errores matemáticos, decimales con coma, validación de campos, canonical y enlaces internos verificados con node test.mjs.
- Chrome local: las cinco calculadoras respondieron al botón Calcular, mostraron aviso al ingresar texto inválido y recuperaron el ejemplo. La prueba detectó que el cálculo se disparaba antes del restablecimiento nativo y se corrigió.
- Chrome con vista de 360 px: portada, cinco herramientas y contacto sin desplazamiento horizontal. Es emulación de tamaño de pantalla.
- HTTPS de producción: 200 en portada, ruta de precio, módulo JavaScript, sitemap y robots. En Chrome se ejecutaron las cinco herramientas publicadas y se confirmó el contacto de GitHub. La ruta inventada respondió 404. El JavaScript se sirvió como application/javascript.
- Contacto: la página enlaza al formulario de incidencias de GitHub. Las incidencias son públicas y requieren cuenta. No se publicó una incidencia de prueba.
- La descarga activó su botón en Chrome, pero el controlador no confirmó el guardado del archivo. Una prueba del manejador con un DOM simulado en Node comprobó el Blob CSV, su nombre y sus filas. Detectó decimales residuales de coma flotante; la exportación final muestra hasta dos decimales.

## Siguiente paso

Completar los datos obligatorios de AdSense y consultar el estado de la revisión. Al llegar a «Listo», configurar el consentimiento que corresponda y añadir ads.txt y el código oficial. Si se necesita la solicitud manual de indexación, reintentar cuando se restablezca la cuota. Revisar la búsqueda orgánica por consultas y páginas en Search Console cuando haya datos. No se contrató alojamiento ni se compró un dominio.
