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

export const CATEGORIES = [
  { id: "all", label: { en: "All", uz: "Barchasi", ru: "Все" } },
  { id: "chocolate", label: { en: "Chocolate", uz: "Shokolad", ru: "Шоколад" } },
  { id: "cakes", label: { en: "Cakes", uz: "Tortlar", ru: "Торты" } },
  { id: "patisserie", label: { en: "Pâtisserie", uz: "Pishiriqlar", ru: "Выпечка" } },
  { id: "desserts", label: { en: "Desserts", uz: "Shirinliklar", ru: "Десерты" } },
  { id: "gifts", label: { en: "Gifts", uz: "Sovg'alar", ru: "Подарки" } }
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "24K Gold Signature Chocolate Box",
    category: "chocolate",
    price: 85,
    rating: 4.7,
    reviews: 136,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate 24k gold signature chocolate box."
  },
  {
    id: 2,
    name: "Dark Chocolate Truffle Collection",
    category: "chocolate",
    price: 40,
    rating: 4.9,
    reviews: 159,
    badge: null,
    image: "https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate dark chocolate truffle collection."
  },
  {
    id: 3,
    name: "Pistachio Praline Collection",
    category: "chocolate",
    price: 35,
    rating: 4.8,
    reviews: 64,
    badge: null,
    image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate pistachio praline collection."
  },
  {
    id: 4,
    name: "Salted Caramel Truffle Box",
    category: "chocolate",
    price: 30,
    rating: 4.7,
    reviews: 155,
    badge: null,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate salted caramel truffle box."
  },
  {
    id: 5,
    name: "Hazelnut Gianduja Collection",
    category: "chocolate",
    price: 38,
    rating: 4.8,
    reviews: 96,
    badge: null,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate hazelnut gianduja collection."
  },
  {
    id: 6,
    name: "Raspberry Ruby Chocolate",
    category: "chocolate",
    price: 32,
    rating: 4.9,
    reviews: 76,
    badge: null,
    image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate raspberry ruby chocolate."
  },
  {
    id: 7,
    name: "Belgian Chocolate Selection",
    category: "chocolate",
    price: 45,
    rating: 4.7,
    reviews: 163,
    badge: null,
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate belgian chocolate selection."
  },
  {
    id: 8,
    name: "Dubai Pistachio Chocolate Bar",
    category: "chocolate",
    price: 25,
    rating: 5,
    reviews: 40,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate dubai pistachio chocolate bar."
  },
  {
    id: 9,
    name: "Caramelized Almond Chocolate",
    category: "chocolate",
    price: 28,
    rating: 5,
    reviews: 176,
    badge: null,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate caramelized almond chocolate."
  },
  {
    id: 10,
    name: "Luxury Chocolate Bonbons",
    category: "chocolate",
    price: 55,
    rating: 4.7,
    reviews: 38,
    badge: null,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1548907040-4d42fcaa3c5c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium chocolate luxury chocolate bonbons."
  },
  {
    id: 11,
    name: "Royal Chocolate Cake",
    category: "cakes",
    price: 55,
    rating: 4.9,
    reviews: 111,
    badge: null,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes royal chocolate cake."
  },
  {
    id: 12,
    name: "Pistachio Raspberry Cake",
    category: "cakes",
    price: 48,
    rating: 4.7,
    reviews: 136,
    badge: null,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes pistachio raspberry cake."
  },
  {
    id: 13,
    name: "Belgian Chocolate Ganache Cake",
    category: "cakes",
    price: 50,
    rating: 4.8,
    reviews: 123,
    badge: "New",
    image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes belgian chocolate ganache cake."
  },
  {
    id: 14,
    name: "Red Velvet Signature Cake",
    category: "cakes",
    price: 45,
    rating: 4.6,
    reviews: 69,
    badge: null,
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes red velvet signature cake."
  },
  {
    id: 15,
    name: "Vanilla Madagascar Cake",
    category: "cakes",
    price: 40,
    rating: 4.9,
    reviews: 30,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes vanilla madagascar cake."
  },
  {
    id: 16,
    name: "Salted Caramel Cake",
    category: "cakes",
    price: 45,
    rating: 4.8,
    reviews: 130,
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes salted caramel cake."
  },
  {
    id: 17,
    name: "Strawberry Champagne-style Cake",
    category: "cakes",
    price: 60,
    rating: 4.6,
    reviews: 43,
    badge: null,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes strawberry champagne-style cake."
  },
  {
    id: 18,
    name: "Tiramisu Signature Cake",
    category: "cakes",
    price: 52,
    rating: 4.9,
    reviews: 38,
    badge: null,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes tiramisu signature cake."
  },
  {
    id: 19,
    name: "Black Forest Premium Cake",
    category: "cakes",
    price: 48,
    rating: 4.8,
    reviews: 121,
    badge: null,
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes black forest premium cake."
  },
  {
    id: 20,
    name: "Opera Cake",
    category: "cakes",
    price: 55,
    rating: 4.8,
    reviews: 176,
    badge: null,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1602351447937-745cb720612f?w=700&h=700&fit=crop&auto=format"],
    description: "Premium cakes opera cake."
  },
  {
    id: 21,
    name: "Pistachio Croissant",
    category: "patisserie",
    price: 8,
    rating: 4.7,
    reviews: 155,
    badge: null,
    image: "https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1614707267537-2b0f7a7e5a5a?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie pistachio croissant."
  },
  {
    id: 22,
    name: "Almond Croissant",
    category: "patisserie",
    price: 7,
    rating: 4.9,
    reviews: 117,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1614707267537-2b0f7a7e5a5a?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie almond croissant."
  },
  {
    id: 23,
    name: "Chocolate Croissant",
    category: "patisserie",
    price: 7,
    rating: 5,
    reviews: 95,
    badge: null,
    image: "https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1614707267537-2b0f7a7e5a5a?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie chocolate croissant."
  },
  {
    id: 24,
    name: "Vanilla Éclair",
    category: "patisserie",
    price: 9,
    rating: 4.7,
    reviews: 119,
    badge: null,
    image: "https://images.unsplash.com/photo-1614707267537-2b0f7a7e5a5a?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1614707267537-2b0f7a7e5a5a?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie vanilla éclair."
  },
  {
    id: 25,
    name: "Pistachio Éclair",
    category: "patisserie",
    price: 10,
    rating: 4.8,
    reviews: 70,
    badge: "New",
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie pistachio éclair."
  },
  {
    id: 26,
    name: "Paris-Brest",
    category: "patisserie",
    price: 12,
    rating: 4.8,
    reviews: 138,
    badge: null,
    image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1558326567-98ae2405596b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie paris-brest."
  },
  {
    id: 27,
    name: "Fruit Tart",
    category: "patisserie",
    price: 15,
    rating: 4.8,
    reviews: 104,
    badge: null,
    image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie fruit tart."
  },
  {
    id: 28,
    name: "Lemon Meringue Tart",
    category: "patisserie",
    price: 14,
    rating: 5,
    reviews: 67,
    badge: null,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie lemon meringue tart."
  },
  {
    id: 29,
    name: "Chocolate Tart",
    category: "patisserie",
    price: 15,
    rating: 4.8,
    reviews: 111,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1612203985729-70726954388c?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1612203985729-70726954388c?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie chocolate tart."
  },
  {
    id: 30,
    name: "Mille-Feuille",
    category: "patisserie",
    price: 16,
    rating: 5,
    reviews: 145,
    badge: null,
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1549903072-7e3e00078a0f?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1509365465994-3e9bc6625841?w=700&h=700&fit=crop&auto=format"],
    description: "Premium patisserie mille-feuille."
  },
  {
    id: 31,
    name: "Pistachio Raspberry Entremet",
    category: "desserts",
    price: 18,
    rating: 4.9,
    reviews: 150,
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts pistachio raspberry entremet."
  },
  {
    id: 32,
    name: "Mango Passion Fruit Mousse",
    category: "desserts",
    price: 16,
    rating: 4.8,
    reviews: 114,
    badge: null,
    image: "https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts mango passion fruit mousse."
  },
  {
    id: 33,
    name: "Chocolate Hazelnut Dome",
    category: "desserts",
    price: 18,
    rating: 4.6,
    reviews: 163,
    badge: null,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts chocolate hazelnut dome."
  },
  {
    id: 34,
    name: "Strawberry Vanilla Dome",
    category: "desserts",
    price: 15,
    rating: 4.7,
    reviews: 96,
    badge: null,
    image: "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts strawberry vanilla dome."
  },
  {
    id: 35,
    name: "Caramel Praline Dome",
    category: "desserts",
    price: 17,
    rating: 4.9,
    reviews: 107,
    badge: null,
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts caramel praline dome."
  },
  {
    id: 36,
    name: "Tiramisu Cup",
    category: "desserts",
    price: 12,
    rating: 4.7,
    reviews: 35,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1587314168485-3236d6710814?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts tiramisu cup."
  },
  {
    id: 37,
    name: "Pistachio Tiramisu",
    category: "desserts",
    price: 14,
    rating: 4.8,
    reviews: 75,
    badge: "New",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts pistachio tiramisu."
  },
  {
    id: 38,
    name: "Lotus Caramel Dessert Cup",
    category: "desserts",
    price: 12,
    rating: 4.7,
    reviews: 124,
    badge: null,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts lotus caramel dessert cup."
  },
  {
    id: 39,
    name: "Berry Cheesecake Jar",
    category: "desserts",
    price: 10,
    rating: 4.6,
    reviews: 172,
    badge: null,
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1519869325930-281384150729?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts berry cheesecake jar."
  },
  {
    id: 40,
    name: "Chocolate Mousse Verrine",
    category: "desserts",
    price: 14,
    rating: 4.9,
    reviews: 77,
    badge: null,
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format"],
    description: "Premium desserts chocolate mousse verrine."
  },
  {
    id: 41,
    name: "Candora Signature Box",
    category: "gifts",
    price: 65,
    rating: 4.8,
    reviews: 97,
    badge: null,
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts candora signature box."
  },
  {
    id: 42,
    name: "Royal Gift Box",
    category: "gifts",
    price: 95,
    rating: 4.9,
    reviews: 77,
    badge: null,
    image: "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts royal gift box."
  },
  {
    id: 43,
    name: "His & Hers Chocolate Set",
    category: "gifts",
    price: 80,
    rating: 4.7,
    reviews: 98,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts his & hers chocolate set."
  },
  {
    id: 44,
    name: "Birthday Luxury Box",
    category: "gifts",
    price: 75,
    rating: 4.7,
    reviews: 35,
    badge: null,
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts birthday luxury box."
  },
  {
    id: 45,
    name: "Wedding Gift Collection",
    category: "gifts",
    price: 120,
    rating: 4.9,
    reviews: 84,
    badge: null,
    image: "https://images.unsplash.com/photo-1582716409951-68903c73e04a?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1582716409951-68903c73e04a?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts wedding gift collection."
  },
  {
    id: 46,
    name: "Corporate Premium Box",
    category: "gifts",
    price: 150,
    rating: 5,
    reviews: 158,
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1608350529559-002d0fa3c162?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1608350529559-002d0fa3c162?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts corporate premium box."
  },
  {
    id: 47,
    name: "Ramadan/Eid Luxury Collection",
    category: "gifts",
    price: 110,
    rating: 4.9,
    reviews: 119,
    badge: null,
    image: "https://images.unsplash.com/photo-1563805042-7684c8e9e1cb?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1563805042-7684c8e9e1cb?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts ramadan/eid luxury collection."
  },
  {
    id: 48,
    name: "New Year Signature Box",
    category: "gifts",
    price: 105,
    rating: 4.8,
    reviews: 94,
    badge: null,
    image: "https://images.unsplash.com/photo-1511381939415-e440c9c40a1b?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1511381939415-e440c9c40a1b?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts new year signature box."
  },
  {
    id: 49,
    name: "Love Collection ❤️",
    category: "gifts",
    price: 85,
    rating: 5,
    reviews: 164,
    badge: "New",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts love collection ❤️."
  },
  {
    id: 50,
    name: "Candora Grand Collection",
    category: "gifts",
    price: 250,
    rating: 4.9,
    reviews: 85,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1540816405786-fb713ed842ea?w=700&h=700&fit=crop&auto=format",
    gallery: ["https://images.unsplash.com/photo-1540816405786-fb713ed842ea?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=700&h=700&fit=crop&auto=format","https://images.unsplash.com/photo-1518291344630-4857135fb581?w=700&h=700&fit=crop&auto=format"],
    description: "Premium gifts candora grand collection."
  },
];

