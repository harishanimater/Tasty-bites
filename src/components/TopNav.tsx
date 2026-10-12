import React from 'react';
import { BrandingSettings, UserProfile } from '../types';
import { Search, UtensilsCrossed, Phone, MapPin, User, ShieldCheck, Flame } from 'lucide-react';

interface TopNavProps {
  branding: BrandingSettings;
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  vegOnly: boolean;
  onVegOnlyToggle: () => void;
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  branding,
  user,
  searchQuery,
  onSearchChange,
  vegOnly,
  onVegOnlyToggle,
  onOpenBooking,
  onOpenAuth,
  onOpenAdmin,
}) => {
  return (
    <header
      className="sticky top-0 z-30 transition-colors shadow-md text-white pt-safe"
      style={{ backgroundColor: branding.primaryColor }}
    >
      {/* Upper Micro Bar for Opening Hours & Contact */}
      <div className="bg-black/20 text-xs px-4 py-1.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4 text-white/90">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Kitchen Open: {branding.openingHours}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-white/80">
            <MapPin className="w-3 h-3 text-amber-300" />
            <span className="truncate max-w-[280px]">{branding.address}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${branding.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors font-medium text-[11px]"
          >
            <Phone className="w-3 h-3" />
            <span>Call Kitchen</span>
          </a>
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-amber-300 text-[11px] font-medium transition"
            title="Restaurant Admin Portal"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin PIN</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Title / Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner shrink-0 border border-white/20"
            style={{ backgroundColor: branding.accentColor, color: branding.primaryColor }}
          >
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight flex items-center gap-2">
              <span>{branding.appName}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400 text-neutral-900 shadow-xs">
                Indian Kitchen
              </span>
            </h1>
            <p className="text-xs text-white/80 hidden sm:block italic line-clamp-1">
              {branding.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls: Table Booking & User profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm active:scale-95 cursor-pointer"
            style={{ backgroundColor: branding.accentColor, color: '#1F1514' }}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Book a Table</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-medium transition border border-white/15 cursor-pointer"
          >
            <User className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">
              {user.isLoggedIn ? (user.name || user.phone.slice(-4)) : 'Login'}
            </span>
          </button>
        </div>
      </div>

      {/* Search & Veg/Non-Veg Filter Toolbar */}
      <div className="px-4 pb-3 max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Biryani, Butter Chicken, Paneer Tikka, Naan..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white text-neutral-900 rounded-xl placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-neutral-700 bg-neutral-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Veg Only Toggle Switch */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10 self-end sm:self-auto w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-[1.5px] border-emerald-400 rounded-xs flex items-center justify-center bg-emerald-950/40">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-bold tracking-wide text-white">Pure Veg Only</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={vegOnly}
            onClick={onVegOnlyToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              vegOnly ? 'bg-emerald-500' : 'bg-neutral-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                vegOnly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
