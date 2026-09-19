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

Deno.serve(app.fetch);

