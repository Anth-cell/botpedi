const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "users.json");

// ─────────────────────────────────────────
// GESTIÓN DE users.json
// ─────────────────────────────────────────

function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, "[]", "utf8");
      return [];
    }
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ [notifier] Error leyendo users.json:", err.message);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("❌ [notifier] Error escribiendo users.json:", err.message);
  }
}

/**
 * Registra el userId si es la primera vez.
 * Devuelve true si es primera vez, false si ya estaba.
 */
function isFirstTime(userId) {
  const users = loadUsers();
  if (users.includes(userId)) return false;
  users.push(userId);
  saveUsers(users);
  return true;
}

// ─────────────────────────────────────────
// DETECCIÓN DE PAÍS
// Telegram provee language_code en el objeto from.
// No hay IP ni timezone disponibles en la Bot API estándar.
// ─────────────────────────────────────────

const LANG_TO_COUNTRY = {
  es:      "🇪🇸 España / Hispanoamérica",
  "es-419":"🇲🇽 Latinoamérica",
  mx:      "🇲🇽 México",
  hn:      "🇭🇳 Honduras",
  gt:      "🇬🇹 Guatemala",
  sv:      "🇸🇻 El Salvador",
  cr:      "🇨🇷 Costa Rica",
  co:      "🇨🇴 Colombia",
  ve:      "🇻🇪 Venezuela",
  ar:      "🇦🇷 Argentina",
  cl:      "🇨🇱 Chile",
  pe:      "🇵🇪 Perú",
  ec:      "🇪🇨 Ecuador",
  bo:      "🇧🇴 Bolivia",
  py:      "🇵🇾 Paraguay",
  uy:      "🇺🇾 Uruguay",
  do:      "🇩🇴 Rep. Dominicana",
  cu:      "🇨🇺 Cuba",
  pr:      "🇵🇷 Puerto Rico",
  pa:      "🇵🇦 Panamá",
  ni:      "🇳🇮 Nicaragua",
  en:      "🇺🇸 EE.UU. / Reino Unido",
  "en-us": "🇺🇸 Estados Unidos",
  "en-gb": "🇬🇧 Reino Unido",
  pt:      "🇧🇷 Brasil / Portugal",
  "pt-br": "🇧🇷 Brasil",
  fr:      "🇫🇷 Francia",
  de:      "🇩🇪 Alemania",
  it:      "🇮🇹 Italia",
  ru:      "🇷🇺 Rusia",
  uk:      "🇺🇦 Ucrania",
  tr:      "🇹🇷 Turquía",
  fa:      "🇮🇷 Irán",
  zh:      "🇨🇳 China",
  ja:      "🇯🇵 Japón",
  ko:      "🇰🇷 Corea del Sur",
  hi:      "🇮🇳 India",
  id:      "🇮🇩 Indonesia",
};

function detectCountry(langCode) {
  if (!langCode) return "❓ Desconocido";
  const key = langCode.toLowerCase();
  return LANG_TO_COUNTRY[key] || `❓ Desconocido (${langCode})`;
}

// ─────────────────────────────────────────
// DETECCIÓN DE PLATAFORMA
// La Bot API no expone el dispositivo en mensajes /start de chat privado.
// Se muestra Desconocida de forma honesta.
// ─────────────────────────────────────────

function detectPlatform(msg) {
  if (msg.web_app_data) return "🌐 Web App";
  return "❓ Desconocida";
}

// ─────────────────────────────────────────
// PERMALINK PERMANENTE
//
// tg://user?id=USERID es un enlace profundo que abre el perfil
// del usuario por su ID numérico, sin importar si cambia de
// nombre o username. Funciona en Telegram Desktop, iOS y Android.
// ─────────────────────────────────────────

function buildPermalink(userId) {
  return `tg://user?id=${userId}`;
}

// ─────────────────────────────────────────
// MENSAJE DE NOTIFICACIÓN
// ─────────────────────────────────────────

function buildNotification({ username, userId, firstName, lastName, isAdminUser, country, platform }) {
  const estado = isAdminUser ? "✅ Aceptado" : "🔴 Bloqueado";

  // Nombre completo (puede no tener apellido)
  const userDisplay = username ? `@${username}` : `Sin username`;
  const permalink  = buildPermalink(userId);

  return (
    `⚡ <b>Nuevo usuario detectado</b>\n` +
    `═══════════════\n\n` +
    `👤 Usuario: <a href="${permalink}">${userDisplay}</a>\n` +
    `🆔 ID: <code>${userId}</code>\n` +
    `🏷️ Estado: <b>${estado}</b>\n` +
    `🌍 País: <b>${country}</b>\n` +
    `📱 Plataforma: <b>${platform}</b>`
  );
}

// ─────────────────────────────────────────
// FUNCIÓN PRINCIPAL EXPORTADA
// ─────────────────────────────────────────

/**
 * checkAndNotify(bot, msg, logChannelId, isAdminFn)
 *
 * - bot           → instancia de TelegramBot
 * - msg           → objeto mensaje del handler /start
 * - logChannelId  → LOG_CHANNEL_ID de config.js (ID del canal de logs)
 * - isAdminFn     → función isAdmin(userId) de config.js
 */
async function checkAndNotify(bot, msg, logChannelId, isAdminFn) {
  const userId = msg.from.id;

  // Solo notificar la primera vez
  if (!isFirstTime(userId)) return;

  const username    = msg.from.username || null;
  const firstName   = msg.from.first_name || "";
  const lastName    = msg.from.last_name || "";
  const langCode    = msg.from.language_code || null;
  const country     = detectCountry(langCode);
  const platform    = detectPlatform(msg);
  const isAdminUser = isAdminFn(userId);

  const text = buildNotification({
    username,
    userId,
    firstName,
    lastName,
    isAdminUser,
    country,
    platform,
  });

  try {
    await bot.sendMessage(logChannelId, text, {
      parse_mode: "HTML",
      // disable_web_page_preview evita que el permalink genere una preview
      disable_web_page_preview: true,
    });
    console.log(`📡 [notifier] Nuevo usuario registrado: ${userId}`);
  } catch (err) {
    console.error("❌ [notifier] Error enviando al canal de logs:", err.message);
    console.error("   Asegúrate de que el bot es admin del canal y LOG_CHANNEL_ID es correcto.");
  }
}

module.exports = { checkAndNotify };