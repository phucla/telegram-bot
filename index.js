const { Telegraf } = require('telegraf');
const express = require('express')
require('dotenv').config(); 
 const { google } = require('googleapis');

const { scrapeWebsite } = require('./src/scrapeWebsite')

// Use environment variables for security in a real project
console.log('Starting bot with token:', process.env.BOT_TOKEN ? '***' : 'No token provided');
const bot = new Telegraf(process.env.BOT_TOKEN);
const port = 3000; // Or any desired port number
const webhookDomain = 'https://telegram-bot-7lru.onrender.com'
//const webhookDomain = 'http://localhost'


// Function to perform web scraping
// Khởi tạo Google Sheets API
// Load credentials from environment for flexibility. Supported options:
// 1) GOOGLE_CREDENTIALS_FILE - path to a service account JSON file (preferred)
// 2) GOOGLE_CREDENTIALS_JSON - raw JSON string of the service account credentials
// Falls back to local 'credentials.json' if neither is provided.
let auth;
if (process.env.GOOGLE_CREDENTIALS_JSON) {
    // If credentials JSON is provided directly in the env (useful on platforms
    // where a file can't be stored), parse and pass to GoogleAuth.
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
        auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
    } catch (err) {
        console.error('Failed to parse GOOGLE_CREDENTIALS_JSON:', err);
        throw err;
    }
} else {
    const keyFile = process.env.GOOGLE_CREDENTIALS_FILE || 'credentials.json';
    auth = new google.auth.GoogleAuth({
        keyFile, // path to service account file
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
}
const sheets = google.sheets({ version: 'v4', auth });

// ID của Google Sheet (lấy từ URL)
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Hàm ghi dữ liệu vào Google Sheet
async function appendToSheet(values, range) {
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'RAW',
        resource: {
            values: [values]
        }
    });
}

// Hàm ghi dữ liệu vào Google Sheet
async function updateToSheet(values, range) {
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'RAW',
        resource: {
            values: [values]
        }
    });
}

// Command handler for /start
bot.start((ctx) => {
    ctx.reply('Welcome! I am your new Node.js bot. Send me any message.');
});

// Command handler for /start
bot.command('sheet', async (ctx) => {

    const chatId = ctx.chat.id;
    const text = ctx.message.text;
    try {
        // Ví dụ: ghi username, message, thời gian
        const values = [ctx.from.username || ctx.from.first_name, text, new Date().toLocaleString()];
        await appendToSheet(values);
        ctx.reply("✅ Tin nhắn của bạn đã được lưu vào Google Sheet!");
    } catch (err) {
        console.error(err);
        ctx.reply("❌ Có lỗi xảy ra khi lưu dữ liệu.");
    }
});

bot.command('mua', async (ctx) => {

    const chatId = ctx.chat.id;
    const text = ctx.message.text;
    const parts = text.split(' ');
    if (parts.length < 3) {
        ctx.reply("❌ Vui lòng cung cấp giá mua. Ví dụ: /mua 58000000 2");
        return;
    }
    try {
        // Ví dụ: thời gian, giá mua,số lượng
        const values = [ new Date().toLocaleString().split(',')[0], parseInt(parts[1]), parseInt(parts[2])];
        await appendToSheet(values, 'Mua!A:C');
        ctx.reply("✅ Tin nhắn của bạn đã được lưu vào Google Sheet!");
    } catch (err) {
        console.error(err);
        ctx.reply("❌ Có lỗi xảy ra khi lưu dữ liệu.");
    }
});

bot.command('giavang', async (ctx) => {
    
    const targetUrl = 'https://ngocthinh-jewelry.vn/'; // Example target URL
    const giaVang = await scrapeWebsite(targetUrl);
    await updateToSheet([giaVang.giamuavao], 'Mua!F2:F3');
    ctx.replyWithMarkdown(`Giá mua vào: ${giaVang.giamuavao}\nGiá bán ra: ${giaVang.giabanra}`);
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