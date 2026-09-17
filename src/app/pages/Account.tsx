import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { motion } from "motion/react";
import { User, ShoppingBag, Edit2, Check, X, LogOut, Loader2, Camera } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { formatPhone } from "../../lib/data";

export default function Account() {
  const { user, profile, lang, loadingAuth, updateProfile, logout, fetchOrders, orders } = useApp();
  const { updatePassword } = useApp();
  const t = useT(lang);
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "+998 " });

  useEffect(() => {
    if (profile) {
      setForm({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone });
      setAvatar(profile.avatar ?? localStorage.getItem(`candora_avatar:${user?.id}`) ?? "");
    }
  }, [profile, user?.id]);

  useEffect(() => { fetchOrders(); }, []);

  if (loadingAuth) return <div className="min-h-screen pt-24 text-center text-muted-foreground">{t.common.loading}</div>;
  if (!user) return <Navigate to="/" replace />;

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ ...form, avatar });
    setSaving(false);
    setEditing(false);
  };

  const handlePhoneChange = (v: string) => {
    if (!v.startsWith("+998")) { setForm(f => ({ ...f, phone: "+998 " })); return; }
    const after = v.slice(4).replace(/\D/g, "");
    setForm(f => ({ ...f, phone: formatPhone(after) }));
  };

  const handlePasswordSave = async () => {
    setPasswordError(""); setPasswordMessage("");
    if (newPassword.length < 6) {
      setPasswordError(t.account.passwordMin);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t.account.passwordMismatch);
      return;
    }
    const result = await updatePassword(newPassword);
    if (result.error) setPasswordError(result.error);
    else {
      setNewPassword(""); setConfirmPassword("");
      setPasswordMessage(t.account.passwordUpdated);
    }
  };

  const avatarOptions = [
    "https://api.dicebear.com/9.x/adventurer/svg?seed=CandoraMan",
    "https://api.dicebear.com/9.x/lorelei/svg?seed=CandoraWoman",
    "https://api.dicebear.com/9.x/notionists/svg?seed=CandoraHijab",
    "https://api.dicebear.com/9.x/bottts/svg?seed=CandoraBot",
  ];

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setAvatar(image);
      localStorage.setItem(`candora_avatar:${user.id}`, image);
      setAvatarOpen(false);
      void updateProfile({ avatar: image });
    };
    reader.readAsDataURL(file);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    processing: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    shipped: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    delivered: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">{t.account.profile}</p>
            <h1 className="font-display text-3xl font-bold">{t.account.profile}</h1>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
            <LogOut size={15} /> {t.account.logout}
          </button>
        </div>

        {/* User info card */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6 flex items-center gap-4">
          <button type="button" onClick={() => setAvatarOpen(true)} className="relative w-16 h-16 rounded-2xl bg-primary/20 overflow-hidden flex items-center justify-center text-primary text-xl font-bold flex-shrink-0 group" aria-label="Change avatar">
            {avatar ? <img src={avatar} alt="Profile avatar" className="w-full h-full object-cover" /> : (profile?.firstName?.[0] ?? user.email?.[0]?.toUpperCase() ?? "U")}
            <span className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={16} /></span>
          </button>
          <div>
            <p className="font-semibold text-base">{profile?.firstName} {profile?.lastName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {profile?.phone && <p className="text-xs text-muted-foreground mt-0.5">{profile.phone}</p>}
          </div>
        </div>

        {avatarOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setAvatarOpen(false)}>
            <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl" onClick={event => event.stopPropagation()}>
              <div className="flex items-center justify-between mb-5"><div><h2 className="font-semibold">Avatar tanlang</h2><p className="text-xs text-muted-foreground mt-1">Avatarni tanlang yoki fayldan yuklang.</p></div><button type="button" onClick={() => setAvatarOpen(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"><X size={16} /></button></div>
              <div className="grid grid-cols-4 gap-3">
                {avatarOptions.map((option, index) => <button type="button" key={option} onClick={() => { setAvatar(option); localStorage.setItem(`candora_avatar:${user.id}`, option); setAvatarOpen(false); void updateProfile({ avatar: option }); }} className={`aspect-square rounded-2xl overflow-hidden border-2 ${avatar === option ? "border-primary" : "border-border hover:border-primary/60"}`}><img src={option} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" /></button>)}
              </div>
              <label className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-border hover:border-primary hover:text-primary cursor-pointer text-sm font-medium transition-colors"><Camera size={16} /> Fayldan yuklash<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarUpload} className="hidden" /></label>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8 w-fit">
          {(["profile", "orders"] as const).map(tabKey => (
            <button key={tabKey} onClick={() => setTab(tabKey)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === tabKey ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {tabKey === "profile" ? <><User size={14} /> {t.account.profile}</> : <><ShoppingBag size={14} /> {t.account.orders}</>}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === "profile" && (
          <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">{t.account.profile}</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-sm text-primary hover:opacity-75 transition-opacity">
                  <Edit2 size={13} /> {t.account.editProfile}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(false)} className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
                    <X size={14} />
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    {t.account.save}
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { label: t.account.firstName, key: "firstName" as const },
                  { label: t.account.lastName, key: "lastName" as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
                    {editing ? (
                      <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors" />
                    ) : (
                      <p className="text-sm font-medium px-4 py-3 bg-muted/50 rounded-xl">{profile?.[key] || "—"}</p>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.account.phone}</label>
                {editing ? (
                  <input value={form.phone} onChange={e => handlePhoneChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors font-mono" />
                ) : (
                  <p className="text-sm font-medium px-4 py-3 bg-muted/50 rounded-xl font-mono">{profile?.phone || "—"}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.account.email}</label>
                <p className="text-sm font-medium px-4 py-3 bg-muted/50 rounded-xl text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </motion.div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold">{t.account.password}</h2>
            </div>
            <div className="p-6 space-y-4">
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              {passwordMessage && <p className="text-sm text-primary">{passwordMessage}</p>}
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder={t.account.newPassword} minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors" />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder={t.account.confirmPassword} minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors" />
              <button onClick={handlePasswordSave}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                {t.account.updatePassword}
              </button>
            </div>
          </div>
          </>
        )}

        {/* Orders tab */}
        {tab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {orders.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-2xl">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">{t.account.noOrders}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">{order.id.slice(0, 20)}…</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(
                            lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] ?? statusColors.pending}`}>
                          {t.account.status[order.status] ?? order.status}
                        </span>
                        <span className="font-bold text-primary">${order.total}</span>
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-xs text-muted-foreground mb-3">{order.items.length} {lang === "uz" ? "ta mahsulot" : lang === "ru" ? "товаров" : "items"}</p>
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {order.items.slice(0, 4).map(item => (
                          <div key={item.id} className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground font-medium">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      {order.deliveryAddress && (
                        <p className="text-xs text-muted-foreground mt-3 truncate">📍 {order.deliveryAddress}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
