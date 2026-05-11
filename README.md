# ⚡ Bot Premium de Pedidos — Telegram

Bot privado de pedidos automáticos para redes sociales con sistema admin, validaciones y diseño premium.

---

## 📁 Estructura de archivos

```
telegram-bot/
├── bot.js          ← Archivo principal (lógica y comandos)
├── config.js       ← Configuración: ADMIN_ID, usernames
├── messages.js     ← Constructores de mensajes premium
├── validators.js   ← Validación de links de Instagram
├── utils.js        ← Utilidades: precios, IDs, formatos
├── package.json    ← Dependencias
├── foto.jpg        ← ⚠️ Coloca aquí tu imagen de bienvenida
└── README.md
```

---

## 🚀 Instalación

### 1. Requisitos
- Node.js 18 o superior
- Token del bot (obtenerlo desde [@BotFather](https://t.me/botfather))

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar el bot

Edita el archivo `config.js`:
```js
const ADMIN_ID = 123456789;        // Tu ID numérico de Telegram
const BOT_USERNAME = "TU_BOT";     // Username de tu bot (sin @)
const SELLER_USERNAME = "TU_USER"; // Tu username personal (sin @)
```

Edita el token en `bot.js`:
```js
const BOT_TOKEN = "TU_TOKEN_AQUI"; // Token de @BotFather
```

O usa variable de entorno (recomendado):
```bash
export BOT_TOKEN="tu_token_aqui"
```

### 4. Agregar imagen de bienvenida
Coloca tu imagen de bienvenida en la carpeta raíz con el nombre:
```
foto.jpg
```

### 5. Iniciar el bot
```bash
node bot.js
# o en modo desarrollo:
npm run dev
```

---

## 🔑 Cómo obtener tu ID de Telegram
1. Abre Telegram y busca [@userinfobot](https://t.me/userinfobot)
2. Envíale `/start`
3. Te devolverá tu ID numérico → ponlo en `ADMIN_ID`

---

## 📦 Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `/start` | Bienvenida con imagen |
| `/igs [link]/[actuales]/[comprados]/[@cliente]` | Crear pedido de Instagram |
| `/precios` | Ver tabla de precios |
| `/servicios` | Ver servicios disponibles |
| `/cmd` | Panel administrativo |
| `/status` | Estado del bot |

---

## 🧾 Uso del comando /igs

```
/igs https://instagram.com/usuario/1200/1000/@juan
```

| Parte | Ejemplo | Descripción |
|-------|---------|-------------|
| link | `https://instagram.com/usuario` | Perfil de Instagram |
| actuales | `1200` | Seguidores actuales |
| comprados | `1000` | Seguidores comprados |
| cliente | `@juan` | Usuario del cliente |

También acepta:
```
/igs @usuario/500/2000/@cliente
```

---

## 💰 Tabla de precios

| Cantidad | Precio |
|----------|--------|
| 1,000 seguidores | $35 MXN |
| 2,000 seguidores | $60 MXN |
| 3,000 seguidores | $90 MXN |
| 5,000 seguidores | $150 MXN |

Para agregar más precios, edita `utils.js`:
```js
const PRICE_TABLE = {
  1000: "$35 MXN",
  2000: "$60 MXN",
  3000: "$90 MXN",
  5000: "$150 MXN",
  // Agrega más aquí:
  10000: "$280 MXN",
};
```

---

## ✅ Links aceptados

- `https://instagram.com/usuario`
- `https://www.instagram.com/usuario`
- `instagram.com/usuario`
- `@usuario`

## ❌ Links rechazados

- Reels: `instagram.com/reel/...`
- Posts: `instagram.com/p/...`
- Stories: `instagram.com/stories/...`
- Links inválidos o texto random

---

## 🛡️ Multi-admin

Para agregar más administradores, edita `config.js`:
```js
const ADMIN_IDS = [123456789, 987654321]; // Agrega más IDs
```

---

## 🔧 Variables de entorno (producción)

```bash
BOT_TOKEN=tu_token_aqui node bot.js
```

O crea un archivo `.env` con [dotenv](https://npmjs.com/package/dotenv):
```
BOT_TOKEN=tu_token_aqui
```

---

> ⚡ Bot 100% privado — Sin base de datos — Node.js puro
