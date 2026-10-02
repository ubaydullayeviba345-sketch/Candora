import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, LockKeyhole, Sparkles, UserRound } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Lang } from "../../lib/i18n";

const copy: Record<Lang, { eyebrow: string; title: string; description: string; consent: string; login: string; guest: string; choose: string; }> = {
  uz: { eyebrow: "Artisan hashamatli qandolat", title: "Candora olamiga xush kelibsiz", description: "Har bir shirinlik mehr, nafislik va dunyoning eng sara ingrediyentlari bilan tayyorlanadi.", consent: "", login: "Kirish yoki ro'yxatdan o'tish", guest: "Mehmon sifatida kirish", choose: "Tilni tanlang" },
  en: { eyebrow: "Artisan luxury confectionery", title: "Welcome to Candora", description: "Handcrafted sweets made with care, elegance, and the finest ingredients from around the world.", consent: "", login: "Sign in or create an account", guest: "Continue as a guest", choose: "Choose language" },
  ru: { eyebrow: "Авторская премиальная кондитерская", title: "Добро пожаловать в Candora", description: "Ручная работа, элегантность и лучшие ингредиенты со всего мира в каждом десерте.", consent: "", login: "Войти или создать аккаунт", guest: "Войти как гость", choose: "Выберите язык" }
};

export default function WelcomeGate({ children }: { children: ReactNode }) {
  const { lang, setLang, user, openAuth } = useApp();
  const [accepted, setAccepted] = useState(() => localStorage.getItem("candora_welcome_seen") === "true");
  const [consent, setConsent] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const text = copy[lang];

  useEffect(() => {
    if (user) { localStorage.setItem("candora_welcome_seen", "true"); setAccepted(true); }
  }, [user]);

  const continueAsGuest = () => {
    if (!consent) return;
    localStorage.setItem("candora_welcome_seen", "true");
    setAccepted(true);
  };

  const continueToLogin = () => {
    if (!consent) return;
    localStorage.setItem("candora_welcome_seen", "true");
    setAccepted(true);
    window.setTimeout(() => openAuth("login"), 0);
  };

  if (accepted) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=2000&q=80" 
          alt="Luxury Candora Background" 
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-background/30" />
      </div>
      <div className="relative z-10 min-h-screen max-w-6xl mx-auto px-6 py-8 flex flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"><Sparkles size={17} className="text-primary-foreground" /></div>
            <span className="font-display text-xl font-bold">Candora</span>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-card/70 border border-border p-1">
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
            <p className="mt-7 text-stone-300 max-w-lg text-base leading-relaxed">{text.description}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-stone-300">
              <span className="border border-border/40 bg-black/20 rounded-full px-3 py-2">2018 yildan beri</span>
              <span className="border border-border/40 bg-black/20 rounded-full px-3 py-2">Toshkent</span>
              <span className="border border-border/40 bg-black/20 rounded-full px-3 py-2">Premium quality</span>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .5, delay: .1 }} className="bg-[#140b05]/40 border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-7">
              <LockKeyhole size={18} className="text-primary" />
              <div>
                <p className="font-semibold">Candora</p>
                <p className="text-xs text-muted-foreground">Your sweet account</p>
              </div>
            </div>

            <button onClick={() => setTermsOpen(!termsOpen)} className="flex items-center justify-between w-full text-left text-sm font-semibold text-primary mb-5 hover:text-primary/80 transition-colors">
              <span>{lang === "uz" ? "Candora shartlarini ko'rish" : lang === "ru" ? "Посмотреть условия Candora" : "View Candora terms"}</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${termsOpen ? "rotate-180" : ""}`} />
            </button>
            {termsOpen && (
              <div className="text-xs text-muted-foreground bg-black/40 rounded-xl p-4 mb-6 space-y-3 border border-border/30">
                <p>{lang === "uz" ? "• Barcha mahsulotlar 100% halol va tabiiy masalliqlardan tayyorlanadi." : lang === "ru" ? "• Все продукты на 100% халяль и из натуральных ингредиентов." : "• All products are 100% halal and made with natural ingredients."}</p>
                <p>{lang === "uz" ? "• To'lov va yetkazib berish shartlari checkout bosqichida tasdiqlanadi." : lang === "ru" ? "• Условия оплаты и доставки подтверждаются при оформлении." : "• Payment and delivery terms are confirmed at checkout."}</p>
                <p>{lang === "uz" ? "• Rozilikni bekor qilish yoki savollar uchun Candora bilan bog'lanishingiz mumkin." : lang === "ru" ? "• Вы можете отозвать согласие или связаться с Candora по вопросам." : "• You can withdraw consent or contact Candora with questions."}</p>
              </div>
            )}
            
            <div className="flex items-start gap-4 mb-8 cursor-pointer" onClick={() => setConsent(!consent)}>
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  consent
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted-foreground/50 hover:border-primary/50"
                }`}
              >
                {consent && <Check size={16} strokeWidth={3} className="text-primary-foreground" />}
              </div>
              <p className="text-sm text-stone-300 leading-relaxed select-none">
                {lang === "uz" ? (
                  <>
                    Men <span className="underline decoration-stone-500 underline-offset-2 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setTermsOpen(true); }}>Foydalanish shartlariga</span> roziman,{" "}
                    <span className="underline decoration-stone-500 underline-offset-2 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setTermsOpen(true); }}>Maxfiylik siyosatini</span> o'qib chiqdim va yoshim 18 dan oshganini tasdiqlayman.
                  </>
                ) : lang === "ru" ? (
                  <>
                    Я согласен с <span className="underline decoration-stone-500 underline-offset-2 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setTermsOpen(true); }}>Условиями использования</span>, ознакомлен с{" "}
                    <span className="underline decoration-stone-500 underline-offset-2 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setTermsOpen(true); }}>Политикой конфиденциальности</span> и подтверждаю, что мне не менее 18 лет.
                  </>
                ) : (
                  <>
                    I agree to the <span className="underline decoration-stone-500 underline-offset-2 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setTermsOpen(true); }}>Terms of Use</span>, acknowledge the{" "}
                    <span className="underline decoration-stone-500 underline-offset-2 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setTermsOpen(true); }}>Privacy Policy</span>, and confirm I'm at least 18 years old.
                  </>
                )}
              </p>
            </div>

            <button disabled={!consent} onClick={continueToLogin} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <UserRound size={16} /> {text.login}
            </button>
            <button disabled={!consent} onClick={continueAsGuest} className="w-full mt-3 py-3.5 rounded-2xl border border-border/50 font-semibold disabled:opacity-40 hover:bg-white/5 transition-colors">
              {text.guest}
            </button>
          </motion.section>
        </main>
      </div>
    </div>
  );
}




