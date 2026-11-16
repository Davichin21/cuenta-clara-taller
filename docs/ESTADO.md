# Estado del Proyecto 01

Verificado el 16 de noviembre de 2026.

- [Cuenta Clara](https://cuenta-clara-taller.pages.dev/) y [repositorio](https://github.com/Davichin21/cuenta-clara-taller).
- Cloudflare Pages conectado a GitHub. Rama de producción main, comando node build.mjs, salida dist. Se observó el despliegue automático de la verificación de Search Console después de un push.
- Web Analytics activado. El navegador confirmó la inyección del beacon en producción. El panel Metrics incluye tráfico, rendimiento y respuestas de error.
- Search Console verificó la propiedad de prefijo HTTPS mediante etiqueta HTML. Google confirmó el envío de sitemap.xml. La solicitud de indexación manual de la portada mostró «Cuota superada». Google recomienda volver a intentar al día siguiente. El sitemap sigue enviado.
- AdSense: formulario de alta abierto con la dirección del sitio y Perú como país de pago mostrado por Google. El titular debe confirmar los términos y completar las verificaciones de cuenta que Google solicite. Pendiente el envío a revisión, la confirmación de elegibilidad del subdominio y el estado Listo. La web inicial no sirve anuncios.

## Pruebas

- Node: el build generó 11 páginas indexables y una 404. Cinco ejemplos, errores matemáticos, decimales con coma, validación de campos, canonical y enlaces internos verificados con node test.mjs.
- Chrome local: las cinco calculadoras respondieron al botón Calcular, mostraron aviso al ingresar texto inválido y recuperaron el ejemplo. La prueba detectó que el cálculo se disparaba antes del restablecimiento nativo y se corrigió.
- Chrome con vista de 360 px: portada, cinco herramientas y contacto sin desplazamiento horizontal. Es emulación de tamaño de pantalla.
- HTTPS de producción: 200 en portada, ruta de precio, módulo JavaScript, sitemap y robots. La ruta inventada respondió 404. El JavaScript se sirvió como application/javascript.
- Contacto: la página enlaza al formulario de incidencias de GitHub. Las incidencias son públicas y requieren cuenta. No se publicó una incidencia de prueba.
- La captura del evento de descarga agotó el plazo del controlador del navegador. La verificación de guardado CSV debe confirmarse si el navegador no expone el evento.

## Siguiente paso

Tras el alta de AdSense, verificar si admite el subdominio. Si se admite, usar la opción de verificación indicada por Google y solicitar revisión. Tras el estado Listo, configurar el consentimiento que corresponda y añadir el código oficial. Revisar la búsqueda orgánica por consultas y páginas en Search Console cuando haya datos. No se contrató alojamiento ni se compró un dominio.
