import { createClient } from "@supabase/supabase-js";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || "lvluoarlzrhiqtriphbm";
const ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_53MLGGZx_i3H38XZ8kXX9Q_yLcur3_d";

const SUPABASE_URL = `https://${PROJECT_ID}.supabase.co`;
export const API_BASE = `${SUPABASE_URL}/functions/v1/server`;

export const supabase = createClient(SUPABASE_URL, ANON_KEY);

const headers = async (): Promise<Record<string, string>> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token ?? ANON_KEY}`,
  };
};

const request = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...(await headers()), ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Server request failed");
  return data;
};

export const api = {
  saveProfile: async (_userId: string, profile: object) => {
    return request("/profile", {
      method: "POST",
      body: JSON.stringify(profile),
    });
  },
  getProfile: async (_userId: string) => request("/profile"),
  saveCart: async (_userId: string, items: object[]) => {
    return request("/cart", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },
  getCart: async (_userId: string) => request("/cart"),
  createOrder: async (_userId: string, order: object) => {
    return request("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    });
  },
  getOrders: async (_userId: string) => request("/orders"),
  createCustomOrder: async (order: object) => request("/custom-orders", {
    method: "POST",
    body: JSON.stringify(order),
  }),
  getAdminOverview: async () => request("/admin/overview"),
  joinLottery: async (email: string, prize?: string) => {
    return request("/lottery", {
      method: "POST",
      body: JSON.stringify({ email, prize }),
    });
  },
};

