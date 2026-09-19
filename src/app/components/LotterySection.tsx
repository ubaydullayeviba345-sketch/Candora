import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Gift,
  Send,
  Loader2,
  X,
  ExternalLink,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { isValidEmail } from "../../lib/lottery";
import { api } from "../../lib/supabase";

export default function LotterySection() {
  const { lang } = useApp();
  const t = useT(lang);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f97316", "#ea580c", "#fbbf24", "#d97706", "#ffffff"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ["#f97316", "#fbbf24", "#ffffff"],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ["#ea580c", "#d97706", "#ffffff"],
        });
      }, 250);
    } catch {
      // safe fallback
    }
  };

  const openTelegramChannel = () => {
    // Try opening Telegram app directly via deep link, fallback to web
    const tgDeepLink = "tg://resolve?domain=candora_uz";
    const tgWebLink = "https://t.me/candora_uz";

    try {
      window.location.href = tgDeepLink;
      setTimeout(() => {
        window.open(tgWebLink, "_blank", "noopener,noreferrer");
      }, 500);
    } catch {
      window.open(tgWebLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError(t.lottery.errorInvalidEmail);
      return;
    }

    setLoading(true);

    try {
      const res = await api.joinLottery(trimmed, "Telegram kanalda aniqlanadi").catch(() => null);

      if (res?.alreadySubscribed) {
        setIsAlreadySaved(true);
      } else {
        setIsAlreadySaved(false);
      }

      setIsModalOpen(true);
      fireConfetti();
    } catch {
      setIsModalOpen(true);
      fireConfetti();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-24 my-12 mx-4 sm:mx-6 rounded-[2.5rem] max-w-7xl lg:mx-auto border border-[#78350f]/30 bg-gradient-to-br from-[#1c120c] via-[#2a170e] to-[#180f0a] text-stone-100 shadow-2xl">
      {/* Decorative glowing backgrounds */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-gradient-to-tr from-orange-700/20 via-amber-700/10 to-transparent blur-3xl pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-4xl mx-auto px-6 sm:px-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/40 bg-orange-950/60 backdrop-blur-md text-amber-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-inner"
        >
          <Sparkles size={14} className="text-orange-400 animate-pulse" />
          <span>{t.lottery.badge}</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5"
        >
          {t.lottery.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          className="text-stone-300/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {t.lottery.subtitle}
        </motion.p>

        {/* Prizes tier preview pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto mb-10 text-xs">
          {[
            { icon: "🎂", title: lang === "uz" ? "Qimmatroq tort" : lang === "ru" ? "Премиум торт" : "Free Cake" },
            { icon: "🥐", title: lang === "uz" ? "Mazali pishiriq" : lang === "ru" ? "Выпечка" : "Pastry" },
            { icon: "🍫✨", title: lang === "uz" ? "Trend shirinlik" : lang === "ru" ? "Эксклюзив" : "Exclusive" },
            { icon: "🎟️", title: lang === "uz" ? "50 000 so'm bonus" : lang === "ru" ? "Бонус 50 000" : "50k Bonus" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm justify-center"
            >
              <span className="text-base">{item.icon}</span>
              <div className="text-left">
                <p className="font-semibold text-stone-200 truncate">{item.title}</p>
                <p className="text-[10px] text-amber-400 font-bold">
                  {lang === "uz" ? "Kanalda aniqlanadi" : lang === "ru" ? "В Telegram канале" : "In Channel"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleJoin} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 p-1.5 rounded-2xl sm:rounded-full bg-black/40 border border-orange-500/30 backdrop-blur-xl shadow-2xl focus-within:border-orange-500 transition-all">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder={t.lottery.emailPlaceholder}
              disabled={loading}
              className="flex-1 px-5 py-3.5 rounded-xl sm:rounded-full bg-transparent text-white placeholder:text-stone-400 text-sm outline-none font-medium"
            />

            <button
              type="submit"
              disabled={loading}
              className="group relative px-8 py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-900/40 hover:from-orange-400 hover:to-amber-500 transition-all transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t.lottery.loading}</span>
                </>
              ) : (
                <>
                  <Gift size={16} className="group-hover:rotate-12 transition-transform" />
                  <span>{t.lottery.joinButton}</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-400 text-xs mt-3 font-medium"
            >
              {error}
            </motion.p>
          )}

          <div className="flex items-center justify-center gap-2 text-stone-400 text-[11px] mt-4">
            <ShieldCheck size={14} className="text-amber-500/80" />
            <span>
              {lang === "uz"
                ? "G'oliblar rasmiy Telegram kanalimizda jonli aniqlanadi!"
                : lang === "ru"
                ? "Победители будут определены в нашем официальном Telegram-канале!"
                : "Winners will be announced on our official Telegram channel!"}
            </span>
          </div>
        </form>
      </div>

      {/* POPUP / MODAL: Tabrik va Telegramga yo'naltirish */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#1f140e] border border-amber-600/40 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl text-center overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors text-stone-300"
              >
                <X size={16} />
              </button>

              {/* Glowing Icon */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/30 flex items-center justify-center text-4xl mb-4 shadow-lg border border-orange-500/30">
                🎉
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {isAlreadySaved ? t.lottery.alreadyParticipated : t.lottery.congratsTitle}
              </h3>

              {/* Info text: Sovg'alar Telegram kanalda tez orada aniqlanadi */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/60 via-amber-950/40 to-orange-950/60 border border-orange-500/30 my-4 shadow-inner text-left">
                <div className="flex items-start gap-3">
                  <BellRing size={22} className="text-amber-400 flex-shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <p className="text-sm font-semibold text-white leading-snug">
                      {t.lottery.infoText}
                    </p>
                    <p className="text-xs text-stone-300/80 mt-2 leading-relaxed">
                      {t.lottery.telegramPrompt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action: Telegram Channel Buttons */}
              <div className="space-y-3 mt-5">
                {/* Asosiy tugma: Telegram dasturini to'g'ridan-to'g'ri ochadi */}
                <button
                  onClick={openTelegramChannel}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#229ED9] via-[#0088cc] to-[#0077b5] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  <Send size={16} />
                  <span>{t.lottery.joinTelegram} (@candora_uz)</span>
                </button>

                {/* Alternativ havola: Brauzer orqali ochish */}
                <a
                  href="https://t.me/candora_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Brauzerda ko'rish (t.me/candora_uz)</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors"
                >
                  {t.lottery.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
