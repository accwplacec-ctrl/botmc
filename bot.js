const mineflayer = require('mineflayer');
const express = require('express');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');

const botArgs = {
  host: 'rune.pikamc.vn',
  port: 25078,
  username: 'gulimen',
  version: '1.21.2',
  auth: 'offline',
  physicsEnabled: false,
  checkTimeoutInterval: 90000,
  closeTimeout: 180000,
  skipValidation: true,
  connectTimeout: 45000,
};

const BOT_PASSWORD = 'skibidisisdi'; 

let bot;

function initBot() {
  console.log('--- Đang khởi tạo bot Minecraft 1.21.2 ---');
  
  bot = mineflayer.createBot(botArgs);

  // Khởi tạo Viewer khi bot spawn
  bot.once('spawn', () => {
    console.log(`✅ Bot "${bot.username}" đã vào server!`);

    // Mở viewer trên port 3007
    mineflayerViewer(bot, { 
      port: 3007, 
      firstPerson: true,     // true = góc nhìn thứ nhất (như bot nhìn)
      // firstPerson: false  // false = góc nhìn chim (third person)
    });
    console.log('🌐 Viewer đã mở tại: http://localhost:3007 (hoặc Railway domain)');

    setTimeout(() => {
      bot.chat(`/login ${BOT_PASSWORD}`);
    }, 4000);
  });

  bot.on('chat', (username, message) => {
    console.log(`[CHAT] <${username}>: ${message}`);
  });

  bot.on('kicked', (reason) => {
    console.error('🚨 BỊ KICK:', typeof reason === 'object' ? JSON.stringify(reason) : reason);
  });

  bot.on('end', (reason) => {
    console.log(`[DISCONNECT] Lý do: ${reason}`);
    setTimeout(initBot, 10000);
  });

  bot.on('error', (err) => {
    console.error('[LỖI]:', err.message);
  });

  bot.on('resourcePack', () => {
    console.log('✅ Chấp nhận resource pack...');
    bot.acceptResourcePack();
  });
}

initBot();

// Web server (Railway + Viewer)
const app = express();
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => res.send('<h3>✅ Bot Mineflayer + Viewer đang chạy</h3>'));
app.listen(PORT, () => console.log(`[WEB SERVER] Đang chạy tại cổng: ${PORT}`));
