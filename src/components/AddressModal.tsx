import React, { useState } from 'react';
import { X, MapPin, Navigation, Home, Briefcase, Plus, Check } from 'lucide-react';
import { BrandingSettings } from '../types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingSettings;
  onSelectAddress: (address: { tag: string; street: string; city: string; landmark?: string }) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSelectAddress,
}) => {
  if (!isOpen) return null;

  const [tag, setTag] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [street, setStreet] = useState('Flat 402, Royal Palms, Hill Road');
  const [landmark, setLandmark] = useState('Near Mehboob Studio');
  const [city, setCity] = useState('Bandra West, Mumbai - 400050');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsDetecting(true);
    // Simulate high precision GPS locator
    setTimeout(() => {
      setStreet('Tower 3, Horizon Heights, Carter Road');
      setLandmark('Opposite Cafe Coffee Day');
      setCity('Bandra West, Mumbai - 400050');
      setIsDetecting(false);
    }, 800);
  };

  const handleConfirm = () => {
    if (!street.trim()) return;
    onSelectAddress({
      tag,
      street: street.trim(),
      city: city.trim(),
      landmark: landmark.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between text-white border-b border-white/10"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Select Delivery Address</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-neutral-200">
          {/* Simulated Map Canvas */}
          <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-800 flex items-center justify-center shadow-inner">
            {/* Map styling representation */}
            <div className="absolute inset-0 bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            <div className="absolute w-24 h-24 rounded-full bg-amber-400/10 border border-amber-400/30 animate-ping" />
            <div className="relative z-10 flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <MapPin className="w-6 h-6 text-amber-300" />
              </div>
              <div className="mt-1 bg-black/80 text-[11px] font-semibold text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                Tasty Bites Delivering to you (~30 mins)
              </div>
            </div>

            {/* GPS Auto-detect Button */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={isDetecting}
              className="absolute bottom-2.5 right-2.5 bg-neutral-900/90 hover:bg-black text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-neutral-700 flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Locating...' : 'Use Current GPS'}</span>
            </button>
          </div>

          {/* Address Tag Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Address Label
            </label>
            <div className="flex gap-2">
              {[
                { label: 'Home', icon: Home },
                { label: 'Work', icon: Briefcase },
                { label: 'Other', icon: MapPin },
              ].map((item) => {
                const Icon = item.icon;
                const active = tag === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTag(item.label as any)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      active
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                        : 'border-neutral-800 bg-neutral-800/40 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                House / Flat / Floor / Building *
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Flat 301, Sunshine Apts"
                className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Metro Station / Behind Temple"
                className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Area / City / Pincode
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900">
          <button
            onClick={handleConfirm}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer hover:brightness-110"
            style={{ backgroundColor: branding.accentColor, color: '#1F1514' }}
          >
            <Check className="w-4 h-4" />
            <span>Deliver to This Address</span>
          </button>
        </div>
      </div>
    </div>
  );
};
