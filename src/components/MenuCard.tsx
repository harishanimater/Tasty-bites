import React from 'react';
import { MenuItem } from '../types';
import { VegBadge } from './VegBadge';
import { Star, Plus, Minus, Flame, Clock } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  quantityInCart: number;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (item: MenuItem) => void;
  onClickDetail: (item: MenuItem) => void;
  currencySymbol: string;
  primaryColor: string;
  accentColor: string;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onClickDetail,
  currencySymbol,
  primaryColor,
  accentColor,
}) => {
  return (
    <article className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between">
      {/* Upper Area: Image & Badges */}
      <div
        className="relative h-44 sm:h-48 w-full overflow-hidden cursor-pointer bg-neutral-800"
        onClick={() => onClickDetail(item)}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
          <VegBadge isVeg={item.isVeg} size="md" />
          {item.isBestSeller && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-neutral-900 shadow-md flex items-center gap-1"
              style={{ backgroundColor: accentColor }}
            >
              <Flame className="w-3 h-3 text-red-700 fill-red-700" />
              Chef Choice
            </span>
          )}
        </div>

        {/* Prep Time & Spice Indicator */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white/90">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px]">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{item.prepTimeMinutes} mins</span>
          </div>

          <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px]" title={`Spice level: ${item.spiceLevel}/3`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`text-[11px] ${
                  i < item.spiceLevel ? 'text-red-500' : 'text-neutral-500'
                }`}
              >
                🌶️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div
            className="cursor-pointer"
            onClick={() => onClickDetail(item)}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-base text-neutral-100 group-hover:text-amber-400 transition-colors leading-snug">
                {item.name}
              </h3>
            </div>
            {item.hindiName && (
              <div className="text-xs text-amber-500/80 font-medium">
                {item.hindiName}
              </div>
            )}
          </div>

          <p className="mt-1.5 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.rating}</span>
              <span className="text-neutral-500 text-[10px] font-normal">({item.ratingCount})</span>
            </div>
          </div>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Price</span>
            <span className="text-lg font-black text-neutral-100">
              {currencySymbol}{item.price}
            </span>
          </div>

          {/* Cart Quantity Toggle / Add Button */}
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-2 bg-neutral-800 rounded-xl p-1 border border-neutral-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromCart(item);
                }}
                className="w-7 h-7 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-amber-400">
                {quantityInCart}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item);
                }}
                className="w-7 h-7 rounded-lg text-neutral-900 flex items-center justify-center transition active:scale-95 cursor-pointer"
                style={{ backgroundColor: accentColor }}
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(item)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 active:scale-95 cursor-pointer shadow-sm hover:brightness-110"
              style={{ backgroundColor: accentColor, color: '#1F1514' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
