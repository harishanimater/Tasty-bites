import React, { useState } from 'react';
import { CartItem, BrandingSettings } from '../types';
import { VegBadge } from './VegBadge';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShieldCheck, ShoppingBag, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  branding: BrandingSettings;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  appliedCoupon: string | undefined;
  onApplyCoupon: (code: string) => boolean;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  branding,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Subtotal Calculation
  const subtotal = items.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  // Discount Calculation
  let discount = 0;
  if (appliedCoupon === 'WELCOME20') {
    discount = Math.round(subtotal * 0.2);
  } else if (appliedCoupon === 'TASTY50' && subtotal >= 299) {
    discount = 50;
  }

  // GST 5%
  const gst = Math.round(subtotal * (branding.gstPercentage / 100));

  // Delivery fee
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= branding.freeDeliveryThreshold ? 0 : branding.deliveryFeeBase;

  // Grand Total
  const grandTotal = Math.max(0, subtotal + gst + deliveryFee - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponMessage({ text: `Promo code ${couponInput.toUpperCase()} applied!`, isError: false });
    } else {
      setCouponMessage({ text: 'Invalid coupon code. Try WELCOME20 or TASTY50', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-md bg-neutral-900 h-full border-l border-neutral-800 shadow-2xl flex flex-col justify-between pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between text-white border-b border-white/10"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base leading-tight">Your Delicious Cart</h2>
              <span className="text-xs text-white/80">{items.length} dishes selected</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-amber-300 hover:text-white px-2 py-1 rounded bg-black/20 transition cursor-pointer"
                title="Clear all dishes"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
            <div className="w-20 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4 text-amber-400 border border-neutral-700">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Your cart is empty!</h3>
            <p className="text-xs text-neutral-400 max-w-xs mb-6">
              Add some fragrant Biryanis, hot Butter Chicken or Paneer Tikka from our royal menu.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-900 transition shadow-md hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: branding.accentColor }}
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Free Delivery Bar Progress */}
            <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700/80 text-xs">
              {subtotal >= branding.freeDeliveryThreshold ? (
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Congratulations! Free Delivery unlocked!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-neutral-300 mb-1.5 font-medium">
                    <span>
                      Add {branding.currencySymbol}
                      {branding.freeDeliveryThreshold - subtotal} more for <strong className="text-amber-400">FREE delivery</strong>
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      {Math.round((subtotal / branding.freeDeliveryThreshold) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / branding.freeDeliveryThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* List of Cart Items */}
            <div className="space-y-3">
              {items.map((cartItem, index) => (
                <div
                  key={`${cartItem.item.id}-${index}`}
                  className="bg-neutral-800/60 p-3 rounded-2xl border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition"
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="mt-1 shrink-0">
                      <VegBadge isVeg={cartItem.item.isVeg} size="sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white truncate leading-snug">
                        {cartItem.item.name}
                      </h4>
                      <div className="text-xs text-amber-400 font-bold mt-0.5">
                        {branding.currencySymbol}{cartItem.item.price * cartItem.quantity}
                      </div>
                      {cartItem.notes && (
                        <p className="text-[11px] text-neutral-400 italic truncate mt-0.5">
                          Note: {cartItem.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controller & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-1 rounded-xl border border-neutral-700">
                      <button
                        onClick={() => onUpdateQuantity(index, cartItem.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, cartItem.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-amber-400 text-neutral-950 flex items-center justify-center transition hover:brightness-110 cursor-pointer font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-neutral-500 hover:text-red-400 p-1.5 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="bg-neutral-800/40 p-3.5 rounded-2xl border border-neutral-800">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. WELCOME20)"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs uppercase font-mono tracking-wider text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-700 hover:bg-neutral-600 text-white transition cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center justify-between">
                  <span>Code Applied: <strong>{appliedCoupon}</strong></span>
                  <span>- {branding.currencySymbol}{discount}</span>
                </div>
              )}

              {couponMessage && (
                <div
                  className={`mt-1.5 text-xs ${
                    couponMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {couponMessage.text}
                </div>
              )}
            </div>

            {/* Itemized Bill Breakdown */}
            <div className="bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800 space-y-2 text-xs text-neutral-300">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 border-b border-neutral-700/60 pb-1.5">
                Bill Summary
              </div>
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span>{branding.currencySymbol}{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Savings</span>
                  <span>- {branding.currencySymbol}{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Restaurant GST ({branding.gstPercentage}%)</span>
                <span>{branding.currencySymbol}{gst}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-400">FREE</strong>
                  ) : (
                    `${branding.currencySymbol}${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-700 flex justify-between text-base font-black text-white">
                <span>To Pay</span>
                <span className="text-amber-400">{branding.currencySymbol}{grandTotal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer: Proceed to Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-900">
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition flex items-center justify-between shadow-xl active:scale-98 cursor-pointer hover:brightness-110"
              style={{ backgroundColor: branding.accentColor, color: '#1F1514' }}
            >
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-neutral-800">Grand Total</div>
                <div className="text-base font-black leading-none">
                  {branding.currencySymbol}{grandTotal}
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-extrabold text-sm uppercase tracking-wide">
                <span>Select Address & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
            <div className="mt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Safe & Contactless Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
