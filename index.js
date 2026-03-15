const { Telegraf } = require("telegraf");
const express = require("express");

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

const app = express();
app.use(express.json());

// Define bot behavior
bot.start((ctx) => ctx.reply("Hello! I’m your Telegraf bot on Vercel 🚀"));
bot.on("text", (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

// Webhook endpoint
app.post(`/webhook/${token}`, (req, res) => {
  bot.handleUpdate(req.body, res);
});

// Export for Vercel
module.exports = app;