const mineflayer = require('mineflayer');
const express = require('express');

// ==========================================
// CẤU HÌNH THÔNG TIN BOT
// ==========================================
const botArgs = {
  host: 'rune.pikamc.vn', 
  port: 25078,               
  username: 'gulimen', 
  version: '1.20.1' // Hãy chắc chắn bản gốc Modpack của bạn khớp với bản này hoặc gần đúng
};

const BOT_PASSWORD = 'skibidisisdi'; 

let bot;

function initBot() {
  console.log(`\n[${new Date().toLocaleTimeString()}] --- Đang kết nối đến ${botArgs.host}:${botArgs.port} ---`);
  
  bot = mineflayer.createBot(botArgs);

  // 1. Khi kết nối thành công và xuất hiện
  bot.on('spawn', () => {
    console.log(`[HỆ THỐNG] Bot "${bot.username}" đã vào server thành công!`);
    setTimeout(() => {
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
      bot.chat(`/login ${BOT_PASSWORD}`);
    }, 2000);
  });

  // 2. Theo dõi log chat
  bot.on('chat', (username, message) => {
    console.log(`[CHAT] <${username}>: ${message}`);
  });

  // 3. LOG CHI TIẾT KHI BỊ NGẮT KẾT NỐI (Kiểm tra xem đóng socket ở giai đoạn nào)
  bot.on('end', (reason) => {
    console.log(`[NGẮT KẾT NỐI] Lý do: ${reason}`);
    console.log(`[HỆ THỐNG] Sẽ thử kết nối lại sau 10 giây...`);
    setTimeout(initBot, 10000); 
  });

  // 4. LOG LỖI HỆ THỐNG TOÀN DIỆN (Bắt mã lỗi chặn IP)
  bot.on('error', (err) => {
    console.log(`\n⚠️ [PHÁT HIỆN LỖI HỆ THỐNG]:`);
    console.log(`- Thông điệp lỗi: ${err.message}`);
    console.log(`- Mã lỗi (Code): ${err.code}`);
    console.log(`- Chi tiết Object lỗi:`, JSON.stringify(err, null, 2));
    console.log(`----------------------------------------\n`);
  });
}

// Khởi chạy
initBot();

// ==========================================
// WEB SERVER GIỮ CHO RAILWAY SỐNG
// ==========================================
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot đang debug lỗi kết nối...'));
app.listen(PORT, () => console.log(`[WEB SERVER] Đang chạy tại cổng: ${PORT}`));
