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
  description: string;
}

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
    image: "https://images.unsplash.com/photo-1705595049756-c255e6c68d08?w=600&h=600&fit=crop&auto=format",
    description: "Dark chocolate layers with velvet ganache and 24K gold dust finish",
  },
  {
    id: 2, name: "Rose Macaron Collection", category: "macarons", price: 45,
    rating: 4.8, reviews: 89, badge: "New",
    image: "https://images.unsplash.com/photo-1634560604992-7784a29bc419?w=600&h=600&fit=crop&auto=format",
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
    image: "https://images.unsplash.com/photo-1590741664176-7fbd7e2592a0?w=600&h=600&fit=crop&auto=format",
    description: "Six premium cupcakes with Swiss meringue buttercream and berry compote",
  },
  {
    id: 5, name: "Gold Truffle Box", category: "chocolate", price: 65,
    rating: 4.9, reviews: 178, badge: "Premium",
    image: "https://images.unsplash.com/photo-1759524322924-2024f209a011?w=600&h=600&fit=crop&auto=format",
    description: "12 single-origin dark chocolate truffles with gold leaf embellishment",
  },
  {
    id: 6, name: "Stacked Macaron Trio", category: "macarons", price: 55,
    rating: 4.8, reviews: 91, badge: null,
    image: "https://images.unsplash.com/photo-1702745571735-937e55652374?w=600&h=600&fit=crop&auto=format",
    description: "Stacked macaron trio — pistachio, raspberry, and vanilla bean",
  },
  {
    id: 7, name: "Wedding Tier Cake", category: "cakes", price: 320,
    rating: 5.0, reviews: 42, badge: "Made to Order",
    image: "https://images.unsplash.com/photo-1628661477251-7938a1a967cd?w=600&h=600&fit=crop&auto=format",
    description: "Three-tier fondant wedding cake with fresh florals and gold accents",
  },
  {
    id: 8, name: "Macaron Gift Box", category: "gifts", price: 72, originalPrice: 85,
    rating: 4.9, reviews: 65, badge: "Sale",
    image: "https://images.unsplash.com/photo-1570476922354-81227cdbb76c?w=600&h=600&fit=crop&auto=format",
    description: "16-piece assorted macaron collection in a luxury ribbon-tied box",
  },
];

export const TESTIMONIALS = [
  { name: "Sophia Laurent", role: "Wedding Client", initials: "SL", rating: 5,
    text: "Candora crafted our wedding cake and every macaron was pure poetry. Absolutely world-class." },
  { name: "James Whitfield", role: "Corporate Gifting", initials: "JW", rating: 5,
    text: "We order from Candora for every company event. The presentation is impeccable, the taste even better." },
  { name: "Amara Osei", role: "Regular Customer", initials: "AO", rating: 5,
    text: "The Rose Macaron Collection is a masterpiece. Candora stands right alongside the very best patisseries in Paris." },
];

export const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  if (!digits) return "+998 ";
  if (digits.length <= 2) return `+998 ${digits}`;
  if (digits.length <= 5) return `+998 ${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 7) return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
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
