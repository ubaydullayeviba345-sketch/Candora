import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { normalizePhoneInput } from "../../lib/data";

export default function AuthModal() {
  const { authOpen, authTab, closeAuth, openAuth, login, register, resetPassword, loginWithGoogle, loginWithFacebook, loginWithDiscord, lang } = useApp();
  const t = useT(lang);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const reset = () => {
    setEmail(""); setPassword(""); setFirstName(""); setLastName("");
    setPhone("+998 "); setError(""); setShowPass(false);
    setNotice("");
  };

  const handleClose = () => {
    reset();
    closeAuth();
  };

  const handlePhoneChange = (v: string, input?: HTMLInputElement | null) => {
    const next = normalizePhoneInput(v, input ? input.selectionStart ?? v.length : null);
    setPhone(next.value);
    requestAnimationFrame(() => {
      if (input) input.setSelectionRange(next.caret, next.caret);
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await login(email, password).catch(() => ({ error: t.auth.errorGeneral }));
    setLoading(false);
    if (res.error) { setError(t.auth.errorInvalid); return; }
    reset(); closeAuth();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    setError(""); setNotice(""); setLoading(true);
    const res = await register(email, password, {
      firstName, lastName, phone, email,
    }).catch(() => ({ error: t.auth.errorGeneral }));
    setLoading(false);
    if (res.error) {
      setError(res.error.includes("already") ? t.auth.errorEmail : res.error);
      return;
    }
    if (res.needsConfirmation) {
      reset();
      setNotice(t.auth.confirmationSent);
      return;
    }
    reset(); closeAuth();
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    const res = await loginWithGoogle().catch(() => ({ error: t.auth.errorGeneral }));
    setLoading(false);
    if (res.error) setError(res.error);
  };

  const handleFacebook = async () => {
    setError("");
    setLoading(true);
    const res = await loginWithFacebook().catch(() => ({ error: t.auth.errorGeneral }));
    setLoading(false);
    if (res.error) setError(res.error);
  };

  const handleDiscord = async () => {
    setError("");
    setLoading(true);
    const res = await loginWithDiscord().catch(() => ({ error: t.auth.errorGeneral }));
    setLoading(false);
    if (res.error) setError(res.error);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError(t.auth.enterEmailForReset);
      return;
    }
    setError(""); setNotice(""); setLoading(true);
    const res = await resetPassword(email.trim()).catch(() => ({ error: t.auth.errorGeneral }));
    setLoading(false);
    if (res.error) setError(res.error);
    else setNotice(t.auth.resetSent);
  };

  return (
    <AnimatePresence>
      {authOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 360 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex gap-1 bg-muted rounded-xl p-1">
                  {(["login", "register"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setError(""); openAuth(tab); }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${authTab === tab ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {tab === "login" ? t.auth.login : t.auth.register}
                    </button>
                  ))}
                </div>
                <button type="button" aria-label="Close login modal" onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 pb-6 space-y-4">
                {/* OAuth buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={handleGoogle} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    {t.auth.google}
                  </button>
                  <button onClick={handleFacebook} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50">
                    <span className="font-bold text-blue-500">f</span>
                    {t.auth.facebook}
                  </button>
                  <button onClick={handleDiscord} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50">
                    <span className="font-bold text-indigo-400">◈</span>
                    {t.auth.discord}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">{t.auth.orWith}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}
                {notice && (
                  <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm">
                    {notice}
                  </div>
                )}

                {/* Login form */}
                {authTab === "login" && (
                  <form onSubmit={handleLogin} className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.auth.email}</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                        placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.auth.password}</label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-10 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                          placeholder="••••••••" minLength={6} />
                        <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <button type="button" onClick={handleResetPassword} disabled={loading}
                      className="text-xs text-primary underline underline-offset-2 disabled:opacity-50">
                      {t.auth.forgotPassword}
                    </button>
                    <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                      {loading && <Loader2 size={15} className="animate-spin" />}
                      {t.auth.loginBtn}
                    </button>
                    <p className="text-center text-xs text-muted-foreground">
                      {t.auth.noAccount}{" "}
                      <button type="button" onClick={() => { setError(""); openAuth("register"); }} className="text-primary underline underline-offset-2">{t.auth.signUp}</button>
                    </p>
                  </form>
                )}

                {/* Register form */}
                {authTab === "register" && (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.auth.firstName}</label>
                        <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                          placeholder="Ali" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.auth.lastName}</label>
                        <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                          placeholder="Karimov" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.auth.phone}</label>
                      <input type="tel" required value={phone} onChange={e => handlePhoneChange(e.target.value, e.target)}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors font-mono"
                        placeholder="+998 91 234 56 78" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.auth.email}</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                        placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.auth.password}</label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-10 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                          placeholder="••••••••" minLength={6} />
                        <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                      {loading && <Loader2 size={15} className="animate-spin" />}
                      {t.auth.registerBtn}
                    </button>
                    <p className="text-center text-xs text-muted-foreground">
                      {t.auth.haveAccount}{" "}
                      <button type="button" onClick={() => { setError(""); openAuth("login"); }} className="text-primary underline underline-offset-2">{t.auth.signIn}</button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
