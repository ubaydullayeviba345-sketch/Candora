import { Link } from "react-router";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";

export default function NotFound() {
  const { lang } = useApp();
  const t = useT(lang);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="font-display text-8xl font-bold text-primary mb-4">404</p>
        <h1 className="font-display text-3xl font-bold mb-3">{t.common.notFound}</h1>
        <p className="text-muted-foreground mb-8">{t.common.notFoundDesc}</p>
        <Link to="/" className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
          {t.common.goHome}
        </Link>
      </motion.div>
    </div>
  );
}
