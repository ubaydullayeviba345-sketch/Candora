import {
  createContext, useContext, useState, useEffect, useCallback,
  useRef, type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, api } from "../../lib/supabase";
import type { Lang } from "../../lib/i18n";
import type { CartItem, Product } from "../../lib/data";

export interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

interface AppState {
  user: User | null;
  profile: ProfileData | null;
  cartItems: CartItem[];
  dark: boolean;
  lang: Lang;
  authOpen: boolean;
  authTab: "login" | "register";
  cartOpen: boolean;
  orders: Order[];
  loadingAuth: boolean;
}

interface AppActions {
  setDark: (v: boolean) => void;
  setLang: (v: Lang) => void;
  openAuth: (tab?: "login" | "register") => void;
  closeAuth: () => void;
  setCartOpen: (v: boolean) => void;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string, password: string, profile: ProfileData
  ) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  loginWithFacebook: () => Promise<{ error?: string }>;
  loginWithDiscord: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  fetchOrders: () => Promise<void>;
  placeOrder: (order: {
    items: CartItem[]; total: number; paymentMethod: string; deliveryAddress: string;
  }) => Promise<{ success: boolean; orderId?: string }>;
}

const Ctx = createContext<(AppState & AppActions) | null>(null);

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [dark, setDarkState] = useState(true);
  const [lang, setLangState] = useState<Lang>("uz");
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [cartOpen, setCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const cartSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply dark mode to root
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Persist lang
  useEffect(() => {
    const saved = localStorage.getItem("candora_lang") as Lang | null;
    if (saved && ["en", "uz", "ru"].includes(saved)) setLangState(saved);
  }, []);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) void loadUserData(session.user);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) void loadUserData(session.user);
        else {
          setProfile(null);
          setCartItems([]);
          setOrders([]);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (currentUser: User) => {
    const metadata = currentUser.user_metadata ?? {};
    const metadataName = String(metadata.full_name ?? metadata.name ?? metadata.user_name ?? "").trim();
    const nameParts = metadataName ? metadataName.split(/\s+/) : [];
    const fallbackProfile: ProfileData = {
      firstName: String(metadata.firstName ?? nameParts[0] ?? ""),
      lastName: String(metadata.lastName ?? nameParts.slice(1).join(" ")),
      phone: String(metadata.phone ?? "+998 "),
      email: currentUser.email ?? "",
      avatar: String(metadata.avatar ?? ""),
    };
    let localProfile: Partial<ProfileData> = {};
    try {
      localProfile = JSON.parse(localStorage.getItem(`candora_profile:${currentUser.id}`) ?? "{}");
    } catch {
      localProfile = {};
    }
    const [profileRes, cartRes] = await Promise.allSettled([
      api.getProfile(currentUser.id),
      api.getCart(currentUser.id),
    ]);
    if (profileRes.status === "fulfilled" && profileRes.value?.profile) {
      setProfile({
        ...fallbackProfile,
        ...profileRes.value.profile,
        avatar: String(localProfile.avatar ?? fallbackProfile.avatar ?? ""),
        ...localProfile,
      });
    } else setProfile({ ...fallbackProfile, ...localProfile });
    if (cartRes.status === "fulfilled" && cartRes.value?.items) {
      setCartItems(cartRes.value.items);
    }
  };

  // Sync cart to backend debounced
  const syncCart = useCallback((userId: string, items: CartItem[]) => {
    if (cartSyncRef.current) clearTimeout(cartSyncRef.current);
    cartSyncRef.current = setTimeout(() => {
      api.saveCart(userId, items).catch(console.error);
    }, 800);
  }, []);

  const setDark = (v: boolean) => setDarkState(v);
  const setLang = (v: Lang) => {
    setLangState(v);
    localStorage.setItem("candora_lang", v);
  };

  const openAuth = (tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };
  const closeAuth = () => setAuthOpen(false);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const register = async (email: string, password: string, profileData: ProfileData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
        },
      },
    });
    if (error) return { error: error.message };
    if (data.user && data.session) {
      try {
        await api.saveProfile(data.user.id, profileData);
      } catch (profileError) {
        return { error: profileError instanceof Error ? profileError.message : "Profile save failed" };
      }
      setProfile(profileData);
    }
    return { needsConfirmation: !data.session };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    });
    return error ? { error: error.message } : {};
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { error: error.message } : {};
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    return error ? { error: error.message } : {};
  };

  const loginWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin },
    });
    return error ? { error: error.message } : {};
  };

  const loginWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: window.location.origin },
    });
    return error ? { error: error.message } : {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCartItems([]);
    setProfile(null);
    setOrders([]);
  };

  const addToCart = useCallback((product: Product) => {
    if (!user) { openAuth("login"); return; }
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      const next = exists
        ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }];
      if (user) syncCart(user.id, next);
      return next;
    });
    setCartOpen(true);
  }, [user, syncCart]);

  const removeFromCart = useCallback((id: number) => {
    setCartItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (user) syncCart(user.id, next);
      return next;
    });
  }, [user, syncCart]);

  const updateQty = useCallback((id: number, qty: number) => {
    setCartItems((prev) => {
      const next = qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => i.id === id ? { ...i, quantity: qty } : i);
      if (user) syncCart(user.id, next);
      return next;
    });
  }, [user, syncCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (user) api.saveCart(user.id, []).catch(console.error);
  }, [user]);

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user) return;
    const updated = { ...profile, ...data } as ProfileData;
    setProfile(updated);
    localStorage.setItem(`candora_profile:${user.id}`, JSON.stringify(updated));
    await supabase.auth.updateUser({
      data: { firstName: updated.firstName, lastName: updated.lastName, phone: updated.phone, avatar: updated.avatar },
    });
    try {
      await api.saveProfile(user.id, updated);
    } catch (error) {
      console.error("Profile sync failed:", error);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    const res = await api.getOrders(user.id);
    if (res?.orders) setOrders(res.orders);
  };

  const placeOrder = async (orderData: {
    items: CartItem[]; total: number; paymentMethod: string; deliveryAddress: string;
  }) => {
    if (!user) return { success: false };
    const res = await api.createOrder(user.id, orderData);
    if (res?.success) {
      clearCart();
      await fetchOrders();
      return { success: true, orderId: res.orderId };
    }
    return { success: false };
  };

  return (
    <Ctx.Provider value={{
      user, profile, cartItems, dark, lang, authOpen, authTab,
      cartOpen, orders, loadingAuth,
      setDark, setLang, openAuth, closeAuth, setCartOpen,
        login, register, resetPassword, updatePassword, loginWithGoogle, loginWithFacebook, loginWithDiscord, logout,
      addToCart, removeFromCart, updateQty, clearCart,
      updateProfile, fetchOrders, placeOrder,
    }}>
      {children}
    </Ctx.Provider>
  );
}
