const { Telegraf } = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express')
const { scrapeWebsite } = require('./src/scrapeWebsite')

require('dotenv').config(); 
// Use environment variables for security in a real project
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const port = 3000; // Or any desired port number
const webhookDomain = 'https://telegram-bot-7lru.onrender.com'

// Function to perform web scraping

// Command handler for /start
bot.start((ctx) => {
    ctx.reply('Welcome! I am your new Node.js bot. Send me any message.');
});

// Command handler for /start
bot.command('giavang', async (ctx) => {
    
    const targetUrl = 'https://ngocthinh-jewelry.vn/'; // Example target URL
    const scrapedData = await scrapeWebsite(targetUrl);
    ctx.replyWithMarkdown(scrapedData);
});

// Message handler for any text message
bot.on('text', (ctx) => {
    const { text } = ctx.message
    if (text === '/giavang ') {
        ctx.reply(`Gia vang hom nay:`);
    } else {
        ctx.reply(`You said: ${ctx.message.text}`);
    }

});

// Launch the bot
// bot.launch();
bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: webhookDomain,

    // Port to listen on; e.g.: 8080
    port: port,

    // Optional path to listen for.
    // `bot.secretPathComponent()` will be used by default
    // path: webhookPath,

    // Optional secret to be sent back in a header for security.
    // e.g.: `crypto.randomBytes(64).toString("hex")`
    // secretToken: randomAlphaNumericString,
  },
});
// app.use(await bot.createWebhook({ domain: 'webhookDomain' }));

bot.on("text", ctx => ctx.reply("Hello"));

// app.listen(port, () => console.log("Listening on port", port));
console.log('Bot is up and running port:', port);