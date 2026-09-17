import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, LockKeyhole, UserRound } from "lucide-react";
import { useApp } from "../context/AppContext";
import AuthModal from "./AuthModal";
import type { Lang } from "../../lib/i18n";

const copy: Record<Lang, {
  eyebrow: string; title: string; description: string; consent: string;
  login: string; guest: string; choose: string;
}> = {
  uz: {
    eyebrow: "Artisan hashamatli qandolat",
    title: "Candora olamiga xush kelibsiz",
    description: "Har bir shirinlik mehr, nafislik va dunyoning eng sara ingrediyentlari bilan tayyorlanadi.",
    consent: "Candora shartlariga roziman",
    login: "Kirish yoki ro'yxatdan o'tish", guest: "Mehmon sifatida kirish", choose: "Tilni tanlang",
  },
  en: {
    eyebrow: "Artisan luxury confectionery",
    title: "Welcome to Candora",
    description: "Handcrafted sweets made with care, elegance, and the finest ingredients from around the world.",
    consent: "I agree to Candora's terms",
    login: "Sign in or create an account", guest: "Continue as a guest", choose: "Choose language",
  },
  ru: {
    eyebrow: "Авторская премиальная кондитерская",
    title: "Добро пожаловать в Candora",
    description: "Ручная работа, элегантность и лучшие ингредиенты со всего мира в каждом десерте.",
    consent: "Я согласен с условиями Candora",
    login: "Войти или создать аккаунт", guest: "Войти как гость", choose: "Выберите язык",
  },
};

export default function WelcomeGate({ children }: { children: ReactNode }) {
  const { lang, setLang, user, openAuth } = useApp();
  const [accepted, setAccepted] = useState(() => localStorage.getItem("candora_welcome_seen") === "true");
  const [consent, setConsent] = useState(false);
  const text = copy[lang];

  useEffect(() => {
    if (user) {
      localStorage.setItem("candora_welcome_seen", "true");
      setAccepted(true);
    }
  }, [user]);

  const continueAsGuest = () => {
    if (!consent) return;
    localStorage.setItem("candora_welcome_seen", "true");
    setAccepted(true);
  };

  if (accepted) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,hsl(var(--primary)/.18),transparent_35%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--card)))]" />
      <div className="relative min-h-screen max-w-6xl mx-auto px-6 py-8 flex flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-[166px] flex items-center gap-2 rounded-lg border border-primary/60 bg-black/80 px-1.5">
              <img src="/candora-logo.jpg" alt="Candora" className="h-8 w-8 object-cover" />
              <span className="font-display text-xl font-bold text-[#f4ead7]">Candora</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-card/70 border border-border p-1" aria-label={text.choose}>
            {(["uz", "en", "ru"] as Lang[]).map((code) => (
              <button key={code} onClick={() => setLang(code)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${lang === code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-center py-12">
          <motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <p className="text-xs uppercase tracking-[.24em] text-primary font-semibold mb-5">{text.eyebrow}</p>
            <h1 className="font-display text-5xl sm:text-7xl leading-[.95] font-bold max-w-2xl">{text.title}</h1>
            <p className="mt-7 text-muted-foreground max-w-lg text-base leading-relaxed">{text.description}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="border border-border rounded-full px-3 py-2">2018 yildan beri</span>
              <span className="border border-border rounded-full px-3 py-2">Toshkent</span>
              <span className="border border-border rounded-full px-3 py-2">Premium quality</span>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .12, duration: .6 }} className="bg-card/85 backdrop-blur border border-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-7"><LockKeyhole size={18} className="text-primary" /><div><p className="font-semibold">Candora</p><p className="text-xs text-muted-foreground">Your sweet account</p></div></div>
            <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer mb-6">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-primary" />
              <span>{text.consent}</span>
            </label>
            <button disabled={!consent} onClick={() => openAuth("login")} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <UserRound size={16} /> {text.login}
            </button>
            <button disabled={!consent} onClick={continueAsGuest} className="w-full mt-3 py-3.5 rounded-2xl border border-border font-semibold disabled:opacity-40 hover:bg-muted transition-colors">
              {text.guest}
            </button>
          </motion.section>
        </main>
      </div>
      <AuthModal />
    </div>
  );
}