export const TESTIMONIALS = [
  { id: 1, name: "Aziza K.", rating: 5, comment: { en: "The best cakes in the city!", uz: "Shahardagi eng zo'r tortlar!", ru: "Лучшие торты в городе!" } },
  { id: 2, name: "Malika Y.", rating: 5, comment: { en: "Amazing chocolate quality.", uz: "Shokolad sifati ajoyib.", ru: "Удивительное качество шоколада." } },
  { id: 3, name: "Dilshod R.", rating: 5, comment: { en: "Perfect for gifts.", uz: "Sovg'a uchun eng zo'r tanlov.", ru: "Идеально для подарков." } },
];

const CATEGORY_WORDS: Record<string, Record<ProductLanguage, string>> = {
  chocolate: { en: "Chocolate", uz: "Shokolad", ru: "Шоколад" },
  cakes: { en: "Cake", uz: "Tort", ru: "Торт" },
  patisserie: { en: "Pastry", uz: "Pishiriq", ru: "Выпечка" },
  desserts: { en: "Dessert", uz: "Shirinlik", ru: "Десерт" },
  gifts: { en: "Gift box", uz: "Sovg'a qutisi", ru: "Подарочная коробка" }
};

export const getProductText = (product: Product, lang: ProductLanguage) => {
  if (lang === "en") return { name: product.name, description: product.description };
  const word = CATEGORY_WORDS[product.category] ?? CATEGORY_WORDS.cakes;
  return lang === "uz"
    ? { name: product.name, description: "Premium masalliqlardan tayyorlangan eksklyuziv " + word.uz.toLowerCase() + "." }
    : { name: product.name, description: "Эксклюзивный " + word.ru.toLowerCase() + ", приготовленный из премиальных ингредиентов." };
};

export const formatPrice = (price: number, lang: ProductLanguage) => {
  if (lang === "uz") return (new Intl.NumberFormat("uz-UZ").format(price * 12500)) + " so'm";
  if (lang === "ru") return (new Intl.NumberFormat("ru-RU").format(price * 90)) + " ₽";
  return "$" + price;
};

export const getProductTags = (product: Product): string[] => {
  const tags = [product.category];
  if (product.badge) tags.push(product.badge.toLowerCase());
  return tags;
};

export const normalizePhoneInput = (value: string, caret: number | null = null) => {
  const digits = value.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  let formatted = "";
  if (digits.length > 0) formatted += "998 ";
  if (digits.length > 0) formatted += "(" + digits.slice(0, 2);
  if (digits.length >= 2) formatted += ") ";
  if (digits.length > 2) formatted += digits.slice(2, 5);
  if (digits.length >= 5) formatted += " ";
  if (digits.length > 5) formatted += digits.slice(5, 7);
  if (digits.length >= 7) formatted += " ";
  if (digits.length > 7) formatted += digits.slice(7, 9);
  
  return { value: formatted, caret: formatted.length };
};

export const formatCardNumber = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

export const formatExpiry = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
};
