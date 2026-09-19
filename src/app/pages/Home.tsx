import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, ArrowLeft, Star, Heart, Plus, ChevronRight,
  Truck, Shield, Gift, Phone, Sparkles, Package, Check, X, ShoppingCart,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, formatPrice, getProductTags, getProductText, type Product } from "../../lib/data";
import LotterySection from "../components/LotterySection";

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size}
          className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground opacity-30"} />
      ))}
    </div>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const { addToCart, user, openAuth, lang, toggleFavorite, isFavorite } = useApp();
  const t = useT(lang);
  const productText = getProductText(product, lang);

  const handleAdd = () => {
    if (!user) { openAuth("login"); return; }
    addToCart(product);
  };

  return (
    <motion.div
      layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      onClick={() => onOpen(product)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onOpen(product); }}
      tabIndex={0}
      role="button"
      className="group relative rounded-2xl overflow-hidden bg-card border border-border flex flex-col"
    >
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary text-primary-foreground">
          {product.badge}
        </span>
      )}
      <button onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }} aria-label="Wishlist"
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all hover:scale-110 ${isFavorite(product.id) ? "bg-primary/20 border-primary/50" : "bg-background/75 border-border/50"}`}>
        <Heart size={13} className={isFavorite(product.id) ? "fill-primary text-primary" : "text-muted-foreground"} />
      </button>
      <div className="aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={productText.name} loading="lazy"
          onError={event => { event.currentTarget.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&h=700&q=85"; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{productText.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{productText.description}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto pt-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="font-bold text-foreground text-sm sm:text-base break-words">{formatPrice(product.price, lang)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice, lang)}</span>
            )}
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={e => { e.stopPropagation(); handleAdd(); }}
            className="w-full sm:w-auto flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap hover:opacity-85 transition-opacity">
            <Plus size={11} /> {t.catalog.add}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { lang, addToCart, user, openAuth } = useApp();
  const t = useT(lang);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchTag = activeTag === "all" || getProductTags(p).includes(activeTag);
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchTag && matchSearch;
  });

  const visibleProducts = filtered.slice(0, 8);
  const productGallery = selectedProduct?.gallery ?? (selectedProduct ? [selectedProduct.image] : []);
  const selectedProductText = selectedProduct ? getProductText(selectedProduct, lang) : null;

  const changeProductImage = (direction: 1 | -1) => {
    if (productGallery.length < 2) return;
    setSelectedImage(current => (current + direction + productGallery.length) % productGallery.length);
  };

  const scrollToCatalog = () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-muted">
          <img src="https://images.unsplash.com/photo-1758568938040-fb8b7275ca5f?w=1600&h=900&fit=crop&auto=format"
            alt="Luxury confectionery background" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={11} /> {t.hero.badge}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.25rem] font-bold leading-[1.04] tracking-tight">
              {t.hero.title1}<br />
              <span className="italic text-primary">{t.hero.title2}</span><br />
              {t.hero.title3}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={scrollToCatalog}
                className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                {t.hero.shopNow} <ArrowRight size={15} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/custom-orders")}
                className="px-6 py-3.5 rounded-2xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                {t.hero.customOrders}
              </motion.button>
            </div>
            <div className="flex items-center gap-7 pt-1">
              {[{ v: "2,400+", l: t.hero.clients }, { v: "98%", l: t.hero.satisfaction }, { v: "14+", l: t.hero.productLines }].map((s, i) => (
                <div key={s.l} className="flex items-center gap-7">
                  {i > 0 && <div className="h-8 w-px bg-border" />}
                  <div>
                    <p className="text-2xl font-bold font-display">{s.v}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex justify-end">
            <div className="relative">
              <div className="relative w-[400px] h-[500px] rounded-3xl overflow-hidden bg-muted shadow-2xl">
                <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=1000&fit=crop&auto=format"
                  alt="Noir Velvet Cake" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#1a1208]/25 via-transparent to-[#b8842f]/10 pointer-events-none" />
              </div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="absolute -bottom-5 -left-10 bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-xl w-48">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Bestseller</p>
                <p className="font-semibold text-sm mt-1 leading-snug">Noir Velvet Cake</p>
                <div className="flex items-center gap-1.5 mt-2"><Stars rating={4.9} size={10} /><span className="text-xs text-muted-foreground">4.9</span></div>
                <p className="font-bold text-primary mt-1.5">$89</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-5 h-8 rounded-full border-2 border-border/50 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { Icon: Truck, title: t.features.delivery, desc: t.features.deliveryDesc },
            { Icon: Shield, title: t.features.quality, desc: t.features.qualityDesc },
            { Icon: Gift, title: t.features.gift, desc: t.features.giftDesc },
            { Icon: Phone, title: t.features.support, desc: t.features.supportDesc },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-primary" />
              </div>
              <div><p className="font-semibold text-sm">{title}</p><p className="text-xs text-muted-foreground mt-0.5">{desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{t.catalog.title}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">{t.catalog.subtitle} <span className="italic">{t.catalog.subtitle2}</span></h2>
          </div>
          <button onClick={() => navigate("/catalog")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            {t.catalog.viewAll} <ChevronRight size={14} />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              {t.categories[cat.key]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-6 -mt-4">
          {["all", "chocolate", "vegetarian", "gluten-free", "seasonal"].map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeTag === tag ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              {tag === "all" ? (lang === "uz" ? "Barcha xususiyatlar" : lang === "ru" ? "Все свойства" : "All features") : tag === "gluten-free" ? "Gluten-free" : tag === "vegetarian" ? (lang === "uz" ? "Vegetarian" : "Vegetarian") : tag === "chocolate" ? (lang === "uz" ? "Shokoladli" : lang === "ru" ? "Шоколадные" : "Chocolate") : (lang === "uz" ? "Mavsumiy" : lang === "ru" ? "Сезонные" : "Seasonal")}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <AnimatePresence>
            {visibleProducts.map(product => <ProductCard key={product.id} product={product} onOpen={productToOpen => { setSelectedProduct(productToOpen); setSelectedImage(0); }} />)}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <Package size={52} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">{lang === "uz" ? "Mahsulot topilmadi" : lang === "ru" ? "Ничего не найдено" : "No products found"}</p>
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl grid md:grid-cols-2"
            >
              <button onClick={() => setSelectedProduct(null)} aria-label="Close product details"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <X size={16} />
              </button>
              <div className="p-4 sm:p-6 bg-muted/40">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.img
                      key={`${selectedProduct.id}-${selectedImage}`}
                      initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
                      transition={{ duration: 0.22 }} src={productGallery[selectedImage]}
                      alt={`${selectedProduct.name} view ${selectedImage + 1}`} onError={event => { event.currentTarget.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&h=700&q=85"; }} className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  {productGallery.length > 1 && (
                    <>
                      <button onClick={() => changeProductImage(-1)} aria-label="Previous product image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 border border-border flex items-center justify-center shadow-sm hover:bg-background transition-colors">
                        <ArrowLeft size={16} />
                      </button>
                      <button onClick={() => changeProductImage(1)} aria-label="Next product image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 border border-border flex items-center justify-center shadow-sm hover:bg-background transition-colors">
                        <ArrowRight size={16} />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mt-4" aria-label="Product image position">
                  {productGallery.slice(0, 3).map((image, index) => (
                    <button key={`${image}-${index}`} onClick={() => setSelectedImage(index)} aria-label={`Show image ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all ${selectedImage === index ? "w-7 bg-primary" : "w-2.5 bg-muted-foreground/35 hover:bg-muted-foreground/60"}`} />
                  ))}
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                {selectedProduct.badge && <span className="self-start px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">{selectedProduct.badge}</span>}
                <h2 className="font-display text-3xl font-bold mt-4">{selectedProductText?.name}</h2>
                <div className="flex items-center gap-2 mt-3"><Stars rating={selectedProduct.rating} /><span className="text-sm text-muted-foreground">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span></div>
                <p className="text-muted-foreground leading-relaxed mt-6">{selectedProductText?.description}</p>
                <p className="text-2xl font-bold text-primary mt-7">{formatPrice(selectedProduct.price, lang)}</p>
                <button onClick={() => {
                  if (!user) { openAuth("login"); return; }
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }} className="mt-7 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <ShoppingCart size={16} /> {t.catalog.add}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection banner */}
      <section className="relative overflow-hidden mx-4 sm:mx-6 rounded-3xl mb-24 max-w-7xl lg:mx-auto">
        <div className="aspect-[21/8] min-h-[260px] bg-muted">
          <img src="https://images.unsplash.com/photo-1531594652722-292a43e752b4?w=1400&h=534&fit=crop&auto=format"
            alt="Summer Macaron Collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 sm:px-16 max-w-lg">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">{t.collection.badge}</p>
            <h2 className="text-white font-display text-3xl sm:text-4xl font-bold leading-tight mb-4">{t.collection.title}</h2>
            <p className="text-white/65 text-sm mb-7 leading-relaxed">{t.collection.desc}</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors">
              {t.collection.shop}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Why Candora */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Our Promise</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">{t.why.title} <span className="italic">{t.why.candora}</span></h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: t.why.t1, desc: t.why.d1, emoji: "🎂" },
            { title: t.why.t2, desc: t.why.d2, emoji: "✨" },
            { title: t.why.t3, desc: t.why.d3, emoji: "🎁" },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="bg-card border border-border rounded-2xl p-6">
              <div className="text-3xl mb-4">{item.emoji}</div>
              <h3 className="font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">{t.reviews.title} <span className="italic">{t.reviews.clients}</span></h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tm, i) => (
              <motion.div key={tm.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{tm.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{tm.initials}</div>
                  <div><p className="text-sm font-semibold">{tm.name}</p><p className="text-xs text-muted-foreground">{tm.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Candora Family 100% Win Lottery Section */}
      <LotterySection />
    </div>
  );
}

