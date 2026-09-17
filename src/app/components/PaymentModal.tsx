import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, Banknote, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useT } from "../../lib/i18n";
import { formatCardNumber, formatExpiry } from "../../lib/data";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PaymentModal({ open, onClose }: Props) {
  const { cartItems, placeOrder, lang } = useApp();
  const t = useT(lang);

  const [method, setMethod] = useState<"card" | "cash">("card");
  const [cardNum, setCardNum] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ orderId: string } | null>(null);

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await placeOrder({
      items: cartItems,
      total,
      paymentMethod: method === "card" ? `**** ${cardNum.slice(-4)}` : "Cash on Delivery",
      deliveryAddress: address,
    });
    setLoading(false);
    if (res.success && res.orderId) {
      setSuccess({ orderId: res.orderId });
    }
  };

  const handleClose = () => {
    setSuccess(null); setCardNum(""); setCardHolder("");
    setExpiry(""); setCvv(""); setAddress("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 360 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

              {success ? (
                // Success state
                <div className="p-8 text-center space-y-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 14 }}>
                    <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold">{t.payment.successTitle}</h2>
                  <p className="text-muted-foreground text-sm">{t.payment.successDesc}</p>
                  <div className="bg-muted rounded-xl px-4 py-3 text-left">
                    <p className="text-xs text-muted-foreground">{t.payment.orderId}</p>
                    <p className="font-mono text-sm font-semibold mt-0.5 truncate">{success.orderId}</p>
                  </div>
                  <button onClick={handleClose} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                    {lang === "uz" ? "Davom etish" : lang === "ru" ? "Продолжить" : "Continue"}
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Lock size={15} className="text-primary" />
                      <h2 className="font-semibold text-base">{t.payment.title}</h2>
                    </div>
                    <button onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Order summary */}
                    <div className="bg-muted rounded-xl p-4 space-y-2">
                      {cartItems.slice(0, 3).map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate max-w-[200px]">{item.name} ×{item.quantity}</span>
                          <span className="font-medium">${item.price * item.quantity}</span>
                        </div>
                      ))}
                      {cartItems.length > 3 && (
                        <p className="text-xs text-muted-foreground">+{cartItems.length - 3} more items</p>
                      )}
                      <div className="h-px bg-border mt-2 pt-2 flex justify-between font-bold text-sm">
                        <span>{t.payment.method}</span>
                        <span className="text-primary">${total}</span>
                      </div>
                    </div>

                    {/* Payment method selector */}
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setMethod("card")}
                        className={`flex items-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${method === "card" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}>
                        <CreditCard size={16} /> {t.payment.card}
                      </button>
                      <button type="button" onClick={() => setMethod("cash")}
                        className={`flex items-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${method === "cash" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}>
                        <Banknote size={16} /> {t.payment.cash}
                      </button>
                    </div>

                    {/* Card details */}
                    {method === "card" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.payment.cardNumber}</label>
                          <input required value={cardNum} onChange={e => setCardNum(formatCardNumber(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors font-mono tracking-wider"
                            placeholder={t.payment.cardPlaceholder} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.payment.cardHolder}</label>
                          <input required value={cardHolder} onChange={e => setCardHolder(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                            placeholder={t.payment.holderPlaceholder} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.payment.expiry}</label>
                            <input required value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors font-mono"
                              placeholder={t.payment.expiryPlaceholder} />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.payment.cvv}</label>
                            <input required value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors font-mono tracking-widest"
                              placeholder={t.payment.cvvPlaceholder} type="password" maxLength={3} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delivery address */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t.payment.address}</label>
                      <input required value={address} onChange={e => setAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm outline-none focus:border-primary transition-colors"
                        placeholder={t.payment.addressPlaceholder} />
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                      className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><Loader2 size={16} className="animate-spin" /> {t.payment.processing}</>
                      ) : (
                        <>{t.payment.placeOrder} — ${total}</>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
