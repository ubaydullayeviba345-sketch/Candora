export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string | null;
  image: string;
  gallery?: string[];
  description: string;
}

export type ProductLanguage = "en" | "uz" | "ru";

const DESSERT_IMAGE_POOL = [
  "photo-1578985545062-69928b1d9587", "photo-1558326567-98ae2405596b", "photo-1531594652722-292a43e752b4",
  "photo-1486427944299-d1955d23e34d", "photo-1549007994-cb92caebd54b", "photo-1571506165871-ee72a35bc9d4",
  "photo-1628661477251-7938a1a967cd", "photo-1571115177098-24ec42ed204d", "photo-1565958011703-44f9829ba187",
  "photo-1519915028121-7d3463d20b13", "photo-1464305795204-6f5bbfc7fb81", "photo-1602351447937-745cb720612f",
  "photo-1533134242443-d4fd215305ad", "photo-1571877227200-a0d98ea607e9", "photo-1519869325930-281384150729",
  "photo-1606890737304-57a1ca8a5b62", "photo-1569864358642-9d1684040f43", "photo-1578314675249-a6910f80cc4e",
  "photo-1548907040-4d42fcaa3c5c", "photo-1606312619070-d48b4c652a52", "photo-1551024506-0bccd828d307",
  "photo-1551024601-bec78aea704b", "photo-1599785209707-a456fc1337bb", "photo-1550617931-e17a7b70dce2",
  "photo-1558301211-0d8c8ddee6ec", "photo-1588195538326-c5b1e9f80a1b", "photo-1579954115545-a95591f28bfc",
  "photo-1505253716362-afaea1d3d1af", "photo-1559622214-f8a9850965bb", "photo-1488477181946-6428a0291777",
  "photo-1587314168485-3236d6710814", "photo-1586985289688-ca3cf47d3e6e",
];

const dessertImage = (index: number) =>
  `https://images.unsplash.com/${DESSERT_IMAGE_POOL[index % DESSERT_IMAGE_POOL.length]}?auto=format&fit=crop&w=700&h=700&q=85`;

export interface CartItem extends Product {
  quantity: number;
}

export const CATEGORIES = [
  { id: "all", key: "all" as const },
  { id: "cakes", key: "cakes" as const },
  { id: "macarons", key: "macarons" as const },
  { id: "chocolate", key: "chocolate" as const },
  { id: "gifts", key: "gifts" as const },
  { id: "seasonal", key: "seasonal" as const },
];

