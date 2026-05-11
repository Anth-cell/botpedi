// Configuración para PM2 (gestor de procesos en VPS)
module.exports = {
  apps: [
    {
      name: "telegram-bot",
      script: "bot.js",
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
