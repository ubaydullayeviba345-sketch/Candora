import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Plus, ShoppingCart, Sparkles, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router";
import { useT } from "../../lib/i18n";
import { CATEGORIES, formatPrice, getProductText, PRODUCTS, type Product } from "../../lib/data";

function Stars({ rating }: { rating: number }) {
  return <span className="text-amber-400 tracking-tight">{"★".repeat(Math.round(rating))}</span>;
}

export default function Catalog() {
  const { lang, user, openAuth, addToCart } = useApp();
  const t = useT(lang);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const products = PRODUCTS.filter(product => activeCategory === "all" || product.category === activeCategory);
  const gallery = selectedProduct?.gallery ?? [];

  const changeImage = (direction: 1 | -1) => {
    if (!gallery.length) return;
    setSelectedImage(current => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <div className="pt-24 pb-20">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> {lang === "uz" ? "Orqaga" : lang === "ru" ? "Назад" : "Back"}
        </button>
        <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase">
          <Sparkles size={11} /> {t.catalog.title}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-5">{t.catalog.subtitle} <span className="italic text-primary">{t.catalog.subtitle2}</span></h1>
        <p className="text-muted-foreground mt-4">{lang === "uz" ? "Barcha 82 ta Candora mahsulotini ko'ring" : lang === "ru" ? "Посмотрите все 82 продукта Candora" : "Explore all 82 Candora products"}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-6">
          {CATEGORIES.map(category => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              {t.categories[category.key]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => {
            const text = getProductText(product, lang);
            return (
              <article key={product.id} onClick={() => { setSelectedProduct(product); setSelectedImage(0); }} onKeyDown={event => { if (event.key === "Enter") { setSelectedProduct(product); setSelectedImage(0); } }} tabIndex={0} role="button" className="group relative rounded-2xl overflow-hidden bg-card border border-border flex flex-col">
                {product.badge && <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary text-primary-foreground">{product.badge}</span>}
                <div className="aspect-square overflow-hidden bg-muted"><img src={product.image} alt={text.name} loading="lazy" onError={event => { event.currentTarget.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&h=700&q=85"; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h2 className="font-semibold text-sm leading-snug">{text.name}</h2>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{text.description}</p>
                  <div className="flex items-center gap-1.5 text-xs"><Stars rating={product.rating} /><span className="text-muted-foreground">({product.reviews})</span></div>
                  <div className="flex items-center justify-between mt-auto pt-2"><span className="font-bold">{formatPrice(product.price, lang)}</span><button onClick={event => { event.stopPropagation(); if (!user) { openAuth("login"); return; } addToCart(product); }} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-85 transition-opacity"><Plus size={11} />{t.catalog.add}</button></div>
                </div>
              </article>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedProduct && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onClick={event => event.stopPropagation()} className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl grid md:grid-cols-2">
                <button onClick={() => setSelectedProduct(null)} aria-label="Close product details" className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 border border-border flex items-center justify-center"><X size={16} /></button>
                <div className="p-4 sm:p-6 bg-muted/40">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                    <img src={gallery[selectedImage]} alt={getProductText(selectedProduct, lang).name} className="w-full h-full object-cover" />
                    <button onClick={() => changeImage(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 flex items-center justify-center"><ArrowLeft size={16} /></button>
                    <button onClick={() => changeImage(1)} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 flex items-center justify-center"><ArrowRight size={16} /></button>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">{gallery.slice(0, 3).map((image, index) => <button key={image} onClick={() => setSelectedImage(index)} aria-label={`Show image ${index + 1}`} className={`h-2.5 rounded-full ${selectedImage === index ? "w-7 bg-primary" : "w-2.5 bg-muted-foreground/35"}`} />)}</div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <h2 className="font-display text-3xl font-bold">{getProductText(selectedProduct, lang).name}</h2>
                  <div className="flex items-center gap-2 mt-3"><Stars rating={selectedProduct.rating} /><span className="text-sm text-muted-foreground">{selectedProduct.rating} ({selectedProduct.reviews})</span></div>
                  <p className="text-muted-foreground leading-relaxed mt-6">{getProductText(selectedProduct, lang).description}</p>
                  <p className="text-2xl font-bold text-primary mt-7">{formatPrice(selectedProduct.price, lang)}</p>
                  <button onClick={() => { if (!user) { openAuth("login"); return; } addToCart(selectedProduct); setSelectedProduct(null); }} className="mt-7 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2"><ShoppingCart size={16} /> {t.catalog.add}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
