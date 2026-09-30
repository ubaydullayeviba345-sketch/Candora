import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2, Gift } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function PrizeVerification({ lang = "uz" }: { lang?: "uz" | "ru" | "en" }) {
  const [secretCode, setSecretCode] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const texts = {
    uz: {
      btn: "O'yinda qatnashish",
      generating: "Kod yaratilmoqda...",
      telegramBtn: "Telegram orqali tasdiqlash",
      waiting: "Telegram botda tasdiqlashingiz kutilmoqda...",
      successTitle: "Muvaffaqiyatli tasdiqlandi!",
      successDesc: "Siz haftalik o'yinda ishtirok etmoqdasiz. Omad tilaymiz!",
      errorMsg: "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
    },
    ru: {
      btn: "Участвовать в розыгрыше",
      generating: "Создание кода...",
      telegramBtn: "Подтвердить через Telegram",
      waiting: "Ожидание подтверждения в Telegram...",
      successTitle: "Успешно подтверждено!",
      successDesc: "Вы участвуете в еженедельном розыгрыше. Желаем удачи!",
      errorMsg: "Произошла ошибка. Пожалуйста, попробуйте еще раз."
    },
    en: {
      btn: "Join the Giveaway",
      generating: "Generating code...",
      telegramBtn: "Verify via Telegram",
      waiting: "Waiting for verification in Telegram...",
      successTitle: "Successfully verified!",
      successDesc: "You are now participating in the weekly giveaway. Good luck!",
      errorMsg: "An error occurred. Please try again."
    }
  };

  const t = texts[lang];

  const handleStartVerification = async () => {
    setIsLoading(true);
    setError(null);
    
    // Generate random 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      const { error: dbError } = await supabase
        .from("priz_verifications")
        .insert([{ secret_code: code }]);
        
      if (dbError) throw dbError;
      
      setSecretCode(code);
    } catch (err) {
      console.error(err);
      setError(t.errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!secretCode || isVerified) return;

    // Subscribe to changes on the priz_verifications table for our specific code
    const channel = supabase
      .channel(`verify-${secretCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'priz_verifications',
          filter: `secret_code=eq.${secretCode}`,
        },
        (payload) => {
          if (payload.new.is_verified) {
            setIsVerified(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [secretCode, isVerified]);

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!secretCode && !isVerified && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Gift className="text-primary" size={28} />
            </div>
            <p className="text-center text-muted-foreground mb-6 text-sm">
              {lang === "uz" ? "Telegram orqali profilingizni tasdiqlab o'yinda ishtirok eting!" : lang === "ru" ? "Подтвердите профиль через Telegram и участвуйте!" : "Verify your profile via Telegram to participate!"}
            </p>
            <button
              onClick={handleStartVerification}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {isLoading ? t.generating : t.btn}
            </button>
            {error && <p className="text-destructive text-sm mt-3">{error}</p>}
          </motion.div>
        )}

        {secretCode && !isVerified && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-xl text-center"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 relative z-10">
                <Send className="text-blue-500 ml-[-2px]" size={28} />
              </div>
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
            </div>
            <p className="font-semibold text-lg mb-2">{t.waiting}</p>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === "uz" ? "Quyidagi tugmani bosing va Telegram botda tasdiqlang." : lang === "ru" ? "Нажмите кнопку ниже и подтвердите в Telegram боте." : "Click the button below to verify in Telegram bot."}
            </p>
            <a
              href={`https://t.me/candoraprizes_bot?start=${secretCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#229ED9] text-white font-semibold rounded-xl hover:bg-[#1E8CC0] transition-colors shadow-lg shadow-blue-500/25"
            >
              <Send size={18} />
              {t.telegramBtn}
            </a>
          </motion.div>
        )}

        {isVerified && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 bg-green-500/10 border border-green-500/30 rounded-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-5 shadow-lg shadow-green-500/30"
            >
              <CheckCircle className="text-white" size={40} />
            </motion.div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{t.successTitle}</h3>
            <p className="text-green-600/80 dark:text-green-400/80 font-medium">
              {t.successDesc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
