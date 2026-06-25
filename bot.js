const mineflayer = require('mineflayer');
const express = require('express');

// ==========================================
// CẤU HÌNH BOT
// ==========================================
const botArgs = {
  host: 'rune.pikamc.vn',     // IP server của bạn
  port: 25078,
  username: 'gulimen',        // Tên bot
  version: '1.21.2',          // Phiên bản server yêu cầu
  auth: 'offline',            // Thường là offline cho server private
  // Các option giúp fix disconnect / packet error trên 1.21.2
  physicsEnabled: false,      // Tắt physics lúc đầu để tránh lỗi packet
  checkTimeoutInterval: 30000,
  closeTimeout: 120000,
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
    }, 2000);
  });

  bot.on('chat', (username, message) => {
    console.log(`[CHAT] <${username}>: ${message}`);
  });

  bot.on('end', (reason) => {
    console.log(`[DISCONNECT] Lý do: ${reason}`);
    console.log('Thử reconnect sau 10 giây...');
    setTimeout(initBot, 10000);
  });

  bot.on('error', (err) => {
    console.error('[LỖI]:', err.message);
  });

  // Xử lý resource pack (thường gây lỗi trên server 1.21+)
  bot.on('resourcePack', () => {
    console.log('Chấp nhận resource pack...');
    bot.acceptResourcePack();
  });
}

initBot();

// Web server giữ Railway alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('<h3>Bot Mineflayer 1.21.2 đang chạy ổn định!</h3>'));
app.listen(PORT, () => console.log(`Web server chạy tại port ${PORT}`));


bot.on('error', (err) => {
  console.error('[LỖI CHI TIẾT]:', err); // In toàn bộ Object lỗi ra log
});
