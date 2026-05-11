require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
const seguidores_taquitoV1_bot = "seguidores_taquitoV1_bot"; // username exacto de tu bot
const srtaquito6 = "srtaquito6"; // username del vendedor
const { formatNumber, generateOrderId, getPrice } = require("./utils");
const { isAdmin, BOT_USERNAME, SELLER_USERNAME } = require("./config");
const { validateIGLink } = require("./validators");
const {
  buildOrderMessage,
  buildWelcomeAdmin,
  buildWelcomeDenied,
  buildCmdPanel,
  buildPricesMessage,
  buildServicesMessage,
  buildStatusMessage,
} = require("./messages");

const BOT_TOKEN = process.env.BOT_TOKEN || "8736697402:AAFcNb_4UgtoJPEx6c75UoFJnru9kyfh0_I";
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const photoPath = path.join(__dirname, "foto.jpg");

// ─────────────────────────────────────────
// ESTADO CONVERSACIONAL para flujo /igs
// { chatId: { step, igUser, igLink, actuales, msgIds[] } }
// ─────────────────────────────────────────
const igsState = {};

// Botón "Menú Principal" reutilizable
const menuButton = {
  inline_keyboard: [[{ text: "🏠 Menú Principal", callback_data: "menu_principal" }]],
};

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
async function sendPhotoCaption(chatId, caption, extra = {}) {
  return bot.sendPhoto(chatId, photoPath, {
    caption,
    parse_mode: "HTML",
    ...extra,
  });
}

async function tryDelete(chatId, msgId) {
  try { await bot.deleteMessage(chatId, msgId); } catch (_) {}
}

// ─────────────────────────────────────────
// /start
// ─────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || "usuario";
  const start = Date.now();
  delete igsState[chatId];

  if (isAdmin(userId)) {
    const latency = Date.now() - start;
    await sendPhotoCaption(chatId, buildWelcomeAdmin(username, userId, latency), {
      reply_markup: {
        inline_keyboard: [[
          { text: "🔄 Volver a comprar", url: `https://t.me/${BOT_USERNAME}` },
          { text: "👤 Vendedor", url: `https://t.me/${SELLER_USERNAME}` },
        ]],
      },
    });
  } else {
    await sendPhotoCaption(chatId, buildWelcomeDenied());
  }
});

// ─────────────────────────────────────────
// /igs — inicia flujo conversacional paso a paso
// ─────────────────────────────────────────
bot.onText(/\/igs/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    return bot.sendMessage(chatId, "❌ <b>ACCESO DENEGADO</b>", { parse_mode: "HTML" });
  }

  // Iniciar estado limpio
  igsState[chatId] = { step: "link", msgIds: [msg.message_id] };

  const sent = await bot.sendMessage(
    chatId,
    `📸 <b>Paso 1 / 3 — Link de Instagram</b>\n\nEnvía el link del perfil o el <code>@usuario</code>:`,
    { parse_mode: "HTML" }
  );
  igsState[chatId].msgIds.push(sent.message_id);
});

// ─────────────────────────────────────────
// /precios
// ─────────────────────────────────────────
bot.onText(/\/precios/, async (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(msg.from.id)) return bot.sendMessage(chatId, "❌ <b>ACCESO DENEGADO</b>", { parse_mode: "HTML" });
  await sendPhotoCaption(chatId, buildPricesMessage(), { reply_markup: menuButton });
});

// ─────────────────────────────────────────
// /servicios
// ─────────────────────────────────────────
bot.onText(/\/servicios/, async (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(msg.from.id)) return bot.sendMessage(chatId, "❌ <b>ACCESO DENEGADO</b>", { parse_mode: "HTML" });
  await sendPhotoCaption(chatId, buildServicesMessage(), { reply_markup: menuButton });
});

// ─────────────────────────────────────────
// /status
// ─────────────────────────────────────────
bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(msg.from.id)) return bot.sendMessage(chatId, "❌ <b>ACCESO DENEGADO</b>", { parse_mode: "HTML" });
  await sendPhotoCaption(chatId, buildStatusMessage(), { reply_markup: menuButton });
});

// ─────────────────────────────────────────
// /cmd
// ─────────────────────────────────────────
bot.onText(/\/cmd/, async (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(msg.from.id)) return bot.sendMessage(chatId, "❌ <b>ACCESO DENEGADO</b>", { parse_mode: "HTML" });
  await sendPhotoCaption(chatId, buildCmdPanel(), { reply_markup: menuButton });
});

// ─────────────────────────────────────────
// CALLBACK QUERY — botón Menú Principal
// ─────────────────────────────────────────
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const username = query.from.username || "usuario";
  await bot.answerCallbackQuery(query.id);

  if (query.data === "menu_principal" && isAdmin(userId)) {
    const start = Date.now();
    const latency = Date.now() - start;
    await sendPhotoCaption(chatId, buildWelcomeAdmin(username, userId, latency), {
      reply_markup: {
        inline_keyboard: [[
          { text: "🔄 Volver a comprar", url: `https://t.me/${BOT_USERNAME}` },
          { text: "👤 Vendedor", url: `https://t.me/${SELLER_USERNAME}` },
        ]],
      },
    });
  }
});

