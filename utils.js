// ─────────────────────────────────────────
// UTILIDADES GENERALES
// ─────────────────────────────────────────

/**
 * Formatea un número con comas: 1200 → "1,200"
 */
function formatNumber(n) {
  return n.toLocaleString("en-US");
}

/**
 * Genera un ID de orden aleatorio tipo #IG48391
 */
function generateOrderId() {
  const num = Math.floor(10000 + Math.random() * 89999);
  return `#IG${num}`;
}

/**
 * Tabla de precios según cantidad comprada.
 * Retorna el precio en string o null si no es válido.
 */
const PRICE_TABLE = {
  1000: "$35 MXN",
  2000: "$60 MXN",
  3000: "$90 MXN",
  5000: "$150 MXN",
};

function getPrice(cantidad) {
  return PRICE_TABLE[cantidad] || null;
}

/**
 * Calcula latencia aproximada (ms) desde un timestamp de inicio.
 */
function calcLatency(start) {
  return Date.now() - start;
}

module.exports = {
  formatNumber,
  generateOrderId,
  getPrice,
  calcLatency,
  PRICE_TABLE,
};