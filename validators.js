// ─────────────────────────────────────────
// VALIDACIÓN DE LINKS DE INSTAGRAM
// ─────────────────────────────────────────

/**
 * Valida y extrae información de un link de Instagram.
 *
 * Acepta:
 *   - https://instagram.com/usuario
 *   - https://www.instagram.com/usuario
 *   - instagram.com/usuario
 *   - @usuario
 *
 * Rechaza:
 *   - Reels (/reel/)
 *   - Posts (/p/)
 *   - Links inválidos
 *   - Texto random
 */
function validateIGLink(input) {
  const raw = (input || "").trim();

  if (!raw) {
    return { valid: false, errorMsg: "No se proporcionó ningún link." };
  }

  // Caso: @usuario directo
  const atMatch = raw.match(/^@([\w.]+)$/);
  if (atMatch) {
    const username = atMatch[1];
    return {
      valid: true,
      link: `https://instagram.com/${username}`,
      username,
    };
  }

  // Rechazar reels
  if (/\/(reel|reels)\//i.test(raw)) {
    return {
      valid: false,
      errorMsg: "❌ Los links de <b>Reels</b> no son aceptados.\nUsa el link del perfil.",
    };
  }

  // Rechazar posts
  if (/\/p\//i.test(raw)) {
    return {
      valid: false,
      errorMsg: "❌ Los links de <b>Posts</b> no son aceptados.\nUsa el link del perfil.",
    };
  }

  // Rechazar stories
  if (/\/stories\//i.test(raw)) {
    return {
      valid: false,
      errorMsg: "❌ Los links de <b>Stories</b> no son aceptados.\nUsa el link del perfil.",
    };
  }

  // Intentar extraer username de URL de Instagram
  const igMatch = raw.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([\w.]+)\/?/i
  );

  if (igMatch) {
    const username = igMatch[1];

    // Rechazar segmentos reservados de IG
    const reserved = ["explore", "accounts", "direct", "stories", "reels", "reel", "p", "tv", "ar"];
    if (reserved.includes(username.toLowerCase())) {
      return {
        valid: false,
        errorMsg: `❌ Link inválido. El segmento <b>"${username}"</b> no es un perfil de usuario.`,
      };
    }

    return {
      valid: true,
      link: `https://instagram.com/${username}`,
      username,
    };
  }

  return {
    valid: false,
    errorMsg: "❌ Link no reconocido.\n\nFormatos aceptados:\n• <code>https://instagram.com/usuario</code>\n• <code>@usuario</code>",
  };
}

/**
 * Alias para uso futuro extendido.
 */
function parseIGLink(input) {
  return validateIGLink(input);
}

module.exports = { validateIGLink, parseIGLink };