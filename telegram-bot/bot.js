const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = '8897130943:AAGgnqljWXy8IfPAEmq807tgvg2V2paQxoM';
const ADMIN_ID = 7767810012;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const DATA_FILE = path.join(__dirname, 'db.json');

function loadDB() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch(e) {}
  return { blocked: [] };
}
function saveDB(db) { fs.writeFileSync(DATA_FILE, JSON.stringify(db), 'utf8'); }

let db = loadDB();

bot.onText(/\/start/, (msg) => {
  const userId = msg.from.id;
  
  if (userId !== ADMIN_ID) {
    bot.sendMessage(userId, "⛔ Ruxsat yo'q.");
    bot.sendMessage(ADMIN_ID, "🚨 Ruxsatsiz urinish!\nID: `" + userId + "`\nUser: @" + (msg.from.username || "yo'q") + "\nIsm: " + (msg.from.first_name || ""), { parse_mode: 'Markdown' });
    
    if (!db.blocked.find(u => u.id === userId)) {
      db.blocked.push({ id: userId, user: msg.from.username, time: new Date().toISOString() });
      saveDB(db);
    }
    return;
  }

  const opts = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: "👥 Barcha Foydalanuvchilar", callback_data: "users" }],
        [{ text: "📊 Statistika", callback_data: "stats" }, { text: "🚫 Bloklanganlar", callback_data: "blocked" }]
      ]
    }
  };
  bot.sendMessage(ADMIN_ID, "*Candora Admin Panel*", opts);
});

bot.on('callback_query', (q) => {
  if (q.from.id !== ADMIN_ID) return;
  const d = q.data;
  
  if (d === 'blocked') {
    let t = "*Bloklanganlar:*\n";
    if (db.blocked.length === 0) t += "Hech kim yo'q.";
    db.blocked.forEach((b, i) => { t += (i+1) + ". ID: `" + b.id + "` (@" + b.user + ")\n"; });
    bot.sendMessage(ADMIN_ID, t, { parse_mode: 'Markdown' });
  } else if (d === 'stats') {
    bot.sendMessage(ADMIN_ID, "*Statistika:*\nBloklangan ruxsatsiz urinishlar: " + db.blocked.length + "\n(Qolgan ma'lumotlar bevosita Supabase orqali keladi)", { parse_mode: 'Markdown' });
  } else if (d === 'users') {
    bot.sendMessage(ADMIN_ID, "Hozirgi foydalanuvchilar ma'lumoti asosan tizimga kimdir kirganda xabar qilinadi.");
  }
  bot.answerCallbackQuery(q.id);
});

console.log("Bot ishga tushdi (Admin Mode)...");
