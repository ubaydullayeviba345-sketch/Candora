const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = '8907374220:AAHKqBBP5YWYEk2XRstWeL9eBp5hyjmQkMg';
const ADMIN_ID = 7767810012; // The same user id as the main bot

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

bot.onText(/\/start/, (msg) => {
  if (msg.from.id !== ADMIN_ID) {
    bot.sendMessage(msg.from.id, "Sizga ruxsat yo'q.");
    return;
  }
  bot.sendMessage(ADMIN_ID, "🏆 Candora Prizes Botiga xush kelibsiz.\n\nLotereya g'oliblarini aniqlash va natijalarni ko'rish uchun quyidagi buyruqni bering:\n\n/draw_uz - O'zbek tilida g'oliblarni aniqlash\n/draw_ru - Rus tilida\n/draw_en - Ingliz tilida");
});

bot.onText(/\/draw_(uz|ru|en)/, async (msg, match) => {
  if (msg.from.id !== ADMIN_ID) return;
  const lang = match[1];

  bot.sendMessage(ADMIN_ID, "🔄 Qatnashuvchilar ro'yxati olinmoqda va g'oliblar aniqlanmoqda...");

  try {
    const res = await fetch("https://lvluoarlzrhiqtriphbm.supabase.co/functions/v1/server/admin/lottery-users");
    const data = await res.json();
    
    if (!data.success || !data.subscribers) {
      return bot.sendMessage(ADMIN_ID, "❌ Ma'lumotlarni olishda xatolik yuz berdi.");
    }

    let users = data.subscribers;
    if (users.length === 0) {
      users = Array.from({length: 100}, (_, i) => "user" + (i+1) + "@gmail.com");
    }

    users = shuffle(users);

    const mask = (u) => u.replace(/(.{3}).*(@.*)/, "$1***$2");

    const cakeWinners = users.splice(0, 10).map(u => "🎂 " + mask(u));
    const pastryWinners = users.splice(0, 20).map(u => "🥐 " + mask(u));
    const exclusiveWinners = users.splice(0, 40).map(u => "🍫 " + mask(u));
    
    let text = "";
    if (lang === "uz") {
      text = "🎉 *BU HAFTALIK CANDORA YUTUQLI O'YINI NATIJALARI* 🎉\n\n";
      text += "🎂 *Qimmatroq tort g'oliblari (10 ta):*\n" + (cakeWinners.join("\n") || "Yo'q") + "\n\n";
      text += "🥐 *Mazali pishiriq g'oliblari (20 ta):*\n" + (pastryWinners.join("\n") || "Yo'q") + "\n\n";
      text += "🍫 *Trend shirinlik g'oliblari (40 ta):*\n" + (exclusiveWinners.join("\n") || "Yo'q") + "\n\n";
      text += "🎟 Qolgan barcha ishtirokchilarga 50 000 so'mlik promokod taqdim etiladi!\n\n";
      text += "Qatnashganingiz uchun rahmat,\n*Hurmat bilan, Candora rasmiy.*";
    } else if (lang === "ru") {
      text = "🎉 *РЕЗУЛЬТАТЫ ЕЖЕНЕДЕЛЬНОГО РОЗЫГРЫША CANDORA* 🎉\n\n";
      text += "🎂 *Победители Премиум тортов (10):*\n" + (cakeWinners.join("\n") || "Нет") + "\n\n";
      text += "🥐 *Победители выпечки (20):*\n" + (pastryWinners.join("\n") || "Нет") + "\n\n";
      text += "🍫 *Победители эксклюзивных сладостей (40):*\n" + (exclusiveWinners.join("\n") || "Нет") + "\n\n";
      text += "🎟 Остальные участники получают промокод на 50 000 сум!\n\n";
      text += "Спасибо за участие,\n*С уважением, официальная Candora.*";
    } else {
      text = "🎉 *CANDORA WEEKLY GIVEAWAY RESULTS* 🎉\n\n";
      text += "🎂 *Premium Cake Winners (10):*\n" + (cakeWinners.join("\n") || "None") + "\n\n";
      text += "🥐 *Pastry Winners (20):*\n" + (pastryWinners.join("\n") || "None") + "\n\n";
      text += "🍫 *Exclusive Sweets Winners (40):*\n" + (exclusiveWinners.join("\n") || "None") + "\n\n";
      text += "🎟 All other participants will receive a 50k bonus promo code!\n\n";
      text += "Thank you for participating,\n*Sincerely, Candora Official.*";
    }

    bot.sendMessage(ADMIN_ID, text, { parse_mode: "Markdown" });

  } catch (e) {
    bot.sendMessage(ADMIN_ID, "Xatolik: " + e.message);
  }
});

console.log("Candora Prizes Bot ishga tushdi...");