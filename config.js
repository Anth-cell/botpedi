// ─────────────────────────────────────────
// CONFIGURACIÓN PRINCIPAL
// Edita estos valores antes de iniciar el bot
// ─────────────────────────────────────────

const ADMIN_ID = 8746875253; // ← Tu ID numérico de Telegram

const BOT_USERNAME = "seguidores_taquitoV1_bot";       // ← Username del bot sin @
const SELLER_USERNAME = "srtaquito6"; // ← Tu username personal sin @

/**
 * Verifica si el userId es administrador.
 * Puedes agregar más IDs al array ADMIN_IDS para multi-admin.
 */
const ADMIN_IDS = [ADMIN_ID]; // Agrega más IDs si necesitas

function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

module.exports = {
  ADMIN_ID,
  ADMIN_IDS,
  BOT_USERNAME,
  SELLER_USERNAME,
  isAdmin,
};