import React, { useState } from 'react';
import { X, ShieldCheck, Palette, Utensils, Bike, Calendar, Save, Plus, Check, RefreshCw } from 'lucide-react';
import { BrandingSettings, MenuItem, Order, TableBooking, OrderStatus } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingSettings;
  onUpdateBranding: (updated: BrandingSettings) => void;
  menuItems: MenuItem[];
  onUpdateMenuItem: (updatedItem: MenuItem) => void;
  onAddMenuItem: (newItem: MenuItem) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  tableBookings: TableBooking[];
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  branding,
  onUpdateBranding,
  menuItems,
  onUpdateMenuItem,
  onAddMenuItem,
  orders,
  onUpdateOrderStatus,
  tableBookings,
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'menu' | 'orders' | 'bookings'>('branding');

  // Local state for branding form
  const [appName, setAppName] = useState(branding.appName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [accentColor, setAccentColor] = useState(branding.accentColor);
  const [gstPercentage, setGstPercentage] = useState(branding.gstPercentage);
  const [deliveryFeeBase, setDeliveryFeeBase] = useState(branding.deliveryFeeBase);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(branding.freeDeliveryThreshold);
  const [codEnabled, setCodEnabled] = useState(branding.codEnabled);
  const [phone, setPhone] = useState(branding.phone);
  const [address, setAddress] = useState(branding.address);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '7890' || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BrandingSettings = {
      ...branding,
      appName: appName.trim(),
      tagline: tagline.trim(),
      primaryColor,
      accentColor,
      gstPercentage: Number(gstPercentage),
      deliveryFeeBase: Number(deliveryFeeBase),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      codEnabled,
      phone: phone.trim(),
      address: address.trim(),
    };
    onUpdateBranding(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in">
      <div
        className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Admin & Kitchen Control</h3>
              <p className="text-xs text-neutral-400">Live Branding, Menu, and Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* PIN Entry Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center max-w-sm mx-auto my-auto text-neutral-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Enter Master Admin PIN</h4>
            <p className="text-xs text-neutral-400 mb-6">
              Default demo manager PIN is <strong className="text-amber-400 font-mono">7890</strong>
            </p>

            <form onSubmit={handlePinSubmit} className="w-full space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-[0.8em] px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-2xl text-2xl font-mono text-white focus:outline-hidden focus:border-amber-400"
              />
              {pinError && (
                <div className="text-xs text-rose-400 font-semibold">
                  Incorrect PIN. Please use 7890.
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 transition cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-4 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'branding', label: 'Remote Branding', icon: Palette },
                { id: 'orders', label: `Live Orders (${orders.length})`, icon: Bike },
                { id: 'menu', label: `Menu Items (${menuItems.length})`, icon: Utensils },
                { id: 'bookings', label: `Table Bookings (${tableBookings.length})`, icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition shrink-0 cursor-pointer ${
                      active
                        ? 'border-amber-400 text-amber-400 bg-neutral-800/50'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="p-5 overflow-y-auto flex-1 text-neutral-200 space-y-4">
              {/* TAB 1: Live Branding Editor */}
              {activeTab === 'branding' && (
                <form onSubmit={handleSaveBranding} className="space-y-4 max-w-2xl">
                  <div className="bg-amber-400/10 border border-amber-400/30 p-3 rounded-2xl text-xs text-amber-200">
                    💡 <strong>Central Editable Branding:</strong> Changes here immediately re-render the app header, theme colors, checkout formulas, and invoices for all customer screens without needing an app store update!
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Restaurant App Name
                      </label>
                      <input
                        type="text"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Tagline / Cuisine
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white"
                      />
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Primary Brand Color (Hex / Maroon)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm font-mono text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Accent / CTA Color (Hex / Saffron)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing / Delivery Variables */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        GST Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={gstPercentage}
                        onChange={(e) => setGstPercentage(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Base Delivery Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={deliveryFeeBase}
                        onChange={(e) => setDeliveryFeeBase(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Free Delivery Above (₹)
                      </label>
                      <input
                        type="number"
                        value={freeDeliveryThreshold}
                        onChange={(e) => setFreeDeliveryThreshold(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* COD & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Official Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Restaurant Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-800/60 rounded-xl border border-neutral-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Enable Cash on Delivery (COD)</div>
                      <div className="text-[11px] text-neutral-400">Toggle whether customers can select COD at checkout</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCodEnabled(!codEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        codEnabled ? 'bg-emerald-500' : 'bg-neutral-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          codEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 transition flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Broadcast Settings</span>
                    </button>
                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Updated successfully!
                      </span>
                    )}
                  </div>
                </form>
              )}

              {/* TAB 2: Live Orders Dispatch */}
              {activeTab === 'orders' && (
                <div className="space-y-3">
                  <div className="text-xs text-neutral-400">
                    Update order status to automatically advance the client app's live tracking and scooter animation:
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500">No active orders placed yet.</div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400">{order.orderNumber}</span>
                            <span className="text-xs font-bold text-white">({order.customerName})</span>
                            <span className="text-xs text-neutral-400">• {order.customerPhone}</span>
                          </div>
                          <div className="text-xs text-neutral-300 mt-1">
                            Dishes: {order.items.map((it) => `${it.quantity}x ${it.item.name}`).join(', ')}
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">
                            Total: {branding.currencySymbol}{order.total} • Payment: {order.paymentMethod.toUpperCase()}
                          </div>
                        </div>

                        {/* Status Switcher Buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(['placed', 'preparing', 'out_for_delivery', 'delivered'] as OrderStatus[]).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => onUpdateOrderStatus(order.id, st)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
                                order.status === st
                                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                              }`}
                            >
                              {st.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: Menu Items Manager */}
              {activeTab === 'menu' && (
                <div className="space-y-3">
                  <div className="text-xs text-neutral-400">
                    Quickly toggle out-of-stock items or adjust menu prices:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-neutral-800/60 p-3 rounded-2xl border border-neutral-700 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                            <span className="text-xs text-amber-400 font-bold">
                              {branding.currencySymbol}{item.price}
                            </span>
                            <span className="text-[10px] text-neutral-400 ml-2">({item.category})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateMenuItem({ ...item, isAvailable: !item.isAvailable })
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              item.isAvailable
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {item.isAvailable ? 'In Stock' : 'Sold Out'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Table Bookings */}
              {activeTab === 'bookings' && (
                <div className="space-y-3">
                  {tableBookings.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500">No dining table reservations yet.</div>
                  ) : (
                    tableBookings.map((b) => (
                      <div
                        key={b.id}
                        className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400">{b.bookingNumber}</span>
                            <span className="text-sm font-bold text-white">{b.customerName}</span>
                            <span className="text-xs text-neutral-400">({b.customerPhone})</span>
                          </div>
                          <div className="text-xs text-neutral-300 mt-1">
                            {b.guests} Guests • {b.date} at {b.timeSlot} • <strong>{b.seatingArea}</strong>
                          </div>
                          {b.specialRequest && (
                            <div className="text-[11px] text-amber-300/80 italic mt-0.5">
                              Request: {b.specialRequest}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
