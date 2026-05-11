const { formatNumber } = require("./utils");

// ─────────────────────────────────────────
// MENSAJES PREMIUM DEL BOT
// ─────────────────────────────────────────

/**
 * Bienvenida compacta para ADMIN
 */
function buildWelcomeAdmin(username, userId, latency) {
  return (
    `⚡ <b>Bienvenido @${username}</b>\n\n` +
    `🧾 Usuario: @${username} | 🆔 <code>${userId}</code>\n` +
    `🏷️ Rango: <b>Owner</b> | 🛜 Latencia: ${latency}ms\n\n` +
    `📦 <code>/igs</code> → Crear pedido IG Followers\n` +
    `💰 <code>/precios</code> → Lista de precios\n` +
    `📋 <code>/servicios</code> → Plataformas disponibles\n` +
    `⚙️ <code>/cmd</code> → Comandos admin\n` +
    `📡 <code>/status</code> → Estado del bot`
  );
}

/**
 * Acceso denegado
 */
function buildWelcomeDenied() {
  return (
    `❌ <b>ACCESO INVÁLIDO</b>\n\n` +
    `No eres un usuario autorizado para utilizar este bot.\n\n` +
    `📩 Contacta al vendedor:\n` +
    `<b>@srtaquito6</b>`
  );
}

/**
 * Mensaje compacto premium del pedido (caption para foto)
 */
function buildOrderMessage({ orderId, cliente, igUser, actuales, comprados, total, precio }) {
  return (
    `🚀 <b>NUEVO PEDIDO ${orderId}</b>\n\n` +
    `👤 Cliente: <b>${cliente}</b>\n` +
    `📸 Cuenta: <code>${igUser}</code>\n\n` +
    `📊 Seguidores: ${formatNumber(actuales)} ➝ +${formatNumber(comprados)} = <b>${formatNumber(total)}</b>\n` +
    `💰 Pago: <b>${precio}</b> (Transferencia)\n` +
    `⏰ Tiempo: <b>0 - 60 min</b>\n\n` +
    `📦 Servicio: <b>Instagram Followers</b>\n` +
    `🟢 Estado: <b>Procesando</b>\n\n` +
    `✨ <i>Gracias por confiar en nosotros</i>`
  );
}

/**
 * Panel de comandos admin /cmd
 */
function buildCmdPanel() {
  return (
    `⚙️ <b>PANEL ADMINISTRATIVO</b>\n\n` +
    `📦 <b>Crear Pedido</b>\n` +
    `└ <code>/igs</code> — Inicia el asistente de pedido IG\n\n` +
    `💰 <b>Precios</b>\n` +
    `└ <code>/precios</code> — Tabla de precios vigente\n\n` +
    `📋 <b>Servicios</b>\n` +
    `└ <code>/servicios</code> — Plataformas disponibles\n\n` +
    `📡 <b>Estado</b>\n` +
    `└ <code>/status</code> — Monitoreo del sistema\n\n` +
    `🏠 <b>Inicio</b>\n` +
    `└ <code>/start</code> — Menú principal\n\n` +
    `🔒 <i>Panel exclusivo para administradores</i>`
  );
}

/**
 * Lista de precios /precios
 */
function buildPricesMessage() {
  return (
    `💰 <b>LISTA DE PRECIOS</b>\n\n` +
    `📊 <b>Instagram Followers</b>\n` +
    `• 1,000 → $35 MXN\n` +
    `• 2,000 → $60 MXN\n` +
    `• 3,000 → $90 MXN\n` +
    `• 5,000 → $150 MXN\n\n` +
    `📦 <b>Otros servicios</b>\n` +
    `• Consultar con <code>/servicios</code>`
  );
}

/**
 * Lista de servicios /servicios
 */
function buildServicesMessage() {
  return (
    `📋 <b>SERVICIOS DISPONIBLES</b>\n\n` +
    `📸 <b>Instagram</b>\n` +
    `• ✅ Seguidores\n` +
    `• ⏳ Likes (próximamente)\n` +
    `• ⏳ Views (próximamente)\n\n` +
    `🎵 <b>TikTok</b>\n` +
    `• ⏳ Próximamente\n\n` +
    `▶️ <b>YouTube</b>\n` +
    `• ⏳ Próximamente\n\n` +
    `🐦 <b>Twitter / X</b>\n` +
    `• ⏳ Próximamente\n\n` +
    `📩 <i>Solicita más servicios al administrador</i>`
  );
}

/**
 * Estado del bot /status
 */
function buildStatusMessage() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const memMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);

  const now = new Date();
  const fecha = now.toLocaleDateString("es-MX", { day: "2-digit", month: "numeric", year: "numeric" });
  const hora = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    `📡 <b>ESTADO DEL SISTEMA</b>\n\n` +
    `🟢 Bot: Activo | ⚡ API: OK\n` +
    `🛜 Conexión: Estable | ⏱️ Uptime: ${hours}h ${minutes}m\n` +
    `🧠 Memoria: ${memMB} MB\n` +
    `🖥️ ${process.version}\n\n` +
    `📦 Servicio: Instagram Followers (Activo)\n\n` +
    `🕐 ${fecha} • ${hora}`
  );
}

module.exports = {
  buildWelcomeAdmin,
  buildWelcomeDenied,
  buildOrderMessage,
  buildCmdPanel,
  buildPricesMessage,
  buildServicesMessage,
  buildStatusMessage,
};