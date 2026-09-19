import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Gift,
  Check,
  Copy,
  Send,
  Loader2,
  X,
  ExternalLink,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { drawPrize, isValidEmail, type Prize } from "../../lib/lottery";
import { api } from "../../lib/supabase";

export default function LotterySection() {
  const { lang } = useApp();
  const t = useT(lang);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [copied, setCopied] = useState(false);

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
      // safe fallback if confetti fails in some environments
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
      // 1. Draw 100% win prize according to distribution rules
      const prize = drawPrize();

      // 2. Send to backend (Supabase Edge Function + Telegram Bot Notification)
      const res = await api.joinLottery(trimmed, prize.name.uz || prize.name.en).catch(() => null);

      if (res?.alreadySubscribed) {
        setIsAlreadySaved(true);
      } else {
        setIsAlreadySaved(false);
      }

      setWonPrize(prize);
      setIsModalOpen(true);
      fireConfetti();
    } catch {
      // Even if network fails, client prize is guaranteed
      const prize = drawPrize();
      setWonPrize(prize);
      setIsModalOpen(true);
      fireConfetti();
    } finally {
      setLoading(false);
    }
  };

  const copyPromoCode = () => {
    if (!wonPrize?.promoCode) return;
    navigator.clipboard.writeText(wonPrize.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative overflow-hidden py-24 my-12 mx-4 sm:mx-6 rounded-[2.5rem] max-w-7xl lg:mx-auto border border-[#78350f]/30 bg-gradient-to-br from-[#1c120c] via-[#2a170e] to-[#180f0a] text-stone-100 shadow-2xl">
      {/* Decorative luxury glowing backgrounds */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-gradient-to-tr from-orange-700/20 via-amber-700/10 to-transparent blur-3xl pointer-events-none" />

      {/* Grid Pattern overlay for depth */}
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
            { icon: "🎂", title: lang === "uz" ? "Qimmatroq tort" : lang === "ru" ? "Премиум торт" : "Free Cake", chance: "10%" },
            { icon: "🥐", title: lang === "uz" ? "Mazali pishiriq" : lang === "ru" ? "Выпечка" : "Pastry", chance: "20%" },
            { icon: "🍫✨", title: lang === "uz" ? "Trend shirinlik" : lang === "ru" ? "Эксклюзив" : "Exclusive", chance: "5%" },
            { icon: "🎟️", title: lang === "uz" ? "50 000 so'm bonus" : lang === "ru" ? "Бонус 50 000" : "50k Bonus", chance: "65%" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm justify-center"
            >
              <span className="text-base">{item.icon}</span>
              <div className="text-left">
                <p className="font-semibold text-stone-200 truncate">{item.title}</p>
                <p className="text-[10px] text-amber-400 font-bold">{item.chance}</p>
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
                ? "100% kafolatlangan sovrin. Har bir email faqat bir marta yutadi."
                : lang === "ru"
                ? "100% гарантированный приз. Каждый email участвует один раз."
                : "100% guaranteed prize. Each email can win once."}
            </span>
          </div>
        </form>
      </div>

      {/* POPUP / MODAL: Yutuq Oynasi */}
      <AnimatePresence>
        {isModalOpen && wonPrize && (
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

              {/* Glowing circle behind prize */}
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/30 flex items-center justify-center text-5xl mb-5 shadow-lg border border-orange-500/30 animate-bounce">
                {wonPrize.icon}
              </div>

              {/* Badge */}
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-orange-600/20 border border-orange-500/40 text-amber-300 mb-3">
                {wonPrize.badge[lang] || wonPrize.badge.uz}
              </span>

              {/* Title */}
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {isAlreadySaved ? t.lottery.alreadyParticipated : t.lottery.congratsTitle}
              </h3>

              {/* Prize Name */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/60 via-amber-950/40 to-orange-950/60 border border-orange-500/30 my-4 shadow-inner">
                <p className="text-xs text-amber-400/90 font-medium mb-1">{t.lottery.wonLabel}</p>
                <p className="text-xl font-bold text-white">{wonPrize.name[lang] || wonPrize.name.uz}</p>
                <p className="text-xs text-stone-300/80 mt-2 leading-relaxed">
                  {wonPrize.description[lang] || wonPrize.description.uz}
                </p>
              </div>

              {/* Promo code block if present */}
              {wonPrize.promoCode && (
                <div className="mb-5 p-3 rounded-xl bg-black/40 border border-dashed border-amber-500/50 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] text-stone-400">{t.lottery.promoCodeLabel}</p>
                    <p className="font-mono font-bold text-amber-300 text-sm tracking-wider">
                      {wonPrize.promoCode}
                    </p>
                  </div>
                  <button
                    onClick={copyPromoCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-xs font-semibold text-amber-200 transition-colors"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copied ? t.lottery.copied : t.lottery.copyCode}</span>
                  </button>
                </div>
              )}

              {/* Instructions */}
              <p className="text-xs text-stone-400 leading-relaxed mb-6">
                {t.lottery.claimInstructions}
              </p>

              {/* Action: Telegram Channel button */}
              <div className="space-y-2.5">
                <a
                  href="https://t.me/candora_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#229ED9] to-[#0088cc] hover:from-[#1e8bc0] hover:to-[#0077b5] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95"
                >
                  <Send size={16} />
                  <span>{t.lottery.joinTelegram}</span>
                  <ExternalLink size={14} className="opacity-80" />
                </a>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors"
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

