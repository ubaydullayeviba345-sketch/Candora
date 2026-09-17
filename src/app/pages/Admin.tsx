import { FormEvent, useEffect, useState } from "react";
import { BarChart3, Box, CheckCircle2, LogOut, Package, ShieldCheck, Users } from "lucide-react";
import { PRODUCTS } from "../../lib/data";
import { supabase, api } from "../../lib/supabase";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [overview, setOverview] = useState({ users: 0, orders: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      api.getAdminOverview().then((data) => {
        setOverview({ users: data.users ?? 0, orders: data.orders ?? 0 });
        setAuthenticated(true);
      }).catch(() => supabase.auth.signOut());
    });
  }, []);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) { setError("Email yoki parol noto‘g‘ri"); return; }
    try {
      const data = await api.getAdminOverview();
      setOverview({ users: data.users ?? 0, orders: data.orders ?? 0 });
      setAuthenticated(true);
    } catch (requestError) {
      await supabase.auth.signOut();
      setError(requestError instanceof Error ? requestError.message : "Admin access required");
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/.2),transparent_42%)]" />
        <form onSubmit={handleLogin} className="relative w-full max-w-md bg-card border border-border rounded-3xl p-7 shadow-2xl">
          <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><ShieldCheck size={20} className="text-primary-foreground" /></div><div><p className="font-display text-xl font-bold">Candora Admin</p><p className="text-xs text-muted-foreground">Boshqaruv paneliga kirish</p></div></div>
          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>}
          <label className="block text-xs text-muted-foreground mb-1.5">Admin email</label>
          <input autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:border-primary mb-4" />
          <label className="block text-xs text-muted-foreground mb-1.5">Parol</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:border-primary mb-6" />
          <button className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90">Kirish</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"><ShieldCheck size={18} className="text-primary-foreground" /></div><div><p className="font-display text-xl font-bold">Candora Admin</p><p className="text-xs text-muted-foreground">Boshqaruv markazi</p></div></div>
          <button onClick={() => { void supabase.auth.signOut(); setAuthenticated(false); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive"><LogOut size={15} /> Chiqish</button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="mb-8"><p className="text-xs uppercase tracking-[.2em] text-primary font-semibold">Overview</p><h1 className="font-display text-4xl font-bold mt-2">Candora boshqaruvi</h1><p className="text-muted-foreground mt-2">Mahsulotlar va sayt holatini shu yerdan nazorat qiling.</p></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{ label: "Mahsulotlar", value: PRODUCTS.length, icon: Package }, { label: "Kategoriyalar", value: new Set(PRODUCTS.map((product) => product.category)).size, icon: Box }, { label: "Foydalanuvchilar", value: overview.users, icon: Users }, { label: "Buyurtmalar", value: overview.orders, icon: BarChart3 }].map(({ label, value, icon: Icon }) => <div key={label} className="bg-card border border-border rounded-2xl p-5"><Icon size={18} className="text-primary mb-5" /><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div>)}
        </div>
        <section className="bg-card border border-border rounded-2xl overflow-hidden"><div className="px-6 py-5 border-b border-border flex items-center justify-between"><div><h2 className="font-semibold">Mahsulotlar katalogi</h2><p className="text-xs text-muted-foreground mt-1">Hozirgi katalog ko‘rinishi</p></div><Users size={18} className="text-muted-foreground" /></div><div className="divide-y divide-border">{PRODUCTS.map((product) => <div key={product.id} className="px-6 py-4 flex items-center gap-4"><img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="font-medium truncate">{product.name}</p><p className="text-xs text-muted-foreground capitalize">{product.category}</p></div><p className="font-semibold text-primary">${product.price}</p><span className="text-xs text-emerald-500">Faol</span></div>)}</div></section>
      </div>
    </main>
  );
}
