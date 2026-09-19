export interface Prize {
  id: "cake" | "pastry" | "trend_sweet" | "promo50k";
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  description: {
    uz: string;
    ru: string;
    en: string;
  };
  icon: string;
  badge: {
    uz: string;
    ru: string;
    en: string;
  };
  percentage: number;
  promoCode?: string;
}

export const PRIZE_TIERS: Prize[] = [
  {
    id: "cake",
    percentage: 10,
    icon: "🎂",
    badge: {
      uz: "SUPER YUTUQ (10%)",
      ru: "СУПЕР ПРИЗ (10%)",
      en: "SUPER PRIZE (10%)",
    },
    name: {
      uz: "Bepul qimmatroq tort",
      ru: "Бесплатный премиальный торт",
      en: "Free Premium Cake",
    },
    description: {
      uz: "Tabriklaymiz! Siz Candora'ning eng mazali va hashamatli tortlaridan birini bepul qo'lga kiritdingiz!",
      ru: "Поздравляем! Вы выиграли один из самых изысканных премиальных тортов Candora бесплатно!",
      en: "Congratulations! You've won one of Candora's luxury artisan cakes completely free!",
    },
  },
  {
    id: "pastry",
    percentage: 20,
    icon: "🥐",
    badge: {
      uz: "MAZALI SOVRIN (20%)",
      ru: "ВКУСНЫЙ ПРИЗ (20%)",
      en: "DELICIOUS PRIZE (20%)",
    },
    name: {
      uz: "Mazali pishiriq",
      ru: "Вкусная свежая выпечка",
      en: "Delicious Artisan Pastry",
    },
    description: {
      uz: "Fransuzcha retsept asosida yangi pishirilgan maxsus pishiriq sizniki!",
      ru: "Фирменная свежая выпечка по французскому рецепту ждёт вас!",
      en: "A freshly baked artisan pastry made with authentic French techniques is yours!",
    },
  },
  {
    id: "trend_sweet",
    percentage: 5,
    icon: "🍫✨",
    badge: {
      uz: "VIP / EKSKLYUZIV (5%)",
      ru: "VIP / ЭКСКЛЮЗИВ (5%)",
      en: "VIP / EXCLUSIVE (5%)",
    },
    name: {
      uz: "Trenddagi qimmatbaho shirinlik",
      ru: "Трендовый эксклюзивный десерт",
      en: "Trending Luxury Confection",
    },
    description: {
      uz: "Eng so'nggi trenddagi oltin changli premium shirinlik to'plami!",
      ru: "Эксклюзивный трендовый десерт с золотым напылением из лимитированной коллекции!",
      en: "An exclusive trending gold-leaf luxury dessert from our limited collection!",
    },
  },
  {
    id: "promo50k",
    percentage: 65,
    icon: "🎟️",
    badge: {
      uz: "KAFOLATLANGAN BONUS (65%)",
      ru: "ГАРАНТИРОВАННЫЙ БОНУС (65%)",
      en: "GUARANTEED BONUS (65%)",
    },
    name: {
      uz: "50 000 so‘mlik promokod / bonus",
      ru: "Промокод / Бонус на 50 000 сум",
      en: "50,000 UZS Promo Code / Bonus",
    },
    description: {
      uz: "Istalgan xaridingiz uchun 50 000 so'mlik chegirmani faollashtiruvchi vaucher!",
      ru: "Скидочный ваучер на 50 000 сум для любого заказа в бутике Candora!",
      en: "A 50,000 UZS discount voucher for any order at Candora boutique!",
    },
  },
];

/**
 * Validates an email address.
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
};

/**
 * Generates a unique promo code for the user.
 */
export const generatePromoCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "CANDORA-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Draws a random prize based on the defined percentages (deterministic 100% win).
 * @param randomVal Optional float between 0 and 100 (for testing).
 */
export const drawPrize = (randomVal?: number): Prize => {
  const rand = randomVal !== undefined ? randomVal : Math.random() * 100;

  // Cumulative distribution:
  // 0  .. 10  -> cake (10%)
  // 10 .. 30  -> pastry (20%)
  // 30 .. 35  -> trend_sweet (5%)
  // 35 .. 100 -> promo50k (65%)

  let cumulative = 0;
  for (const tier of PRIZE_TIERS) {
    cumulative += tier.percentage;
    if (rand < cumulative) {
      const copy = { ...tier };
      if (tier.id === "promo50k") {
        copy.promoCode = generatePromoCode();
      }
      return copy;
    }
  }

  // Fallback (safe guarantee)
  const defaultPrize = { ...PRIZE_TIERS[3] };
  defaultPrize.promoCode = generatePromoCode();
  return defaultPrize;
};

