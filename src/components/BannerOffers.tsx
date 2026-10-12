import React from 'react';
import { Tag, Sparkles, Truck, Check } from 'lucide-react';
import { BrandingSettings } from '../types';

interface BannerOffersProps {
  branding: BrandingSettings;
  onApplyCoupon: (code: string) => void;
  appliedCoupon?: string;
}

export const BannerOffers: React.FC<BannerOffersProps> = ({
  branding,
  onApplyCoupon,
  appliedCoupon,
}) => {
  return (
    <section className="px-4 py-3 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Offer 1: WELCOME20 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 p-3.5 text-white shadow-sm flex items-center justify-between border border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-200">New Guest Special</div>
              <div className="text-base font-black leading-tight">20% Flat Discount</div>
              <div className="text-[11px] text-amber-100">Use code <span className="font-mono font-bold underline">WELCOME20</span></div>
            </div>
          </div>
          <button
            onClick={() => onApplyCoupon('WELCOME20')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
              appliedCoupon === 'WELCOME20'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-neutral-900 hover:bg-amber-100'
            }`}
          >
            {appliedCoupon === 'WELCOME20' ? (
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Applied</span>
            ) : (
              'Apply'
            )}
          </button>
        </div>

        {/* Offer 2: TASTY50 */}
        <div
          className="relative overflow-hidden rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between border border-white/10"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Biryani & Tandoor Fest</div>
              <div className="text-base font-black leading-tight">₹50 Instant Cashback</div>
              <div className="text-[11px] text-white/80">On orders above ₹299 • <span className="font-mono font-bold">TASTY50</span></div>
            </div>
          </div>
          <button
            onClick={() => onApplyCoupon('TASTY50')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
              appliedCoupon === 'TASTY50'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-400 text-neutral-900 hover:bg-amber-300'
            }`}
          >
            {appliedCoupon === 'TASTY50' ? (
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Applied</span>
            ) : (
              'Apply'
            )}
          </button>
        </div>

        {/* Offer 3: Free Delivery Highlight */}
        <div className="sm:col-span-2 lg:col-span-1 rounded-2xl bg-neutral-800/80 backdrop-blur-xs p-3.5 text-white border border-neutral-700/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Free Home Delivery</div>
            <div className="text-sm font-bold text-neutral-100">
              On all orders above {branding.currencySymbol}{branding.freeDeliveryThreshold}
            </div>
            <div className="text-[11px] text-neutral-400">Freshly packed in insulated thermal containers</div>
          </div>
        </div>
      </div>
    </section>
  );
};
