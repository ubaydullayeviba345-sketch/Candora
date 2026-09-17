import { ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onViewProducts: () => void;
  buttonText: string;
}

export function Hero({ onViewProducts, buttonText }: HeroProps) {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1706147602203-6e2c340fb6db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5keSUyMHNob3AlMjBkaXNwbGF5fGVufDF8fHx8MTc3MDMxNDc2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Candy Shop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40"></div>
      </div>
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="text-white max-w-2xl bg-white/15 backdrop-blur-2xl p-10 rounded-3xl border border-white/25 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-12 h-12" />
            <h1 className="text-6xl">Candora</h1>
          </div>
          <p className="text-2xl mb-8">
            Shirinlik sevuvchilar uchun eng yaxshi shirinliklar dunyosi
          </p>
          <p className="text-lg mb-8">
            Bizning do'konimizda siz eng mazali va sifatli shokoladlar, tortlar, makaronlar va boshqa shirinliklarni topishingiz mumkin.
          </p>
          <button 
            onClick={onViewProducts}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 text-white px-8 py-4 rounded-full text-lg transition-all shadow-xl hover:shadow-2xl"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}