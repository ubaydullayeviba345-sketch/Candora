import { ShoppingCart, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  rating?: number;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  addToCartText: string;
}

export function ProductCard({ 
  name, 
  price, 
  image, 
  rating = 5, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite,
  addToCartText 
}: ProductCardProps) {
  return (
    <div className="bg-white/25 backdrop-blur-2xl rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all border border-white/30">
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 bg-white/30 backdrop-blur-md border border-white/50 rounded-full p-2 shadow-lg hover:bg-white/50 transition-all"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} />
        </button>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg mb-2 text-white">{name}</h3>
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i} className="text-yellow-400 text-xl">★</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl text-white">{price}</span>
          <button 
            onClick={onAddToCart}
            className="bg-white/30 backdrop-blur-md hover:bg-white/40 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl border border-white/40"
          >
            <ShoppingCart className="w-4 h-4" />
            {addToCartText}
          </button>
        </div>
      </div>
    </div>
  );
}
