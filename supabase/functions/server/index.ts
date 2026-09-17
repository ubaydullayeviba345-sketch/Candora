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
  if (!supabaseUrl || !anonKey || !adminEmail) return c.json({ error: "Admin access is not configured" }, 503);

  const { createClient } = await import("jsr:@supabase/supabase-js@2");
  const auth = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user } } = await auth.auth.getUser();
  if (!user || user.email?.toLowerCase() !== adminEmail) return c.json({ error: "Admin access required" }, 403);
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
  const { firstName, lastName, phone, email } = await c.req.json();
  await kv.set(`profile:${userId}`, {
    firstName, lastName, phone, email,
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

Deno.serve(app.fetch);
