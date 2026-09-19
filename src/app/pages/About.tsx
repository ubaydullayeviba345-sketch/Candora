import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";

export default function About() {
  const { lang } = useApp();
  const t = useT(lang);

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-muted">
          <img src="https://images.unsplash.com/photo-1531594652722-292a43e752b4?w=1400&h=600&fit=crop&auto=format"
            alt="About Candora" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/70 to-background" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
              <Sparkles size={11} /> {t.about.badge}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">{t.about.title}</h1>
            <p className="text-muted-foreground text-xl leading-relaxed">{t.about.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Est. 2018</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">{t.about.storyTitle}</h2>
            <p className="text-muted-foreground leading-relaxed text-base">{t.about.storyText}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted shadow-2xl">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&auto=format"
                alt="Candora signature cake" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-card border border-border rounded-2xl p-5 shadow-xl">
              <p className="text-3xl font-bold font-display text-primary">7+</p>
              <p className="text-xs text-muted-foreground mt-1">{lang === "uz" ? "yil tajriba" : lang === "ru" ? "лет опыта" : "years of experience"}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">{t.about.missionTitle}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed italic font-display">
              &ldquo;{t.about.missionText}&rdquo;
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles size={14} className="text-primary" />
              </div>
              <span className="font-semibold text-sm">Ibrahim Ubaydullayev, Founder</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            {lang === "uz" ? "Qadriyatlar" : lang === "ru" ? "Наши ценности" : "Our Values"}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            {lang === "uz" ? "Biz Nimaga Ishonamiz" : lang === "ru" ? "Во что мы верим" : "What We Stand For"}
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: t.about.value1, desc: t.about.value1Desc, emoji: "⭐" },
            { title: t.about.value2, desc: t.about.value2Desc, emoji: "🎨" },
            { title: t.about.value3, desc: t.about.value3Desc, emoji: "🤝" },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="text-4xl mb-5">{item.emoji}</div>
              <h3 className="font-display font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "2,400+", label: lang === "uz" ? "Mamnun Mijozlar" : lang === "ru" ? "Довольных клиентов" : "Happy Clients" },
            { value: "98%", label: lang === "uz" ? "Mamnuniyat darajasi" : lang === "ru" ? "Удовлетворённость" : "Satisfaction rate" },
            { value: "14+", label: lang === "uz" ? "Mahsulot liniyalari" : lang === "ru" ? "Линейки продуктов" : "Product lines" },
            { value: "7", label: lang === "uz" ? "Yil tajriba" : lang === "ru" ? "Лет опыта" : "Years of craft" },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-4xl font-bold">{s.value}</p>
              <p className="text-primary-foreground/70 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
