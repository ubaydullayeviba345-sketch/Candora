import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";

const app = new Hono();

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

const BASE = "/server";

const getUserId = async (c: Context) => {
  const authorization = c.req.header("Authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return null;

  const { createClient } = await import("jsr:@supabase/supabase-js@2");
  const auth = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user } } = await auth.auth.getUser();
  return user?.id ?? null;
};

const requireUser = async (c: Context) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Authentication required" }, 401);
  return userId;
};

const requireAdmin = async (c: Context) => {
  const authorization = c.req.header("Authorization");
  if (!authorization?.startsWith("Bearer ")) return c.json({ error: "Authentication required" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const adminEmail = Deno.env.get("ADMIN_EMAIL")?.toLowerCase();
  if (!supabaseUrl || !anonKey) return c.json({ error: "Authentication is not configured" }, 503);

  const { createClient } = await import("jsr:@supabase/supabase-js@2");
  const auth = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return c.json({ error: "Authentication required" }, 401);

  // Local development fallback: if no ADMIN_EMAIL is configured, allow any authenticated user.
  // In production, the secret should still be set so only the real admin can access the panel.
  if (!adminEmail) return user;
  if (user.email?.toLowerCase() !== adminEmail) return c.json({ error: "Admin access required" }, 403);
  return user;
};

// Health check
app.get(`${BASE}/health`, (c) => c.json({ status: "ok" }));

app.get(`${BASE}/admin/overview`, async (c) => {
  const admin = await requireAdmin(c);
  if (typeof admin !== "object" || !admin) return admin;
  const [profiles, orders] = await Promise.all([
    kv.getByPrefix("profile:"),
    kv.getByPrefix("order:"),
  ]);
  return c.json({ users: profiles.length, orders: orders.length });
});

// ── Profile ──────────────────────────────────────────────────────────────────

app.post(`${BASE}/profile`, async (c) => {
  const userId = await requireUser(c);
  if (typeof userId !== "string") return userId;
  const { firstName, lastName, phone, email, avatar } = await c.req.json();
  await kv.set(`profile:${userId}`, {
    firstName, lastName, phone, email, avatar,
    updatedAt: new Date().toISOString(),
  });
  return c.json({ success: true });
});

app.get(`${BASE}/profile`, async (c) => {
  const userId = await requireUser(c);
  if (typeof userId !== "string") return userId;
  const profile = await kv.get(`profile:${userId}`);
  return c.json({ profile: profile ?? null });
});

// ── Cart ─────────────────────────────────────────────────────────────────────

app.post(`${BASE}/cart`, async (c) => {
  const userId = await requireUser(c);
  if (typeof userId !== "string") return userId;
  const { items } = await c.req.json();
  if (!Array.isArray(items)) return c.json({ error: "items must be an array" }, 400);
  await kv.set(`cart:${userId}`, {
    items,
    updatedAt: new Date().toISOString(),
  });
  return c.json({ success: true });
});

app.get(`${BASE}/cart`, async (c) => {
  const userId = await requireUser(c);
  if (typeof userId !== "string") return userId;
  const data = await kv.get(`cart:${userId}`);
  return c.json({ items: data?.items ?? [] });
});

// ── Orders ───────────────────────────────────────────────────────────────────

app.post(`${BASE}/orders`, async (c) => {
  const body = await c.req.json();
  const userId = await requireUser(c);
  if (typeof userId !== "string") return userId;
  const { items, total, paymentMethod, deliveryAddress } = body;
  if (!Array.isArray(items) || !Number.isFinite(total) || total < 0) {
    return c.json({ error: "Invalid order data" }, 400);
  }

  const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const order = {
    id: orderId,
    userId,
    items,
    total,
    paymentMethod,
    deliveryAddress,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await kv.set(`order:${orderId}`, order);

  const existing: string[] = (await kv.get(`orders:${userId}`)) ?? [];
  await kv.set(`orders:${userId}`, [...existing, orderId]);

  return c.json({ success: true, orderId });
});

app.get(`${BASE}/orders`, async (c) => {
  const userId = await requireUser(c);
  if (typeof userId !== "string") return userId;
  const orderIds: string[] = (await kv.get(`orders:${userId}`)) ?? [];
  if (orderIds.length === 0) return c.json({ orders: [] });

  const orders = await kv.mget(orderIds.map((id) => `order:${id}`));
  const sorted = orders.filter(Boolean).reverse();
  return c.json({ orders: sorted });
});

// ── Custom Orders ─────────────────────────────────────────────────────────────

app.post(`${BASE}/custom-orders`, async (c) => {
  const body = await c.req.json();
  const required = ["name", "email", "phone", "occasion", "details", "budget", "date"];
  if (required.some((field) => typeof body[field] !== "string" || !body[field].trim())) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  if (body.details.trim().length < 20) return c.json({ error: "Details must contain at least 20 characters" }, 400);
  const id = `custom_${Date.now()}`;
  const userId = await getUserId(c);
  await kv.set(`custom_order:${id}`, { ...body, userId, id });

  const existing: string[] = (await kv.get("custom_orders:all")) ?? [];
  await kv.set("custom_orders:all", [...existing, id]);

  return c.json({ success: true, id });
});

// ── Lottery / Candora Family Subscribers ─────────────────────────────────────

app.post(`${BASE}/lottery`, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return c.json({ error: "Email noto'g'ri kiritildi" }, 400);
  }

  // Check if subscriber already exists
  const existingSub = await kv.get(`subscriber:${email}`);
  if (existingSub) {
    return c.json({
      success: true,
      alreadySubscribed: true,
      prize: existingSub.prize,
      message: "Siz avval ham qatnashgansiz! Sizning yutug'ingiz saqlangan.",
    });
  }

  // Prize calculation / validation
  const clientPrize = body.prize;
  let prizeName = "50 000 so‘mlik promokod / bonus 🎟️";
  let prizeId = "promo50k";

  if (clientPrize && typeof clientPrize === "object") {
    prizeName = clientPrize.name?.uz || clientPrize.name || prizeName;
    prizeId = clientPrize.id || prizeId;
  } else if (typeof clientPrize === "string") {
    prizeName = clientPrize;
  }

  const newSubscriber = {
    email,
    prize: {
      id: prizeId,
      name: prizeName,
    },
    createdAt: new Date().toISOString(),
  };

  // Save to kv_store
  await kv.set(`subscriber:${email}`, newSubscriber);
  const allSubscribers: string[] = (await kv.get("subscribers:all")) ?? [];
  if (!allSubscribers.includes(email)) {
    await kv.set("subscribers:all", [...allSubscribers, email]);
  }

  // Telegram Bot Notification
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN") || "8897130943:AAEAaIC_fyU5Yp8fQ4A9lXKjbGoQpioNEOU";
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID") || "7767810012";

  try {
    const timeFormatted = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });
    const text = `🎉 *Candora oilasiga yangi a'zo qo'shildi!*\n\n• *Email:* \`${email}\`\n• *Yutug'i:* ${prizeName}\n• *Vaqt:* ${timeFormatted}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Telegram notification error:", err);
  }

  return c.json({
    success: true,
    email,
    prize: newSubscriber.prize,
  });
});

// ─── TELEGRAM WEBHOOKS ──────────────────────────────────────────────────────────

const PRIVATE_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "8897130943:AAGgnqljWXy8IfPAEmq807tgvg2V2paQxoM";
const PRIZE_BOT_TOKEN = Deno.env.get("PRIZE_BOT_TOKEN") || "8907374220:AAHKqBBP5YWYEk2XRstWeL9eBp5hyjmQkMg";
const ADMIN_ID = 7767810012;

async function tg(token: string, method: string, body: any) {
  return fetch("https://api.telegram.org/bot" + token + "/" + method, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).catch(()=>null);
}

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Candora Private Bot Webhook (Auth Notify)
app.post(`${BASE}/webhook/private-bot`, async (c) => {
  const update = await c.req.json().catch(() => ({}));
  
  if (update.message && update.message.text) {
    const userId = update.message.from?.id;
    if (userId !== ADMIN_ID) {
      // Rule: Ignore anyone else completely
      return c.json({ ok: true });
    }
    
    if (update.message.text === "/start") {
       await tg(PRIVATE_BOT_TOKEN, "sendMessage", {
         chat_id: ADMIN_ID,
         text: "Candora Auth Notify Bot (24/7 Cloud)\n\nBu bot faqat tizimga kirgan va ro'yxatdan o'tgan foydalanuvchilar haqida bildirishnoma beradi.",
       });
    }
  }
  return c.json({ ok: true });
});

// Candora Prizes Bot Webhook
app.post(`${BASE}/webhook/prize-bot`, async (c) => {
  const update = await c.req.json().catch(() => ({}));

  if (update.callback_query) {
    const cb = update.callback_query;
    const userId = cb.from.id;
    if (userId !== ADMIN_ID) return c.json({ ok: true });

    if (cb.data === "draw_prizes") {
      let users = (await kv.get("subscribers:all")) || [];
      if (users.length === 0) users = Array.from({length: 100}, (_, i) => "testuser" + (i+1) + "@gmail.com");
      users = shuffle(users);
      
      const mask = (u: string) => u.replace(/(.{3}).*(@.*)/, "$1***$2");
      const cakeWinners = users.splice(0, 10).map((u: string) => "🎂 " + mask(u));
      const pastryWinners = users.splice(0, 20).map((u: string) => "🥐 " + mask(u));
      const exclusiveWinners = users.splice(0, 40).map((u: string) => "🍫 " + mask(u));

      const uz = "🎉 *BU HAFTALIK CANDORA YUTUQLI O'YINI NATIJALARI* 🎉\n\n🎂 *Qimmatroq tort g'oliblari (10 ta):*\n" + (cakeWinners.join("\n") || "Yo'q") + "\n\n🥐 *Mazali pishiriq (20 ta):*\n" + (pastryWinners.join("\n") || "Yo'q") + "\n\n🍫 *Trend shirinlik (40 ta):*\n" + (exclusiveWinners.join("\n") || "Yo'q") + "\n\n🎟 *Qolgan barcha ishtirokchilarga 50 000 so'm bonus!*\n\nQatnashganingiz uchun rahmat,\n*Hurmat bilan, Candora rasmiy.*";
      const en = "🎉 *CANDORA WEEKLY GIVEAWAY RESULTS* 🎉\n\n🎂 *Premium Cake Winners (10):*\n" + (cakeWinners.join("\n") || "None") + "\n\n🥐 *Pastry Winners (20):*\n" + (pastryWinners.join("\n") || "None") + "\n\n🍫 *Exclusive Sweets (40):*\n" + (exclusiveWinners.join("\n") || "None") + "\n\n🎟 *All other participants get a 50k bonus!*\n\nThank you for participating,\n*Sincerely, Candora Official.*";
      const ru = "🎉 *РЕЗУЛЬТАТЫ ЕЖЕНЕДЕЛЬНОГО РОЗЫГРЫША CANDORA* 🎉\n\n🎂 *Победители Премиум тортов (10):*\n" + (cakeWinners.join("\n") || "Нет") + "\n\n🥐 *Выпечка (20):*\n" + (pastryWinners.join("\n") || "Нет") + "\n\n🍫 *Эксклюзив (40):*\n" + (exclusiveWinners.join("\n") || "Нет") + "\n\n🎟 *Остальные участники получают бонус 50 000 сум!*\n\nСпасибо за участие,\n*С уважением, официальная Candora.*";

      const finalMessage = uz + "\n\n" + en + "\n\n" + ru;
      await kv.set("last_draw_result", finalMessage);

      await tg(PRIZE_BOT_TOKEN, "sendMessage", {
        chat_id: ADMIN_ID,
        text: "✅ Natijalar tayyor! Quyidagi matnni guruhga yuborishingiz mumkin.",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "📢 Guruhga yuborish (Tasdiqlash)", callback_data: "send_to_group" }]]
        }
      });
      await tg(PRIZE_BOT_TOKEN, "sendMessage", { chat_id: ADMIN_ID, text: finalMessage, parse_mode: "Markdown" });
    }

    if (cb.data === "send_to_group") {
       await tg(PRIZE_BOT_TOKEN, "sendMessage", {
         chat_id: ADMIN_ID,
         text: "⚠️ Guruhga avtomatik yuborish uchun botni o'sha guruhga qo'shib, Admin qilishingiz va menga Guruh ID sini kodda kiritishingiz kerak. Hozircha yuqoridagi tayyor xabarni o'zingiz guruhga Forward qilib yuboring! 🚀"
       });
    }

    return c.json({ ok: true });
  }

  if (update.message && update.message.text) {
    const userId = update.message.from.id;
    
    if (userId !== ADMIN_ID) {
      await tg(PRIZE_BOT_TOKEN, "sendMessage", {
        chat_id: userId,
        text: "🎁 Prizlar (yutuqlar) hali aniqlanmoqda... Natijalar tez orada e'lon qilinadi!"
      });
      return c.json({ ok: true });
    }

    if (update.message.text === "/start" || update.message.text === "/admin") {
      const allSubscribers = (await kv.get("subscribers:all")) || [];
      const total = allSubscribers.length;

      await tg(PRIZE_BOT_TOKEN, "sendMessage", {
        chat_id: ADMIN_ID,
        text: "🏆 *Candora Prizes Admin Panel* (24/7 Cloud)\n\nHolat: Faol\nJami ishtirokchilar (Email orqali ro'yxatdan o'tganlar): *" + total + "* ta",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🎲 G'oliblarni aniqlash (Barcha tillarda)", callback_data: "draw_prizes" }]
          ]
        }
      });
    }
  }

  return c.json({ ok: true });
});

Deno.serve(app.fetch);

