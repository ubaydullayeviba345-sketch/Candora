import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  ShoppingCart, Search, Sun, Moon, Menu, X,
  User, LogOut, MapPin, Phone, Instagram, Twitter,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import type { Lang } from "../../lib/i18n";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";

const LANGS: { code: Lang; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export default function Layout() {
  const { user, profile, dark, setDark, lang, setLang, openAuth, logout, setCartOpen, cartItems } = useApp();
  const t = useT(lang);
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/#catalog", label: t.nav.catalog, scroll: true },
    { to: "/collections", label: t.nav.collections },
    { to: "/custom-orders", label: t.nav.customOrders },
    { to: "/about", label: t.nav.about },
  ];

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <motion.header
        initial={{ y: -70 }} animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          transparent ? "bg-transparent" : "bg-background/90 backdrop-blur-xl border-b border-border"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-10 w-[166px] flex items-center gap-2 rounded-lg border border-primary/60 bg-black/80 px-1.5">
              <img src="/candora-logo.jpg" alt="Candora" className="h-8 w-8 object-cover" />
              <span className="font-display text-xl font-bold tracking-tight text-[#f4ead7]">Candora</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Language switcher */}
            <div className="hidden sm:flex items-center bg-muted rounded-lg p-0.5 mr-1">
              {LANGS.map(({ code, label }) => (
                <button key={code} onClick={() => setLang(code)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${lang === code ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {label}
                </button>
              ))}
            </div>

            <button onClick={() => setSearchOpen(s => !s)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/70 transition-colors" aria-label="Search">
              <Search size={16} />
            </button>
            <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/70 transition-colors" aria-label="Toggle theme">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/70 transition-colors" aria-label="Cart">
              <ShoppingCart size={16} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User button */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(v => !v)}
                  className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center hover:bg-primary/25 transition-colors">
                  <span className="text-primary text-xs font-bold">
                    {profile?.firstName?.[0] ?? user.email?.[0]?.toUpperCase() ?? "U"}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-12 w-48 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold truncate">{profile?.firstName} {profile?.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link to="/account" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-muted transition-colors">
                        <User size={14} /> {t.nav.account}
                      </Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors">
                        <LogOut size={14} /> {t.nav.logout}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={() => openAuth("login")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                <User size={13} /> {t.nav.login}
              </button>
            )}

            <button onClick={() => setMenuOpen(m => !m)} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/70 transition-colors">
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-4">
                <input autoFocus type="search" placeholder={
                  lang === "uz" ? "Tort, makaron, shokolad qidirish…" :
                  lang === "ru" ? "Поиск тортов, макарон, шоколада…" :
                  "Search cakes, macarons, chocolates…"
                }
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl hover:bg-muted text-sm transition-colors">{label}</Link>
                ))}
                {/* Mobile lang */}
                <div className="flex gap-2 pt-2 px-3">
                  {LANGS.map(({ code, label }) => (
                    <button key={code} onClick={() => { setLang(code); setMenuOpen(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${lang === code ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {!user && (
                  <button onClick={() => { openAuth("login"); setMenuOpen(false); }}
                    className="w-full mt-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                    {t.nav.login}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-9 w-[154px] flex items-center gap-2 rounded-lg border border-primary/60 bg-black/80 px-1.5">
                  <img src="/candora-logo.jpg" alt="Candora" className="h-7 w-7 object-cover" />
                  <span className="font-display text-lg font-bold text-[#f4ead7]">Candora</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                {lang === "uz" ? "Artisan hashamatli shirinliklar. 2018 yildan beri sevgi bilan tayyorlanadi." :
                 lang === "ru" ? "Элитная кондитерская ручной работы. С любовью с 2018 года." :
                 "Artisan luxury confectionery. Crafted with love since 2018."}
              </p>
              <div className="flex items-center gap-3">
                <a href="https://ou.iba" target="_blank" rel="noopener noreferrer"
                  aria-label="Instagram" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-all">
                  <Instagram size={13} className="text-muted-foreground" />
                </a>
                <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-all">
                  <Twitter size={13} className="text-muted-foreground" />
                </a>
              </div>
            </div>

            <div>
              <p className="font-semibold text-sm mb-5">{t.footer.shop}</p>
              <ul className="space-y-3">
                {["Luxury Cakes", "Macarons", "Chocolates", "Gift Boxes", "Seasonal"].map(l => (
                  <li key={l}><Link to="/#catalog" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-sm mb-5">{t.footer.company}</p>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t.nav.about}</Link></li>
                <li><Link to="/collections" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t.nav.collections}</Link></li>
                <li><Link to="/custom-orders" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t.nav.customOrders}</Link></li>
                {user && <li><Link to="/account" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t.nav.account}</Link></li>}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-sm mb-5">{t.footer.contact}</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin size={12} className="mt-0.5 flex-shrink-0" />{t.footer.address}
                </li>
                <li className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone size={12} className="flex-shrink-0" />{t.footer.phone}
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border space-y-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{t.footer.rights}</p>
              <div className="flex items-center gap-5">
                {[t.footer.privacy, t.footer.terms, t.footer.cookies].map(l => (
                  <a key={l} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground/60">{t.footer.createdBy}</p>
          </div>
        </div>
      </footer>

      <AuthModal />
      <CartDrawer />
    </div>
  );
}