export const PRODUCTS: Product[] = [
  {
    id: 1, name: "Noir Velvet Cake", category: "cakes", price: 89, originalPrice: 110,
    rating: 4.9, reviews: 124, badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    description: "Dark chocolate layers with velvet ganache and 24K gold dust finish",
  },
  {
    id: 2, name: "Rose Macaron Collection", category: "macarons", price: 45,
    rating: 4.8, reviews: 89, badge: "New",
    image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600&h=600&fit=crop&auto=format",
    description: "Assorted rose-flavored French macarons in a silk-lined gift box",
  },
  {
    id: 3, name: "Pastel Macaron Tower", category: "macarons", price: 120,
    rating: 5.0, reviews: 56, badge: "Limited",
    image: "https://images.unsplash.com/photo-1531594652722-292a43e752b4?w=600&h=600&fit=crop&auto=format",
    description: "A 24-piece tower of hand-crafted macarons in seasonal flavors",
  },
  {
    id: 4, name: "Velvet Cupcake Set", category: "cakes", price: 38,
    rating: 4.7, reviews: 203, badge: null,
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&h=600&fit=crop&auto=format",
    description: "Six premium cupcakes with Swiss meringue buttercream and berry compote",
  },
  {
    id: 5, name: "Gold Truffle Box", category: "chocolate", price: 65,
    rating: 4.9, reviews: 178, badge: "Premium",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop&auto=format",
    description: "12 single-origin dark chocolate truffles with gold leaf embellishment",
  },
  {
    id: 6, name: "Stacked Macaron Trio", category: "macarons", price: 55,
    rating: 4.8, reviews: 91, badge: null,
    image: "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=600&h=600&fit=crop&auto=format",
    description: "Stacked macaron trio — pistachio, raspberry, and vanilla bean",
  },
  {
    id: 7, name: "Wedding Tier Cake", category: "cakes", price: 320,
    rating: 5.0, reviews: 42, badge: "Made to Order",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop&auto=format",
    description: "Three-tier fondant wedding cake with fresh florals and gold accents",
  },
  {
    id: 8, name: "Macaron Gift Box", category: "gifts", price: 72, originalPrice: 85,
    rating: 4.9, reviews: 65, badge: "Sale",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&h=600&fit=crop&auto=format",
    description: "16-piece assorted macaron collection in a luxury ribbon-tied box",
  },
  {
    id: 9, name: "Strawberry Cloud Cake", category: "cakes", price: 76,
    rating: 4.8, reviews: 87, badge: "New",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    description: "Light vanilla sponge layered with strawberry cream and fresh berries",
  },
  {
    id: 10, name: "Pistachio Macaron Set", category: "macarons", price: 52,
    rating: 4.9, reviews: 74, badge: null,
    image: "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=600&h=600&fit=crop&auto=format",
    description: "Delicate pistachio macarons finished with a smooth French buttercream",
  },
  {
    id: 11, name: "Cocoa Truffle Selection", category: "chocolate", price: 68,
    rating: 4.8, reviews: 112, badge: "Premium",
    image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=600&h=600&fit=crop&auto=format",
    description: "Hand-finished dark cocoa truffles in classic and salted caramel flavors",
  },
  {
    id: 12, name: "Celebration Dessert Box", category: "gifts", price: 95,
    rating: 5.0, reviews: 38, badge: "Limited",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&h=600&fit=crop&auto=format",
    description: "A curated gift box of petite cakes, cookies, and chocolate treats",
  },
  {
    id: 13, name: "Hazelnut Praline Cake", category: "cakes", price: 96,
    rating: 4.9, reviews: 66, badge: null,
    image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=600&h=600&fit=crop&auto=format",
    description: "Roasted hazelnut sponge with praline cream and chocolate glaze",
  },
  {
    id: 14, name: "Lemon Meringue Tart", category: "cakes", price: 58,
    rating: 4.8, reviews: 51, badge: "New",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=600&fit=crop&auto=format",
    description: "Bright lemon curd tart topped with softly toasted meringue",
  },
  {
    id: 15, name: "Ruby Berry Cheesecake", category: "cakes", price: 84,
    rating: 4.9, reviews: 93, badge: null,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=600&fit=crop&auto=format",
    description: "Silky vanilla cheesecake with ruby berry compote and biscuit base",
  },
  {
    id: 16, name: "Pistachio Opera Cake", category: "cakes", price: 108,
    rating: 5.0, reviews: 44, badge: "Premium",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=600&fit=crop&auto=format",
    description: "Elegant pistachio and espresso layers finished with dark chocolate",
  },
  {
    id: 17, name: "Vanilla Bean Cupcake Box", category: "cakes", price: 42,
    rating: 4.7, reviews: 119, badge: null,
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&h=600&fit=crop&auto=format",
    description: "Six vanilla bean cupcakes with whipped buttercream rosettes",
  },
  {
    id: 18, name: "Salted Caramel Cake", category: "cakes", price: 92,
    rating: 4.8, reviews: 72, badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&h=600&fit=crop&auto=format",
    description: "Soft caramel cake with sea salt, toffee crunch, and cream frosting",
  },
  {
    id: 19, name: "Parisian Macaron Mix", category: "macarons", price: 48,
    rating: 4.9, reviews: 138, badge: null,
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&h=600&fit=crop&auto=format",
    description: "A colorful selection of French macarons in six classic flavors",
  },
  {
    id: 20, name: "Lavender Macaron Box", category: "macarons", price: 54,
    rating: 4.8, reviews: 47, badge: "Limited",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&h=600&fit=crop&auto=format",
    description: "Floral lavender shells filled with smooth white chocolate ganache",
  },
  {
    id: 21, name: "Raspberry Macaron Tower", category: "macarons", price: 135,
    rating: 5.0, reviews: 31, badge: "Made to Order",
    image: "https://images.unsplash.com/photo-1614707267537-2b0f7a7e5a5a?w=600&h=600&fit=crop&auto=format",
    description: "A celebratory tower of raspberry macarons for special occasions",
  },
  {
    id: 22, name: "Dark Chocolate Truffle Box", category: "chocolate", price: 74,
    rating: 4.9, reviews: 104, badge: "Premium",
    image: "https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=600&h=600&fit=crop&auto=format",
    description: "Intense dark chocolate truffles dusted with cocoa and gold flakes",
  },
  {
    id: 23, name: "Milk Chocolate Bonbons", category: "chocolate", price: 62,
    rating: 4.8, reviews: 89, badge: null,
    image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=600&h=600&fit=crop&auto=format",
    description: "Glossy milk chocolate bonbons with hazelnut and caramel centers",
  },
  {
    id: 24, name: "Cocoa Gift Slab", category: "chocolate", price: 36,
    rating: 4.7, reviews: 58, badge: "New",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    description: "Hand-finished chocolate slab with roasted nuts and dried berries",
  },
  {
    id: 25, name: "Chocolate Orange Truffles", category: "chocolate", price: 69,
    rating: 4.9, reviews: 63, badge: null,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=600&fit=crop&auto=format",
    description: "Dark chocolate truffles infused with candied orange and sea salt",
  },
  {
    id: 26, name: "Afternoon Tea Gift Set", category: "gifts", price: 112,
    rating: 4.9, reviews: 42, badge: "Premium",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&h=600&fit=crop&auto=format",
    description: "A refined assortment of petite cakes, macarons, and chocolate treats",
  },
  {
    id: 27, name: "Rose Celebration Box", category: "gifts", price: 88,
    rating: 4.8, reviews: 36, badge: "New",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&h=600&fit=crop&auto=format",
    description: "A ribbon-tied box of rose macarons and delicate chocolate bonbons",
  },
  {
    id: 28, name: "Little Birthday Treats", category: "gifts", price: 64,
    rating: 4.8, reviews: 71, badge: null,
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&h=600&fit=crop&auto=format",
    description: "A cheerful gift assortment of cupcakes, cookies, and mini cakes",
  },
  {
    id: 29, name: "Autumn Spice Cake", category: "seasonal", price: 78,
    rating: 4.9, reviews: 29, badge: "Seasonal",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    description: "Warm spiced cake with cinnamon cream and toasted pecans",
  },
  {
    id: 30, name: "Winterberry Pavlova", category: "seasonal", price: 82,
    rating: 4.8, reviews: 24, badge: "Seasonal",
    image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&h=600&fit=crop&auto=format",
    description: "Crisp meringue, vanilla cream, and jewel-like winter berries",
  },
  {
    id: 31, name: "Spring Blossom Tart", category: "seasonal", price: 70,
    rating: 4.9, reviews: 33, badge: "Limited",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    description: "A light seasonal tart decorated with edible blossoms and berries",
  },
  {
    id: 32, name: "Summer Berry Shortcake", category: "seasonal", price: 76,
    rating: 5.0, reviews: 46, badge: "Seasonal",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=600&fit=crop&auto=format",
    description: "Tender shortcake layered with vanilla cream and summer berries",
  },
];

