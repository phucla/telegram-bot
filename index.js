const { Telegraf } = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
const { scrapeWebsite } = require('./src/scrapeWebsite')

require('dotenv').config(); 
// Use environment variables for security in a real project
const bot = new Telegraf(process.env.BOT_TOKEN);

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
bot.launch();
console.log('Bot is up and running...');