// ─────────────────────────────────────────
// FLUJO CONVERSACIONAL — texto libre
// Maneja los 3 pasos del flujo /igs
// ─────────────────────────────────────────
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  // Ignorar comandos (ya los manejan los onText de arriba)
  if (text.startsWith("/")) return;

  const state = igsState[chatId];
  if (!state) return;

  // Guardar el mensaje del usuario
  state.msgIds.push(msg.message_id);

  // ── PASO 1: Link de Instagram ──
  if (state.step === "link") {
    const { valid, username: igUser, errorMsg } = validateIGLink(text);

    if (!valid) {
      const sent = await bot.sendMessage(chatId,
        `❌ <b>Link inválido</b>\n\n${errorMsg}\n\nIntenta de nuevo:`,
        { parse_mode: "HTML" }
      );
      state.msgIds.push(sent.message_id);
      return;
    }

    state.igUser = igUser;
    state.step = "actuales";

    const sent = await bot.sendMessage(chatId,
      `✅ Perfil detectado: <code>${igUser}</code>\n\n📊 <b>Paso 2 / 3 — Seguidores actuales</b>\n\n¿Cuántos seguidores tiene actualmente?`,
      { parse_mode: "HTML" }
    );
    state.msgIds.push(sent.message_id);
    return;
  }

  // ── PASO 2: Seguidores actuales ──
  if (state.step === "actuales") {
    const num = parseInt(text.replace(/[,.\s]/g, ""), 10);

    if (isNaN(num) || num < 0) {
      const sent = await bot.sendMessage(chatId,
        `❌ Número inválido. Escribe solo dígitos, ejemplo: <code>1200</code>`,
        { parse_mode: "HTML" }
      );
      state.msgIds.push(sent.message_id);
      return;
    }

    state.actuales = num;
    state.step = "comprados";

    const sent = await bot.sendMessage(chatId,
      `✅ Actuales: <b>${formatNumber(num)}</b>\n\n🚀 <b>Paso 3 / 3 — Pedido y cliente</b>\n\nEscribe la cantidad comprada y el usuario del cliente:\n\n<code>[cantidad] [@usuario]</code>\n\n📌 Ejemplo: <code>1000 @juan</code>\n💡 Sin cliente: <code>1000 0</code>`,
      { parse_mode: "HTML" }
    );
    state.msgIds.push(sent.message_id);
    return;
  }

  // ── PASO 3: Cantidad comprada + cliente ──
  if (state.step === "comprados") {
    const parts = text.split(/\s+/);
    const comprados = parseInt((parts[0] || "").replace(/[,.\s]/g, ""), 10);
    const clienteRaw = parts[1] || "0";

    if (isNaN(comprados) || comprados <= 0) {
      const sent = await bot.sendMessage(chatId,
        `❌ Formato incorrecto.\n\nEjemplo: <code>1000 @juan</code>`,
        { parse_mode: "HTML" }
      );
      state.msgIds.push(sent.message_id);
      return;
    }

    const precio = getPrice(comprados);
    if (!precio) {
      const sent = await bot.sendMessage(chatId,
        `❌ <b>Cantidad no disponible.</b>\n\nOpciones:\n• 1,000 → $35 MXN\n• 2,000 → $60 MXN\n• 3,000 → $90 MXN\n• 5,000 → $150 MXN\n\nEscribe de nuevo:`,
        { parse_mode: "HTML" }
      );
      state.msgIds.push(sent.message_id);
      return;
    }

    // Procesar cliente
    const cliente =
      clienteRaw === "0" || !clienteRaw
        ? "None"
        : clienteRaw.startsWith("@")
        ? clienteRaw
        : `@${clienteRaw}`;

    const { actuales, igUser } = state;
    const total = actuales + comprados;
    const orderId = generateOrderId();

    // Guardar IDs y limpiar estado ANTES de borrar
    const allMsgIds = [...state.msgIds];
    delete igsState[chatId];

    // Borrar todos los mensajes del flujo
    for (const id of allMsgIds) {
      await tryDelete(chatId, id);
    }

    // Enviar pedido final con foto
    const caption = buildOrderMessage({ orderId, cliente, igUser, actuales, comprados, total, precio });
    await sendPhotoCaption(chatId, caption, {
      reply_markup: {
        inline_keyboard: [[
          { text: "🔄 Volver a comprar", url: `https://t.me/${seguidores_taquitoV1_bot}` },
          { text: "👤 Vendedor", url: `https://t.me/${srtaquito6}` },
        ]],
      },
    });
  }
});

// ─────────────────────────────────────────
// Errores de polling
// ─────────────────────────────────────────
bot.on("polling_error", (err) => {
  console.error("❌ Polling error:", err.message);
});

console.log("⚡ Bot iniciado correctamente...");