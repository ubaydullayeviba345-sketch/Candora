"""
Candora.uz — Maxsus Admin Telegram Boti
Bot Username: @v9x2q7n4kp_bot
Token: 8897130943:AAEAaIC_fyU5Yp8fQ4A9lXKjbGoQpioNEOU
"""

import telebot
from telebot import types
import datetime
import requests
import sys

BOT_TOKEN = "8897130943:AAEAaIC_fyU5Yp8fQ4A9lXKjbGoQpioNEOU"
bot = telebot.TeleBot(BOT_TOKEN, parse_mode="HTML")

# FAQAT RUXSAT ETILGAN ADMINLARNING TELEGRAM ID RAQAMLARI:
ALLOWED_USERS = [
    7767810012,  # Sizning Telegram ID'ingiz (@candora_uz)
    # Boshqa adminlar bo'lsa, ularning ID'sini ham shu ro'yxatga qo'shishingiz mumkin
]

SUPABASE_API = "https://lvluoarlzrhiqtriphbm.supabase.co/functions/v1/server"
ANON_KEY = "sb_publishable_53MLGGZx_i3H38XZ8kXX9Q_yLcur3_d"


def is_admin(user_id: int) -> bool:
    return user_id in ALLOWED_USERS


def get_admin_keyboard():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    btn_stats = types.KeyboardButton("📊 Statistika")
    btn_subscribers = types.KeyboardButton("🎁 So'nggi Lotereya A'zolari")
    btn_test = types.KeyboardButton("🔔 Test Bildirishnoma")
    btn_myid = types.KeyboardButton("🆔 Mening ID'im")
    markup.add(btn_stats, btn_subscribers)
    markup.add(btn_test, btn_myid)
    return markup


# ── RUXSAT BERILMAGANLAR UCHUN ───────────────────────────────────────────────

@bot.message_handler(func=lambda msg: not is_admin(msg.from_user.id))
def unauthorized_access(message):
    user = message.from_user
    warning_text = (
        "⛔ <b>Kechirasiz, ushbu bot faqat Candora.uz ma'muriyati uchun!</b>\n\n"
        f"👤 <b>Sizning ma'lumotlaringiz:</b>\n"
        f"• Ism: <b>{user.first_name}</b>\n"
        f"• Username: @{user.username or 'yo‘q'}\n"
        f"• Sizning ID raqamingiz: <code>{user.id}</code>\n\n"
        "💡 <i>Agar siz do'kon egasi bo'lsangiz, shu ID raqamingizni ALLOWED_USERS ro'yxatiga qo'shing.</i>"
    )
    bot.reply_to(message, warning_text)


# ── RUXSAT ETILGAN ADMIN BUYRUQLARI ──────────────────────────────────────────

@bot.message_handler(commands=["start", "help"])
def handle_start(message):
    user = message.from_user
    welcome_text = (
        f"👋 <b>Assalomu alaykum, {user.first_name}!</b>\n\n"
        "✨ <b>Candora.uz Admin Boshqaruv Botiga xush kelibsiz!</b>\n\n"
        "✅ Siz tizimda <b>tasdiqlangan admin</b>siz.\n"
        "Saytda kimdir lotereyada qatnashsa yoki buyurtma bersa, darhol sizga shu yerga bildirishnoma keladi.\n\n"
        "Quyidagi menyu orqali boshqarishingiz mumkin:"
    )
    bot.send_message(message.chat.id, welcome_text, reply_markup=get_admin_keyboard())


@bot.message_handler(func=lambda msg: is_admin(msg.from_user.id) and msg.text == "🆔 Mening ID'im")
def handle_my_id(message):
    bot.reply_to(
        message,
        f"🆔 Sizning Telegram ID: <code>{message.from_user.id}</code>\n"
        f"👤 Username: @{message.from_user.username or 'yo‘q'}\n"
        "✅ <b>Holat: Ruxsat berilgan (Admin)</b>"
    )


@bot.message_handler(func=lambda msg: is_admin(msg.from_user.id) and msg.text == "🔔 Test Bildirishnoma")
def handle_test_notification(message):
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    sample_text = (
        "🎉 <b>Candora oilasiga yangi a'zo qo'shildi!</b>\n\n"
        "• <b>Email:</b> <code>mijoz@candora.uz</code>\n"
        "• <b>Yutug'i:</b> Bepul qimmatroq tort 🎂\n"
        f"• <b>Vaqt:</b> {now}\n\n"
        "<i>(Bu saytdan keladigan bildirishnoma namunasi — bot to'liq ishlamoqda! ✅)</i>"
    )
    bot.send_message(message.chat.id, sample_text)


@bot.message_handler(func=lambda msg: is_admin(msg.from_user.id) and msg.text == "📊 Statistika")
def handle_statistics(message):
    bot.send_chat_action(message.chat.id, "typing")
    try:
        res = requests.get(
            f"{SUPABASE_API}/admin/overview",
            headers={"Authorization": f"Bearer {ANON_KEY}"},
            timeout=8
        )
        data = res.json() if res.ok else {}
        users_count = data.get("users", 0)
        orders_count = data.get("orders", 0)

        text = (
            "📊 <b>Candora.uz Do'koni Statistikasi</b>\n\n"
            f"👥 Jami foydalanuvchilar: <b>{users_count}</b> ta\n"
            f"📦 Buyurtmalar soni: <b>{orders_count}</b> ta\n"
            f"📅 Sana: <b>{datetime.datetime.now().strftime('%d.%m.%Y')}</b>\n\n"
            "<i>Sayt faol va yangi a'zolar qabul qilinmoqda!</i>"
        )
        bot.send_message(message.chat.id, text)
    except Exception as e:
        bot.send_message(message.chat.id, f"⚠️ Ma'lumot olishda xatolik: {str(e)}")


@bot.message_handler(func=lambda msg: is_admin(msg.from_user.id) and msg.text == "🎁 So'nggi Lotereya A'zolari")
def handle_recent_subscribers(message):
    bot.send_message(
        message.chat.id,
        "🎁 <b>Lotereya Tizimi:</b>\n\n"
        "Saytda 100% yutuqli lotereya faol! Har bir yangi mijoz emailini kiritib tugmani bosishi bilan shu yerga avtomatik bildirishnoma keladi."
    )


# ── ISHGA TUSHIRISH ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    print(f"Candora Telegram boti ishga tushdi...")
    print(f"Ruxsat berilgan adminlar: {ALLOWED_USERS}")
    sys.stdout.flush()
    try:
        bot.infinity_polling(skip_pending=True)
    except Exception as e:
        print(f"Xatolik yuz berdi: {e}")
