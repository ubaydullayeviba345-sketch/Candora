import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { formatPhone } from "../../lib/data";
import { api } from "../../lib/supabase";

interface FormData {
  name: string; email: string; phone: string;
  occasion: string; details: string; budget: string; date: string;
}

export default function CustomOrders() {
  const { lang, user } = useApp();
  const t = useT(lang);

  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "+998 ",
    occasion: "", details: "", budget: "", date: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = t.customOrders.required;
    if (!form.email.trim()) e.email = t.customOrders.required;
    if (form.phone.length < 17) e.phone = t.customOrders.required;
    if (!form.occasion) e.occasion = t.customOrders.required;
    if (!form.details.trim() || form.details.length < 20) e.details = t.customOrders.required;
    if (!form.budget) e.budget = t.customOrders.required;
    if (!form.date) e.date = t.customOrders.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    try {
      await api.createCustomOrder({ ...form, submittedAt: new Date().toISOString(), userId: user?.id });
      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit the request.");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    `w-full px-4 py-3 rounded-xl bg-muted border text-sm outline-none focus:border-primary transition-colors ${err ? "border-destructive" : "border-border"}`;

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
          <Sparkles size={11} /> {t.customOrders.badge}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">{t.customOrders.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{t.customOrders.subtitle}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {success ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16 px-8 bg-card border border-border rounded-3xl">
            <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-5" />
            <h2 className="font-display text-3xl font-bold mb-3">{t.customOrders.successTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.customOrders.successDesc}</p>
            <button onClick={() => { setSuccess(false); setForm({ name: "", email: "", phone: "+998 ", occasion: "", details: "", budget: "", date: "" }); }}
              className="mt-8 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              {lang === "uz" ? "Yangi so'rov" : lang === "ru" ? "Новый запрос" : "New Request"}
            </button>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 space-y-5">

            {submitError && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{submitError}</p>}

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t.customOrders.name} error={errors.name}>
                <input value={form.name} onChange={e => set("name", e.target.value)} className={inputCls(errors.name)} placeholder="Ali Karimov" />
              </Field>
              <Field label={t.customOrders.email} error={errors.email}>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputCls(errors.email)} placeholder="ali@example.com" />
              </Field>
            </div>

            <Field label={t.customOrders.phone} error={errors.phone}>
              <input value={form.phone} onChange={e => {
                const raw = e.target.value;
                if (!raw.startsWith("+998")) { set("phone", "+998 "); return; }
                set("phone", formatPhone(raw.slice(4).replace(/\D/g, "")));
              }} className={`${inputCls(errors.phone)} font-mono`} placeholder="+998 91 234 56 78" />
            </Field>

            <Field label={t.customOrders.occasion} error={errors.occasion}>
              <select value={form.occasion} onChange={e => set("occasion", e.target.value)} className={inputCls(errors.occasion)}>
                <option value="">—</option>
                <option value="wedding">{t.customOrders.occasionWedding}</option>
                <option value="birthday">{t.customOrders.occasionBirthday}</option>
                <option value="corporate">{t.customOrders.occasionCorporate}</option>
                <option value="other">{t.customOrders.occasionOther}</option>
              </select>
            </Field>

            <Field label={t.customOrders.details} error={errors.details}>
              <textarea value={form.details} onChange={e => set("details", e.target.value)} rows={4}
                className={inputCls(errors.details)} placeholder={t.customOrders.detailsPlaceholder} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t.customOrders.budget} error={errors.budget}>
                <select value={form.budget} onChange={e => set("budget", e.target.value)} className={inputCls(errors.budget)}>
                  <option value="">—</option>
                  <option value="under100">{t.customOrders.budgetS}</option>
                  <option value="100-300">{t.customOrders.budgetM}</option>
                  <option value="300-700">{t.customOrders.budgetL}</option>
                  <option value="over700">{t.customOrders.budgetXL}</option>
                </select>
              </Field>
              <Field label={t.customOrders.date} error={errors.date}>
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={inputCls(errors.date)} />
              </Field>
            </div>

            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> {t.customOrders.submitting}</>
              ) : t.customOrders.submit}
            </motion.button>
          </motion.form>
        )}

        {/* What to expect */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { emoji: "📞", title: lang === "uz" ? "24 soat ichida aloqa" : lang === "ru" ? "Связь в 24 часа" : "Contact in 24h" },
            { emoji: "🎨", title: lang === "uz" ? "Dizayn muhokamasi" : lang === "ru" ? "Обсуждение дизайна" : "Design consultation" },
            { emoji: "✨", title: lang === "uz" ? "Maxsus tayyorlash" : lang === "ru" ? "Индивидуальное создание" : "Custom creation" },
          ].map(item => (
            <div key={item.title} className="bg-card border border-border rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-xs font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
