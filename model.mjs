const money = (label, initial) => [label, initial, 1e9];
const percent = (label, initial) => [label, initial, 100];
const contribution = (price, cost, fee) => price * (1 - fee / 100) - cost;
const round_up = (value, scale = 1) => {
  const scaled = value * scale;
  return Math.ceil(scaled - Number.EPSILON * Math.abs(scaled) * 2) / scale;
};

export const tools = {
  "precio-de-venta": {
    title: "Calculadora de precio de venta",
    short: "Precio de venta",
    description: "Encuentra el precio mínimo que cubre tu costo, la comisión y el margen que quieres conservar.",
    fields: { cost: money("Costo variable por unidad", 30), fee: percent("Comisión sobre el precio (%)", 5), margin: percent("Margen objetivo (%)", 25) },
    calculate({ cost, fee, margin }) {
      if (cost <= 0) throw Error("Ingresa un costo mayor que cero.");
      if (fee + margin >= 100) throw Error("La comisión y el margen deben sumar menos del 100 %.");
      const price = round_up(cost / (1 - (fee + margin) / 100), 100);
      return [["Precio mínimo", price], ["Comisión por unidad", price * fee / 100], ["Aporte por unidad", contribution(price, cost, fee)]];
    },
    formula: "Precio mínimo = costo variable ÷ (1 − comisión − margen objetivo). Convierte los porcentajes en decimales y redondea el precio hacia arriba al centavo.",
    example: "Si producir una vela cuesta 30, la plataforma cobra 5 % y quieres conservar 25 % de cada venta, divide 30 entre 0,70. El precio mínimo redondeado es 42,86.",
    note: "Incluye envases, mano de obra por unidad y cualquier tarifa fija por venta dentro del costo variable. Usa el precio sin impuesto y una comisión calculada sobre esa misma base."
  },
  "margen-de-ganancia": {
    title: "Calculadora de margen de ganancia",
    short: "Margen de ganancia",
    description: "Averigua cuánto aporta cada venta después de costos y comisiones. Compara margen sobre venta y recargo sobre costo.",
    fields: { price: money("Precio cobrado por unidad", 50), cost: money("Costo variable por unidad", 30), fee: percent("Comisión sobre el precio (%)", 5) },
    calculate({ price, cost, fee }) {
      if (price <= 0) throw Error("Ingresa un precio mayor que cero.");
      const profit = contribution(price, cost, fee);
      const total_cost = cost + price * fee / 100;
      return [["Aporte por unidad", profit], ["Margen de contribución", profit / price * 100, "%"], ["Recargo sobre costo total", total_cost ? profit / total_cost * 100 : null, "%"]];
    },
    formula: "Aporte = precio − comisión − costo variable. Margen = aporte ÷ precio. Recargo = aporte ÷ (costo variable + comisión).",
    example: "Un artículo de 50 con costo variable de 30 y comisión de 5 % deja 17,50. Representa el 35 % de la venta y el 53,85 % del costo total de 32,50.",
    note: "El aporte unitario ayuda a cubrir los gastos mensuales. Para saber cuántas unidades necesitas, usa la calculadora de punto de equilibrio."
  },
  "descuento-maximo": {
    title: "Calculadora de descuento máximo",
    short: "Descuento máximo",
    description: "Encuentra cuánto puedes rebajar el precio sin bajar del margen que quieres mantener.",
    fields: { price: money("Precio actual", 60), cost: money("Costo variable por unidad", 30), fee: percent("Comisión sobre el precio (%)", 5), margin: percent("Margen que quieres conservar (%)", 20) },
    calculate({ price, cost, fee, margin }) {
      if (price <= 0 || cost <= 0) throw Error("El precio y el costo deben ser mayores que cero.");
      if (fee + margin >= 100) throw Error("La comisión y el margen deben sumar menos del 100 %.");
      const floor = round_up(cost / (1 - (fee + margin) / 100), 100);
      if (floor > price) throw Error("El precio actual ya está por debajo del mínimo para ese margen. Reduce el margen objetivo o sube el precio.");
      const discount = Math.floor((1 - floor / price) * 10000 + 1e-10) / 100;
      return [["Descuento máximo", discount, "%"], ["Precio mínimo de promoción", floor], ["Aporte al precio mínimo", contribution(floor, cost, fee)]];
    },
    formula: "Descuento máximo = 1 − precio mínimo ÷ precio actual. El porcentaje se redondea hacia abajo para proteger el margen.",
    example: "Con precio de 60, costo de 30, comisión de 5 % y margen objetivo de 20 %, el precio piso es 40. Si tu tienda exige un porcentaje de dos decimales, coloca como máximo 33,33 %.",
    note: "Si combinas cupones, comprueba el precio final de la cesta. Usa como base el precio efectivamente cobrado antes de impuestos."
  },
  "punto-de-equilibrio": {
    title: "Calculadora de punto de equilibrio",
    short: "Punto de equilibrio",
    description: "Calcula cuántas unidades debes vender al mes para cubrir tus gastos fijos o alcanzar una meta.",
    fields: { fixed: money("Gastos fijos mensuales", 750), price: money("Precio cobrado por unidad", 50), cost: money("Costo variable por unidad", 30), fee: percent("Comisión sobre el precio (%)", 5), goal: money("Beneficio mensual objetivo", 0) },
    calculate({ fixed, price, cost, fee, goal }) {
      const profit = contribution(price, cost, fee);
      if (profit <= 0) throw Error("Cada venta debe aportar algo a los gastos fijos. Revisa el precio, el costo o la comisión.");
      const units = round_up(fixed / profit);
      const target = round_up((fixed + goal) / profit);
      if (!Number.isSafeInteger(target)) throw Error("El aporte por unidad es demasiado pequeño para calcular una meta en unidades enteras.");
      return [["Unidades para cubrir gastos", units, "unidades"], ["Ventas para cubrir gastos", units * price], ["Unidades para alcanzar tu meta", target, "unidades"], ["Aporte por unidad", profit]];
    },
    formula: "Unidades = (gastos fijos + beneficio deseado) ÷ aporte por unidad. Redondea hacia arriba. Para el equilibrio, el beneficio deseado es cero.",
    example: "Con 750 en gastos fijos y 17,50 de aporte por venta, necesitas 43 unidades. Con 42, aportas 735 y quedan 15 sin cubrir.",
    note: "Usa un producto o un precio y un costo representativos cuando tu mezcla de ventas sea estable. Si el aporte cambia por canal, calcula los canales aparte."
  },
  "comparar-promociones": {
    title: "Comparador de promociones",
    short: "Comparar promociones",
    description: "Compara el aporte total de dos ofertas y calcula cuántas unidades necesita la segunda para igualar la primera.",
    fields: { a: money("Precio final de la oferta A", 50), units_a: ["Unidades previstas en A", 30, 1e7, true], b: money("Precio final de la oferta B", 42), units_b: ["Unidades previstas en B", 45, 1e7, true], cost: money("Costo variable por unidad", 30), fee: percent("Comisión en ambas ofertas (%)", 5) },
    calculate({ a, units_a, b, units_b, cost, fee }) {
      const profit_a = contribution(a, cost, fee);
      const profit_b = contribution(b, cost, fee);
      const target = profit_b > 0 ? round_up(Math.max(0, profit_a * units_a / profit_b)) : null;
      return [["Aporte total de A", profit_a * units_a], ["Aporte total de B", profit_b * units_b], ["Diferencia de B frente a A", profit_b * units_b - profit_a * units_a], ["Unidades de B para igualar o superar A (con aporte positivo en B)", Number.isSafeInteger(target) ? target : null, "unidades"]];
    },
    formula: "Para cada oferta multiplica su aporte unitario por las unidades estimadas. Con aporte unitario positivo en B, divide el aporte total de A entre el aporte unitario de B para hallar el volumen requerido.",
    example: "A 50 por unidad, 30 ventas aportan 525. A 42, 45 ventas aportan 445,50. La segunda oferta necesita 54 ventas para superar a la primera.",
    note: "Anota tus ventas recientes y usa un pronóstico conservador. La calculadora compara aportes con las cantidades que indicas y supone el mismo costo, comisión y gasto fijo en ambas ofertas."
  }
};

export function read_values(fields, raw) {
  return Object.fromEntries(Object.entries(fields).map(([key, [label, , max, whole]]) => {
    const value = String(raw[key] ?? "").trim();
    const number = Number(value.replace(",", "."));
    if (!/^\d+(?:[.,]\d{1,2})?$/.test(value) || number > max || (whole && !Number.isInteger(number))) {
      const format = whole ? "un número entero" : "un número con hasta dos decimales";
      throw Error(`En «${label}», escribe ${format} entre 0 y ${max}, sin separadores de miles.`);
    }
    return [key, number];
  }));
}
