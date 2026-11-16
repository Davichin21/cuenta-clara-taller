# Cuenta Clara

Calculadoras gratuitas en español para pequeños negocios. Precio de venta, margen, descuento máximo, equilibrio mensual y comparación de promociones. Los formularios calculan en el navegador y pueden descargar sus datos y resultados como CSV.

## Compilar y probar

Con Node.js, desde la raíz del repositorio:

```sh
node build.mjs
node test.mjs
```

El resultado está en dist/. No se instalan dependencias. Usa SITE_URL para apuntar las etiquetas canonical y el sitemap a otra dirección de producción.

## Cloudflare Pages

Conecta este repositorio. Elige main, sin preset de framework, comando de compilación node build.mjs y salida dist. Prueba la URL asignada. Si Cloudflare asigna un hostname diferente a cuenta-clara-taller.pages.dev, configura SITE_URL con la dirección HTTPS real y vuelve a publicar.

La página de contacto usa GitHub Issues. Para medición, habilita Web Analytics en la sección Metrics del proyecto. Las cabeceras de seguridad permiten su beacon. Durante los cambios revisa el estado de despliegue en Pages, la consola de Chrome, rutas HTTP y la respuesta 404.

Consulta [la investigación](docs/INVESTIGACION.md) para las fuentes, supuestos y estrategia de crecimiento.
