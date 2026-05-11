// ─────────────────────────────────────────
// CONFIGURACIÓN PRINCIPAL
// Edita estos valores antes de iniciar el bot
// ─────────────────────────────────────────

const ADMIN_ID = 8746875253; // ← Tu ID numérico de Telegram

const BOT_USERNAME = "/seguidores_taquitoV1_bot";        // ← Username del bot sin @
const SELLER_USERNAME = "srtaquito6"; // ← Tu username personal sin @

// ─────────────────────────────────────────
// CANAL DE LOGS
// El bot debe ser ADMIN del canal para poder enviar mensajes.
//
// Cómo obtener el ID del canal:
//   1. Agrega @userinfobot a tu canal como admin
//   2. Envía cualquier mensaje → te dará el Chat ID
//   3. Los canales tienen IDs negativos con -100 al inicio
//      Ejemplo: -1001234567890
// ─────────────────────────────────────────
const LOG_CHANNEL_ID = -1003914857513; // ← ID de tu canal de logs

/**
 * Verifica si el userId es administrador.
 * Puedes agregar más IDs al array ADMIN_IDS para multi-admin.
 */
const ADMIN_IDS = [ADMIN_ID];

function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

module.exports = {
  ADMIN_ID,
  ADMIN_IDS,
  LOG_CHANNEL_ID,
  BOT_USERNAME,
  SELLER_USERNAME,
  isAdmin,
};