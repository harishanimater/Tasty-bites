import React, { useState } from 'react';
import { MenuItem } from '../types';
import { VegBadge } from './VegBadge';
import { X, Star, Clock, Flame, Plus, Minus, Check } from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddCustomized: (item: MenuItem, qty: number, spiceLevel: 1 | 2 | 3, notes: string) => void;
  currencySymbol: string;
  primaryColor: string;
  accentColor: string;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onAddCustomized,
  currencySymbol,
  primaryColor,
  accentColor,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<1 | 2 | 3>(item.spiceLevel);
  const [cookingNotes, setCookingNotes] = useState('');
  const [extraGarlicChutney, setExtraGarlicChutney] = useState(false);
  const [extraOnionSalad, setExtraOnionSalad] = useState(false);

  const extraCost = (extraGarlicChutney ? 25 : 0) + (extraOnionSalad ? 20 : 0);
  const totalItemPrice = (item.price + extraCost) * quantity;

  const handleConfirm = () => {
    let finalNotes = cookingNotes.trim();
    if (extraGarlicChutney) finalNotes += (finalNotes ? ', ' : '') + 'Extra Garlic Chutney';
    if (extraOnionSalad) finalNotes += (finalNotes ? ', ' : '') + 'Extra Spiced Onion Salad';

    onAddCustomized(item, quantity, selectedSpice, finalNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image with Close Button */}
        <div className="relative h-60 w-full bg-neutral-800 shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <VegBadge isVeg={item.isVeg} size="lg" showLabel />
                {item.isBestSeller && (
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-neutral-900"
                    style={{ backgroundColor: accentColor }}
                  >
                    Chef Special
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">{item.name}</h2>
              {item.hindiName && (
                <p className="text-sm font-semibold text-amber-400">{item.hindiName}</p>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-400 uppercase font-semibold">Price</span>
              <div className="text-2xl font-black text-amber-400">
                {currencySymbol}{item.price}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-neutral-200">
          <p className="text-sm text-neutral-300 leading-relaxed">{item.description}</p>

          <div className="flex items-center gap-4 py-2 border-y border-neutral-800 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm">{item.rating}</span>
              <span className="text-neutral-500">({item.ratingCount} reviews)</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-700" />
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Prep Time: ~{item.prepTimeMinutes} mins</span>
            </div>
          </div>

          {/* Spice Level Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Select Spice Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 1, label: 'Mild (कम तीखा)', icon: '🌶️' },
                { level: 2, label: 'Medium (मध्यम)', icon: '🌶️🌶️' },
                { level: 3, label: 'Spicy (तीखा / देशी)', icon: '🌶️🌶️🌶️' },
              ].map((opt) => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setSelectedSpice(opt.level as 1 | 2 | 3)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                    selectedSpice === opt.level
                      ? 'border-amber-400 bg-amber-400/15 text-white'
                      : 'border-neutral-800 bg-neutral-800/40 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-sm">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Add-ons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Optional Add-ons
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-800 cursor-pointer hover:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={extraGarlicChutney}
                    onChange={(e) => setExtraGarlicChutney(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-amber-500 accent-amber-500"
                  />
                  <span className="text-sm font-medium">Extra Spicy Garlic Thecha / Chutney</span>
                </div>
                <span className="text-xs font-bold text-amber-400">+{currencySymbol}25</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/60 border border-neutral-800 cursor-pointer hover:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={extraOnionSalad}
                    onChange={(e) => setExtraOnionSalad(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-amber-500 accent-amber-500"
                  />
                  <span className="text-sm font-medium">Sirka Onion & Lemon Ring Salad</span>
                </div>
                <span className="text-xs font-bold text-amber-400">+{currencySymbol}20</span>
              </label>
            </div>
          </div>

          {/* Special Instructions for Kitchen */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              value={cookingNotes}
              onChange={(e) => setCookingNotes(e.target.value)}
              placeholder="e.g. Less oil, make crispy, no coriander..."
              className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-neutral-800 p-1 rounded-xl border border-neutral-700">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-neutral-700 text-white flex items-center justify-center hover:bg-neutral-600 transition cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-base text-amber-400">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg text-neutral-900 flex items-center justify-center hover:brightness-110 transition cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer hover:brightness-110"
            style={{ backgroundColor: accentColor, color: '#1F1514' }}
          >
            <span>Add to Order</span>
            <span className="text-xs bg-black/20 px-2 py-0.5 rounded-md font-extrabold">
              {currencySymbol}{totalItemPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
