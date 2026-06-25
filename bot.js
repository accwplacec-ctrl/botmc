const mineflayer = require('mineflayer');
const express = require('express');
const { webInventory } = require('mineflayer-web-inventory');

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

  bot.once('spawn', () => {
    console.log(`✅ Bot "${bot.username}" đã vào server thành công!`);

    // Web Inventory Viewer
    webInventory(bot, { port: 3007 });
    console.log('🌐 Inventory Viewer: http://your-domain:3007');

    setTimeout(() => {
      console.log('[XÁC THỰC] Gửi Register + Login...');
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
      bot.chat(`/login ${BOT_PASSWORD}`);
    }, 5000); // Delay 5 giây sau khi spawn
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

// Main Web Server
const app = express();
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => res.send('<h3>✅ Bot Mineflayer + Viewer đang chạy</h3>'));
app.listen(PORT, () => console.log(`[WEB SERVER] Đang chạy tại cổng: ${PORT}`));
