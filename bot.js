const mineflayer = require('mineflayer');
const express = require('express');

// ==========================================
// CẤU HÌNH THÔNG TIN BOT & MẬT KHẨU
// ==========================================
const botArgs = {
  host: 'rune.pikamc.vn', // <--- THAY BẰNG IP SERVER CỦA BẠN (Ví dụ: 'mczone.net')
  port: 25078,               // Cổng mặc định của Minecraft
  username: 'gulimen', // <--- TÊN BOT TRONG GAME (Nên đổi nếu tên này đã có người đăng ký)
  version: '1.21.2'          // <--- PHIÊN BẢN MINECRAFT CỦA SERVER
};

// Đặt mật khẩu cố định cho bot để tự động /register và /login
const BOT_PASSWORD = 'skibidisisdi'; 

let bot;

function initBot() {
  console.log('--- Đang khởi tạo kết nối đến Server Minecraft ---');
  bot = mineflayer.createBot(botArgs);

  // Sự kiện: Khi bot vừa đặt chân vào server thành công
  bot.on('spawn', () => {
    console.log(`[HỆ THỐNG] Bot "${bot.username}" đã kết nối vào server.`);
    
    // Đợi 2 giây để server tải xong dữ liệu màn hình, sau đó tự động xác thực tài khoản
    setTimeout(() => {
      console.log(`[XÁC THỰC] Đang tự động gửi lệnh Đăng ký / Đăng nhập...`);
      
      // Gửi cả 2 lệnh: Nếu tài khoản mới hoàn toàn sẽ tự Register, nếu cũ sẽ tự Login
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
      bot.chat(`/login ${BOT_PASSWORD}`);
    }, 2000);
  });

  // Sự kiện: CHỈ XEM LOG CHAT chứ KHÔNG tự động chat lại bất kỳ câu nào
  bot.on('chat', (username, message) => {
    // In toàn bộ cuộc hội thoại, thông báo, lệnh từ server ra màn hình Logs của Railway
    console.log(`[CHAT IN-GAME] <${username}>: ${message}`);
  });

  // Sự kiện: Tự động kết nối lại khi server reset, bảo trì hoặc bot bị kick
  bot.on('end', (reason) => {
    console.log(`[CẢNH BÁO] Bot bị mất kết nối khỏi server vì lý do: ${reason}`);
    console.log('[HỆ THỐNG] Sẽ tự động thử kết nối lại sau 10 giây...');
    setTimeout(initBot, 10000); 
  });

  // Sự kiện: Bắt lỗi hệ thống để tránh bot bị crash sập ứng dụng trên Railway
  bot.on('error', (err) => {
    console.error('[LỖI MẠNG/HỆ THỐNG]:', err.message);
  });
}

// Kích hoạt chạy bot
initBot();

// ==========================================
// WEB SERVER BẮT BUỘC ĐỂ GIỮ CHO RAILWAY KHÔNG BỊ CRASH
// ==========================================
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h3>Bot Mineflayer theo dõi Log đang chạy 24/7 trên Railway!</h3>');
});

app.listen(PORT, () => {
  console.log(`[WEB SERVER] Đang lắng nghe thành công tại cổng cổng mạng: ${PORT}`);
});
