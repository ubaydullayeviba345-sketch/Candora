import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Heart, Plus, Sparkles, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { PRODUCTS, type Product } from "../../lib/data";

const COLLECTION_CONFIGS = [
  {
    key: "wedding" as const,
    categories: ["cakes"],
    image: "https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=800&h=400&fit=crop&auto=format",
    color: "from-rose-900/80",
  },
  {
    key: "birthday" as const,
    categories: ["cakes", "macarons"],
    image: "https://images.unsplash.com/photo-1590741664176-7fbd7e2592a0?w=800&h=400&fit=crop&auto=format",
    color: "from-purple-900/80",
  },
  {
    key: "seasonal" as const,
    categories: ["macarons", "seasonal"],
    image: "https://images.unsplash.com/photo-1531594652722-292a43e752b4?w=800&h=400&fit=crop&auto=format",
    color: "from-amber-900/80",
  },
  {
    key: "gift" as const,
    categories: ["gifts", "chocolate"],
    image: "https://images.unsplash.com/photo-1570476922354-81227cdbb76c?w=800&h=400&fit=crop&auto=format",
    color: "from-emerald-900/80",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground opacity-30"} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart, user, openAuth } = useApp();
  const [wished, setWished] = useState(false);
  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      whileHover={{ y: -4 }} className="group relative rounded-2xl overflow-hidden bg-card border border-border flex flex-col">
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-primary text-primary-foreground">
          {product.badge}
        </span>
      )}
      <button onClick={() => setWished(w => !w)} aria-label="Wishlist" className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full backdrop-blur-md border flex items-center justify-center hover:scale-110 transition-all ${wished ? "bg-primary/20 border-primary/50" : "bg-background/75 border-border/50"}`}>
        <Heart size={12} className={wished ? "fill-primary text-primary" : "text-muted-foreground"} />
      </button>
      <div className="aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="font-semibold text-xs">{product.name}</p>
        <Stars rating={product.rating} />
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <span className="font-bold text-sm">${product.price}</span>
          <button onClick={() => { if (!user) { openAuth("login"); return; } addToCart(product); }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-85 transition-opacity">
            <Plus size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Collections() {
  const { lang } = useApp();
  const t = useT(lang);
  const [active, setActive] = useState<string | null>(null);

  const activeConfig = COLLECTION_CONFIGS.find(c => c.key === active);
  const products = active
    ? PRODUCTS.filter(p => activeConfig?.categories.includes(p.category))
    : [];

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
          <Sparkles size={11} /> {t.collections.badge}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">{t.collections.title}</h1>
        <p className="text-muted-foreground text-lg">{t.collections.subtitle}</p>
      </div>

      {/* Collection cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 gap-6 mb-16">
        {COLLECTION_CONFIGS.map(config => {
          const titleKey = `${config.key}` as keyof typeof t.collections;
          const descKey = `${config.key}Desc` as keyof typeof t.collections;
          return (
            <motion.div
              key={config.key}
              whileHover={{ scale: 1.01 }}
              onClick={() => setActive(active === config.key ? null : config.key)}
              className={`relative overflow-hidden rounded-3xl cursor-pointer border-2 transition-all ${active === config.key ? "border-primary" : "border-transparent"}`}
            >
              <div className="aspect-[16/7] bg-muted">
                <img src={config.image} alt={String(t.collections[titleKey])} className="w-full h-full object-cover" />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${config.color} to-transparent`} />
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <h3 className="text-white font-display text-2xl font-bold mb-1">{String(t.collections[titleKey])}</h3>
                  <p className="text-white/70 text-sm mb-4">{String(t.collections[descKey])}</p>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${active === config.key ? "bg-primary text-primary-foreground" : "bg-white/20 text-white backdrop-blur-sm"}`}>
                    {t.collections.shop} <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Products for active collection */}
      <AnimatePresence>
        {active && products.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold mb-6">
              {String(t.collections[`${active}` as keyof typeof t.collections])}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
