const mineflayer = require('mineflayer');
const express = require('express');

const botArgs = {
  host: 'rune.pikamc.vn',
  port: 25078,
  username: 'gulimen',
  version: '1.21.2',
  auth: 'offline',
  
  // Tăng cường fix cho 1.21.2
  physicsEnabled: false,
  checkTimeoutInterval: 60000,
  closeTimeout: 120000,
  hideErrors: false,
  skipValidation: true,           // Thêm cái này
  connectTimeout: 30000,
};

const BOT_PASSWORD = 'skibidisisdi'; 

let bot;

function initBot() {
  console.log('--- Đang khởi tạo bot Minecraft 1.21.2 ---');
  
  bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log(`[HỆ THỐNG] Bot "${bot.username}" đã vào server thành công!`);
    setTimeout(() => {
      console.log('[XÁC THỰC] Gửi register/login...');
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
      bot.chat(`/login ${BOT_PASSWORD}`);
    }, 3000); // Tăng delay một chút
  });

  bot.on('chat', (username, message) => {
    console.log(`[CHAT] <${username}>: ${message}`);
  });

  bot.on('end', (reason) => {
    console.log(`[DISCONNECT] Lý do: ${reason}`);
    if (reason === 'socketClosed') {
      console.log('⚠️ Socket closed - Thường do protocol 1.21.2');
    }
    setTimeout(initBot, 8000);
  });

  bot.on('error', (err) => {
    console.error('[LỖI]:', err.message);
    if (err.code) console.error('Code:', err.code);
  });

  bot.on('kicked', (reason) => {
    console.error('[KICKED]:', JSON.stringify(reason));
  });

  // Resource Pack + Configuration
  bot.on('resourcePack', () => {
    console.log('✅ Chấp nhận resource pack...');
    bot.acceptResourcePack();
  });

  bot.on('disconnect', (packet) => {
    console.log('[DISCONNECT PACKET]:', packet);
  });
}

initBot();

// Web server (Railway)
const app = express();
const PORT = process.env.PORT || 8080;  // Railway thường dùng 8080
app.get('/', (req, res) => res.send('<h3>✅ Bot Mineflayer 1.21.2 đang chạy</h3>'));
app.listen(PORT, () => console.log(`[WEB SERVER] Đang chạy tại cổng: ${PORT}`));
