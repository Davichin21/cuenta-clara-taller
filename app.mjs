import { tools, read_values } from "./model.mjs";

const id = document.body.dataset.tool;
const tool = tools[id];
const form = document.querySelector("#calculator");
const output = document.querySelector("#values");
const error = document.querySelector("#error");
const export_button = document.querySelector("#export");
const number_format = new Intl.NumberFormat("es", { maximumFractionDigits: 2 });
let csv;

function calculate() {
  csv = null;
  export_button.disabled = true;
  error.hidden = true;
  output.replaceChildren();
  try {
    const raw = Object.fromEntries(new FormData(form));
    const values = read_values(tool.fields, raw);
    const results = tool.calculate(values);
    const currency = raw.currency;
    const money_format = currency ? new Intl.NumberFormat("es", { style: "currency", currency, currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2 }) : number_format;

    for (const [label, value, unit] of results) {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const amount = document.createElement("dd");
      term.textContent = label;
      amount.textContent = value === null ? "No aplica" : unit ? `${number_format.format(value)} ${unit}` : money_format.format(value);
      row.append(term, amount);
      output.append(row);
    }
    const rows = [
      ["Tipo", "Concepto", "Valor", "Unidad"],
      ...Object.entries(tool.fields).map(([key, [label]]) => ["Dato", label, values[key], label.endsWith("(%)") ? "%" : label.startsWith("Unidades") ? "unidades" : currency]),
      ...results.map(([label, value, unit]) => ["Resultado", label, value === null ? "No aplica" : Number(value.toFixed(2)), unit || currency])
    ];
    csv = "\ufeff" + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    export_button.disabled = false;
  } catch (cause) {
    error.textContent = cause.message;
    error.hidden = false;
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  calculate();
});
form.addEventListener("reset", () => setTimeout(calculate, 0));
form.addEventListener("input", () => {
  csv = null;
  export_button.disabled = true;
  error.hidden = true;
  const term = document.createElement("dt");
  term.textContent = "Pulsa Calcular para actualizar el resultado.";
  const row = document.createElement("div");
  row.append(term);
  output.replaceChildren(row);
});
export_button.addEventListener("click", () => {
  if (!csv) return;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = id + ".csv";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
calculate();