const CATEGORY_GALLERY: Record<string, string[]> = {
  cakes: [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&h=900&fit=crop&auto=format",
  ],
  macarons: [
    "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=900&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1531594652722-292a43e752b4?w=900&h=900&fit=crop&auto=format",
  ],
  chocolate: [
    "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=900&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=900&h=900&fit=crop&auto=format",
  ],
  gifts: [
    "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=900&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=900&h=900&fit=crop&auto=format",
  ],
  seasonal: [
    "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=900&h=900&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&h=900&fit=crop&auto=format",
  ],
};

PRODUCTS.forEach(product => {
  product.gallery = [product.image, ...(CATEGORY_GALLERY[product.category] ?? [])];
});

const EXTRA_IMAGE_POOLS: Record<string, string[]> = {
  cakes: [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519869325930-281384150729?w=700&h=700&fit=crop&auto=format",
  ],
  macarons: [
    "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1531594652722-292a43e752b4?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=700&h=700&fit=crop&auto=format",
  ],
  chocolate: [
    "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format",
  ],
  gifts: [
    "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=700&h=700&fit=crop&auto=format",
  ],
  seasonal: [
    "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=700&h=700&fit=crop&auto=format",
  ],
};

const extraNames = [
  "Signature", "Classic", "Royal", "Velvet", "Golden", "Garden", "Paris", "Celebration", "Deluxe", "Artisan",
];
const extraCategories = ["cakes", "macarons", "chocolate", "gifts", "seasonal"];

