import React from 'react';
import { Utensils, Calendar, ShoppingBag, Clock, ShieldCheck } from 'lucide-react';
import { BrandingSettings } from '../types';

interface BottomTabBarProps {
  activeTab: 'menu' | 'booking' | 'cart' | 'orders' | 'admin';
  cartCount: number;
  onSelectTab: (tab: 'menu' | 'booking' | 'cart' | 'orders' | 'admin') => void;
  branding: BrandingSettings;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  cartCount,
  onSelectTab,
  branding,
}) => {
  const tabs = [
    { id: 'menu' as const, label: 'Menu', icon: Utensils },
    { id: 'booking' as const, label: 'Reserve', icon: Calendar },
    { id: 'cart' as const, label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'orders' as const, label: 'Orders', icon: Clock },
    { id: 'admin' as const, label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer ${
                isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black text-neutral-950 flex items-center justify-center shadow-md animate-pulse"
                    style={{ backgroundColor: branding.accentColor }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold mt-1 tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
