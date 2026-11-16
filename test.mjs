import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { tools, read_values } from "./model.mjs";

const expected = {
  "precio-de-venta": [42.86, 2.143, 10.717],
  "margen-de-ganancia": [17.5, 35, 53.846153846],
  "descuento-maximo": [33.33, 40, 8],
  "punto-de-equilibrio": [43, 2150, 43, 17.5],
  "comparar-promociones": [525, 445.5, -79.5, 54]
};
for (const [id, tool] of Object.entries(tools)) {
  const raw = Object.fromEntries(Object.entries(tool.fields).map(([key, [, value]]) => [key, value]));
  const result = tool.calculate(read_values(tool.fields, raw));
  assert.equal(result.length, expected[id].length);
  result.forEach(([, value], index) => assert.ok(Math.abs(value - expected[id][index]) < 1e-8, id));
  assert.throws(() => read_values(tool.fields, {}));
}

assert.equal(read_values({ value: ["Prueba", 0, 200] }, {value: "20,35"}).value, 20.35);
for (const value of ["1e2", "NaN", "-1", "1.345", "201", "1,000.00"]) {
  assert.throws(() => read_values({ value: ["Prueba", 0, 200] }, {value}));
}
assert.throws(() => read_values({ quantity: ["Unidades", 0, 200, true] }, {quantity: "1.5"}));
assert.throws(() => tools["precio-de-venta"].calculate({ cost: 30, fee: 15, margin: 85 }));
assert.equal(tools["precio-de-venta"].calculate({ cost: 30, fee: 0, margin: 25 })[0][1], 40);
assert.equal(tools["margen-de-ganancia"].calculate({ cost: 0, fee: 0, price: 50 })[2][1], null);
assert.throws(() => tools["descuento-maximo"].calculate({ price: 30, cost: 30, fee: 5, margin: 20 }));
assert.throws(() => tools["punto-de-equilibrio"].calculate({ fixed: 100, price: 30, cost: 30, fee: 0, goal: 0 }));
assert.equal(tools["punto-de-equilibrio"].calculate({ fixed: 10, price: 2, cost: 1, fee: 0, goal: 5 })[2][1], 15);
assert.equal(tools["comparar-promociones"].calculate({ a: 50, units_a: 30, b: 20, units_b: 20, cost: 30, fee: 5 })[3][1], null);

const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]));
assert.equal(urls.length, 11);
assert.equal(new Set(urls.map(url => url.href)).size, 11);
for (const url of urls) {
  const html = await readFile("dist" + url.pathname + "index.html", "utf8");
  assert.ok(html.includes(`href="${url.href}"`));
  assert.equal([...html.matchAll(/<h1>/g)].length, 1);
  for (const [, target] of html.matchAll(/(?:href|src)="(\/[^"#]*)/g)) {
    await access("dist" + (target.endsWith("/") ? target + "index.html" : target));
  }
}
await access("dist/404.html");
assert.ok((await readFile("dist/robots.txt", "utf8")).includes(urls[0].origin + "/sitemap.xml"));
console.log("Cinco calculadoras, validación, casos límite y enlaces internos de 11 páginas comprobados.");
