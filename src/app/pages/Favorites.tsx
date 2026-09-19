import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { ArrowRight, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { formatPrice, getProductText, PRODUCTS } from "../../lib/data";

export default function Favorites() {
  const { lang, favoriteIds, toggleFavorite, addToCart, user, openAuth } = useApp();
  const t = useT(lang);
  const navigate = useNavigate();
  const products = PRODUCTS.filter(product => favoriteIds.includes(product.id));
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[number] | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const gallery = selectedProduct?.gallery ?? [];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> {lang === "uz" ? "Orqaga" : lang === "ru" ? "Назад" : "Back"}
        </button>
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest mb-2"><Heart size={14} className="fill-primary" /> {lang === "uz" ? "Sevimlilar" : lang === "ru" ? "Избранное" : "Favorites"}</div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold">{lang === "uz" ? "Sevimli shirinliklar" : lang === "ru" ? "Любимые десерты" : "Favorite treats"}</h1>
          </div>
          <span className="text-sm text-muted-foreground">{products.length} {lang === "uz" ? "ta mahsulot" : lang === "ru" ? "тов." : "items"}</span>
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center bg-card border border-border rounded-3xl">
            <Heart size={42} className="mx-auto mb-4 text-primary/50" />
            <p className="font-semibold">{lang === "uz" ? "Sevimlilar hali bo'sh" : lang === "ru" ? "Избранное пока пусто" : "Your favorites are empty"}</p>
            <button onClick={() => navigate("/catalog")} className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">{t.catalog.viewAll}</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map(product => {
              const text = getProductText(product, lang);
              return <article key={product.id} onClick={() => { setSelectedProduct(product); setSelectedImage(0); }} onKeyDown={event => { if (event.key === "Enter") { setSelectedProduct(product); setSelectedImage(0); } }} tabIndex={0} role="button" className="relative overflow-hidden rounded-2xl bg-card border border-border cursor-pointer">
                <img src={product.image} alt={text.name} className="aspect-square w-full object-cover" />
                <button onClick={event => { event.stopPropagation(); toggleFavorite(product.id); }} aria-label="Remove from favorites" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center"><Trash2 size={13} className="text-primary" /></button>
                <div className="p-4"><h2 className="font-semibold text-sm line-clamp-2">{text.name}</h2><p className="text-primary font-bold mt-2">{formatPrice(product.price, lang)}</p></div>
              </article>;
            })}
          </div>
        )}

        <AnimatePresence>
          {selectedProduct && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onClick={event => event.stopPropagation()} className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl grid md:grid-cols-2">
                <button onClick={() => setSelectedProduct(null)} aria-label="Close product details" className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 border border-border flex items-center justify-center"><X size={16} /></button>
                <div className="p-4 sm:p-6 bg-muted/40">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                    <img src={gallery[selectedImage]} alt={getProductText(selectedProduct, lang).name} className="w-full h-full object-cover" />
                    <button onClick={() => setSelectedImage(index => (index - 1 + gallery.length) % gallery.length)} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 flex items-center justify-center"><ArrowLeft size={16} /></button>
                    <button onClick={() => setSelectedImage(index => (index + 1) % gallery.length)} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/85 flex items-center justify-center"><ArrowRight size={16} /></button>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">{gallery.slice(0, 3).map((image, index) => <button key={image} onClick={() => setSelectedImage(index)} aria-label={`Show image ${index + 1}`} className={`h-2.5 rounded-full ${selectedImage === index ? "w-7 bg-primary" : "w-2.5 bg-muted-foreground/35"}`} />)}</div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <h2 className="font-display text-3xl font-bold">{getProductText(selectedProduct, lang).name}</h2>
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
