import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, ShoppingCart, LogIn } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import PaymentModal from "./PaymentModal";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, removeFromCart, updateQty, user, openAuth, lang } = useApp();
  const t = useT(lang);
  const [payOpen, setPayOpen] = useState(false);

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-card border-l border-border z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <h2 className="font-display font-semibold text-lg">
                  {t.cart.title}{" "}
                  <span className="text-muted-foreground text-base font-normal">({totalQty})</span>
                </h2>
                <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {!user ? (
                  // Not logged in — prompt
                  <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
                    <LogIn size={44} className="text-muted-foreground opacity-25" />
                    <div>
                      <p className="font-semibold text-sm">{t.cart.loginRequired}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.cart.loginRequiredDesc}</p>
                    </div>
                    <button onClick={() => { setCartOpen(false); openAuth("login"); }}
                      className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                      {t.cart.signIn}
                    </button>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-52 gap-4 text-muted-foreground">
                    <ShoppingCart size={48} className="opacity-20" />
                    <p className="text-sm">{t.cart.empty}</p>
                    <button onClick={() => setCartOpen(false)} className="text-xs text-primary underline underline-offset-2">
                      {t.cart.continueShopping}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">${item.price} each</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                              <Minus size={10} />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove">
                            <X size={13} />
                          </button>
                          <span className="text-sm font-bold">${item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {user && cartItems.length > 0 && (
                <div className="px-6 pb-6 pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.cart.subtotal}</span>
                    <span className="font-medium">${total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.cart.delivery}</span>
                    <span className="text-emerald-500 font-medium">{t.cart.free}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between font-bold text-base">
                    <span>{t.cart.total}</span>
                    <span>${total}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setCartOpen(false); setPayOpen(true); }}
                    className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    {t.cart.checkout} — ${total}
                  </motion.button>
                  <button onClick={() => setCartOpen(false)} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1">
                    {t.cart.continueShopping}
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} />
    </>
  );
}