for (let id = 33; id <= 82; id += 1) {
  const category = extraCategories[(id - 33) % extraCategories.length];
  const name = `${extraNames[(id - 33) % extraNames.length]} ${category === "cakes" ? "Cake" : category === "macarons" ? "Macaron Box" : category === "chocolate" ? "Chocolate Selection" : category === "gifts" ? "Sweet Gift Box" : "Seasonal Tart"}`;
  const pool = EXTRA_IMAGE_POOLS[category];
  const imageIndex = (id - 33) % pool.length;
  PRODUCTS.push({
    id,
    name,
    category,
    price: 35 + ((id * 13) % 120),
    rating: Number((4.6 + ((id % 5) * 0.1)).toFixed(1)),
    reviews: 24 + ((id * 17) % 180),
    badge: id % 7 === 0 ? "Limited" : id % 5 === 0 ? "New" : null,
    image: pool[imageIndex],
    gallery: [pool[imageIndex], pool[(imageIndex + 1) % pool.length], pool[(imageIndex + 2) % pool.length]],
    description: `Handcrafted ${category} made with premium ingredients and a refined Candora finish`,
  });
}

PRODUCTS.forEach(product => {
  const start = (product.id - 1) * 3;
  product.image = dessertImage(start);
  product.gallery = [dessertImage(start), dessertImage(start + 1), dessertImage(start + 2)];
});

const CATEGORY_WORDS: Record<string, Record<ProductLanguage, string>> = {
  cakes: { en: "Cake", uz: "Tort", ru: "Торт" },
  macarons: { en: "Macaron", uz: "Makaron", ru: "Макарон" },
  chocolate: { en: "Chocolate", uz: "Shokolad", ru: "Шоколад" },
  gifts: { en: "Gift box", uz: "Sovg'a qutisi", ru: "Подарочная коробка" },
  seasonal: { en: "Seasonal dessert", uz: "Mavsumiy shirinlik", ru: "Сезонный десерт" },
};

export const getProductText = (product: Product, lang: ProductLanguage) => {
  if (lang === "en") return { name: product.name, description: product.description };
  const word = CATEGORY_WORDS[product.category] ?? CATEGORY_WORDS.cakes;
  return lang === "uz"
    ? { name: `${word.uz} ${product.id}`, description: `Premium masalliqlardan tayyorlangan qo'lda ishlangan ${word.uz.toLowerCase()}.` }
    : { name: `${word.ru} ${product.id}`, description: `Изысканный ${word.ru.toLowerCase()}, приготовленный вручную из премиальных ингредиентов.` };
};

export const formatPrice = (price: number, lang: ProductLanguage) => {
  if (lang === "uz") {
    return `${new Intl.NumberFormat("uz-UZ").format(price * 12500)} so'm`;
  }
  if (lang === "ru") {
    return `${new Intl.NumberFormat("ru-RU").format(price * 90)} ₽`;
  }
  return `$${price}`;
};

export const getProductTags = (product: Product) => {
  const tags = new Set<string>([product.category]);
  if (product.id % 3 === 0 || product.category === "chocolate") tags.add("chocolate");
  if (product.id % 4 === 0 || product.category === "seasonal") tags.add("seasonal");
  if (product.id % 5 === 0 || product.category === "macarons") tags.add("vegetarian");
  if (product.id % 7 === 0) tags.add("gluten-free");
  return [...tags];
};

export const TESTIMONIALS = [
  { name: "Sophia Laurent", role: "Wedding Client", initials: "SL", rating: 5,
    text: "Candora crafted our wedding cake and every macaron was pure poetry. Absolutely world-class." },
  { name: "James Whitfield", role: "Corporate Gifting", initials: "JW", rating: 5,
    text: "We order from Candora for every company event. The presentation is impeccable, the taste even better." },
  { name: "Amara Osei", role: "Regular Customer", initials: "AO", rating: 5,
    text: "The Rose Macaron Collection is a masterpiece. Candora stands right alongside the very best patisseries in Paris." },
];

export const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  if (!digits) return "+998 ";

  const parts = [digits.slice(0, 2)];
  if (digits.length > 2) parts.push(digits.slice(2, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 9));

  return `+998 ${parts.join(" ")}`;
};

export const normalizePhoneInput = (value: string, caret: number | null = null) => {
  const digits = value.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  const formatted = formatPhone(digits);

  if (caret === null) {
    return { value: formatted, caret: formatted.length };
  }

  const digitsBeforeCaret = value.slice(0, caret).replace(/\D/g, "").replace(/^998/, "").length;
  const beforeCaret = formatPhone(digits.slice(0, digitsBeforeCaret));

  return {
    value: formatted,
    caret: beforeCaret.length,
  };
};

export const formatCardNumber = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

export const formatExpiry = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};
