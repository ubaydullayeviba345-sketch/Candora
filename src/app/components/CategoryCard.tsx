import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryCardProps {
  title: string;
  image: string;
  description: string;
}

export function CategoryCard({ title, image, description }: CategoryCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-3xl aspect-square mb-4 shadow-xl">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-5 m-4 bg-white/15 backdrop-blur-2xl rounded-2xl border border-white/25 text-white">
          <h3 className="text-xl mb-1">{title}</h3>
          <p className="text-xs opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
}
