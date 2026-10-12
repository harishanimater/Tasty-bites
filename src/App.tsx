import React, { useState, useEffect, useMemo } from 'react';
import { BrandingSettings, MenuItem, CartItem, Order, TableBooking, UserProfile, FoodCategory, OrderStatus } from './types';
import { DEFAULT_BRANDING, INITIAL_MENU_ITEMS } from './data/initialData';
import { TopNav } from './components/TopNav';
import { BannerOffers } from './components/BannerOffers';
import { MenuCard } from './components/MenuCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AddressModal } from './components/AddressModal';
import { PaymentModal } from './components/PaymentModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { TableBookingModal } from './components/TableBookingModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { BillInvoiceModal } from './components/BillInvoiceModal';
import { PhoneAuthModal } from './components/PhoneAuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { BottomTabBar } from './components/BottomTabBar';
import { Utensils, Sparkles, Filter, ChevronRight, Share2, Smartphone } from 'lucide-react';

export default function App() {
  // 1. Branding Settings (Persistent)
  const [branding, setBranding] = useState<BrandingSettings>(() => {
    const saved = localStorage.getItem('tb_branding');
    return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
  });

  useEffect(() => {
    localStorage.setItem('tb_branding', JSON.stringify(branding));
    document.title = `${branding.appName} - Indian Restaurant`;
  }, [branding]);

  // 2. Menu Items (Persistent)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('tb_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('tb_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  // 3. User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tb_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Harish Kumar',
          phone: '+91 98765 43210',
          isLoggedIn: true,
          savedAddresses: [
            {
              id: 'addr-1',
              tag: 'Home',
              street: 'Flat 402, Royal Palms, Hill Road',
              city: 'Bandra West, Mumbai',
            },
          ],
        };
  });

  useEffect(() => {
    localStorage.setItem('tb_user', JSON.stringify(user));
  }, [user]);

  // 4. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>('WELCOME20');

  useEffect(() => {
    localStorage.setItem('tb_cart', JSON.stringify(cart));
  }, [cart]);

  // 5. Orders & Bookings
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tb_orders');
    if (saved) return JSON.parse(saved);

    // Initial mock demo order for immediate tracking experience
    const initialOrder: Order = {
      id: 'order-101',
      orderNumber: 'TB-928410',
      items: [
        { item: INITIAL_MENU_ITEMS[0], quantity: 1 }, // Paneer Tikka
        { item: INITIAL_MENU_ITEMS[5], quantity: 1 }, // Chicken Dum Biryani
        { item: INITIAL_MENU_ITEMS[12], quantity: 2 }, // Garlic Butter Naan
      ],
      subtotal: 890,
      gst: 45,
      deliveryFee: 0,
      discount: 178,
      couponCode: 'WELCOME20',
      total: 757,
      status: 'preparing',
      paymentMethod: 'razorpay_upi',
      paymentStatus: 'paid',
      deliveryAddress: {
        tag: 'Home',
        street: 'Flat 402, Royal Palms, Hill Road',
        city: 'Bandra West, Mumbai',
      },
      customerName: 'Harish Kumar',
      customerPhone: '+91 98765 43210',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      etaMinutes: 24,
    };
    return [initialOrder];
  });

  useEffect(() => {
    localStorage.setItem('tb_orders', JSON.stringify(orders));
  }, [orders]);

  const [tableBookings, setTableBookings] = useState<TableBooking[]>(() => {
    const saved = localStorage.getItem('tb_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tb_bookings', JSON.stringify(tableBookings));
  }, [tableBookings]);

  // 6. Navigation & Modals
  const [activeTab, setActiveTab] = useState<'menu' | 'booking' | 'cart' | 'orders' | 'admin'>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('All');
  const [vegOnly, setVegOnly] = useState(false);

  const [selectedDishForDetail, setSelectedDishForDetail] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState<{
    tag: string;
    street: string;
    city: string;
    landmark?: string;
  }>({
    tag: 'Home',
    street: 'Flat 402, Royal Palms, Hill Road',
    city: 'Bandra West, Mumbai - 400050',
  });

  // Temporary selected delivery address during checkout
  const [showIosTip, setShowIosTip] = useState(true);

  // Cart Operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((e) => e.item.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (item: MenuItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((e) => e.item.id === item.id);
      if (idx >= 0) {
        if (prev[idx].quantity > 1) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity - 1 };
          return next;
        }
        return prev.filter((e) => e.item.id !== item.id);
      }
      return prev;
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
    } else {
      setCart((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], quantity: newQty };
        return next;
      });
    }
  };

  const handleAddCustomized = (item: MenuItem, qty: number, customSpice: 1 | 2 | 3, notes: string) => {
    setCart((prev) => [
      ...prev,
      {
        item,
        quantity: qty,
        customSpiceLevel: customSpice,
        notes: notes || undefined,
      },
    ]);
  };

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME20' || clean === 'TASTY50') {
      setAppliedCoupon(clean);
      return true;
    }
    return false;
  };

  // Grand Total Helper
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, it) => acc + it.item.price * it.quantity, 0),
    [cart]
  );

  const cartDiscount = useMemo(() => {
    if (appliedCoupon === 'WELCOME20') return Math.round(cartSubtotal * 0.2);
    if (appliedCoupon === 'TASTY50' && cartSubtotal >= 299) return 50;
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const cartGst = useMemo(
    () => Math.round(cartSubtotal * (branding.gstPercentage / 100)),
    [cartSubtotal, branding.gstPercentage]
  );

  const cartDeliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= branding.freeDeliveryThreshold ? 0 : branding.deliveryFeeBase;
  }, [cartSubtotal, branding.freeDeliveryThreshold, branding.deliveryFeeBase]);

  const cartGrandTotal = useMemo(
    () => Math.max(0, cartSubtotal + cartGst + cartDeliveryFee - cartDiscount),
    [cartSubtotal, cartGst, cartDeliveryFee, cartDiscount]
  );

  // Checkout Flow
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsAddressOpen(true);
  };

  const handleAddressConfirmed = (address: any) => {
    setCurrentSelectedAddress(address);
    setIsPaymentOpen(true);
  };

  const handlePaymentCompleted = (
    paymentMethod: 'razorpay_upi' | 'razorpay_card' | 'cod',
    paymentStatus: 'paid' | 'pending'
  ) => {
    const orderNumber = 'TB-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: 'order-' + Date.now(),
      orderNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      gst: cartGst,
      deliveryFee: cartDeliveryFee,
      discount: cartDiscount,
      couponCode: appliedCoupon,
      total: cartGrandTotal,
      status: 'placed',
      paymentMethod,
      paymentStatus,
      deliveryAddress: currentSelectedAddress,
      customerName: user.name,
      customerPhone: user.phone,
      createdAt: new Date().toISOString(),
      etaMinutes: 32,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setActiveTrackingOrder(newOrder);
    setIsTrackingOpen(true);
  };

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (vegOnly && !item.isVeg) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesHindi = item.hindiName?.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesHindi && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    });
  }, [menuItems, vegOnly, selectedCategory, searchQuery]);

  const totalCartCount = useMemo(
    () => cart.reduce((acc, it) => acc + it.quantity, 0),
    [cart]
  );

  const categories: FoodCategory[] = [
    'All',
    'Starters',
    'Biryani',
    'Curries',
    'Breads',
    'Desserts',
    'Beverages',
  ];

  const handleTabSelect = (tab: 'menu' | 'booking' | 'cart' | 'orders' | 'admin') => {
    setActiveTab(tab);
    if (tab === 'booking') setIsBookingOpen(true);
    if (tab === 'cart') setIsCartOpen(true);
    if (tab === 'orders') setIsOrderHistoryOpen(true);
    if (tab === 'admin') setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <TopNav
        branding={branding}
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vegOnly={vegOnly}
        onVegOnlyToggle={() => setVegOnly((prev) => !prev)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* iOS App Store / Safari PWA Install Banner */}
      {showIosTip && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-700/20 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-xl">
            <Smartphone className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>iPhone User Tip:</strong> Tap the Safari Share button ⎋ and select <strong>"Add to Home Screen"</strong> to run Tasty Bites as a full-screen native iOS app!
            </span>
          </div>
          <button
            onClick={() => setShowIosTip(false)}
            className="text-white/70 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Offers & Coupons Carousel */}
      <BannerOffers
        branding={branding}
        onApplyCoupon={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
      />

      {/* Category Horizontal Scrolling Navigation */}
      <nav className="sticky top-[106px] sm:top-[112px] z-20 bg-neutral-950/95 backdrop-blur-md border-y border-neutral-800/90 py-2.5 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
                  isSelected
                    ? 'text-neutral-950 shadow-md scale-105'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                style={isSelected ? { backgroundColor: branding.accentColor } : {}}
              >
                {cat === 'All' ? '✨ All Dishes' : cat}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Dishes Catalog Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-28">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{selectedCategory === 'All' ? 'Popular Authentic Specialties' : `${selectedCategory} Selection`}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400">
                {filteredMenuItems.length} Items
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Cooked fresh to order with authentic whole spices and tandoori charcoal ovens.
            </p>
          </div>

          {/* Quick Active Live Order Pill if order is cooking */}
          {orders.length > 0 && orders[0].status !== 'delivered' && (
            <button
              onClick={() => {
                setActiveTrackingOrder(orders[0]);
                setIsTrackingOpen(true);
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-400/25 transition animate-pulse cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Track Live Order #{orders[0].orderNumber}</span>
            </button>
          )}
        </div>

        {/* Menu Grid */}
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/50 rounded-3xl border border-neutral-800/80 p-8">
            <Utensils className="w-12 h-12 mx-auto mb-3 text-neutral-600 stroke-1" />
            <h3 className="text-lg font-bold text-white">No dishes found</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Try changing the category or clearing the search query to explore our royal menu.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setVegOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMenuItems.map((item) => {
              const inCart = cart.find((e) => e.item.id === item.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <MenuCard
                  key={item.id}
                  item={item}
                  quantityInCart={qty}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClickDetail={setSelectedDishForDetail}
                  currencySymbol={branding.currencySymbol}
                  primaryColor={branding.primaryColor}
                  accentColor={branding.accentColor}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {totalCartCount > 0 && !isCartOpen && (
        <aside className="fixed bottom-16 sm:bottom-20 inset-x-4 max-w-lg mx-auto z-30 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full p-3.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-sm text-neutral-950 transition hover:brightness-110 active:scale-98 cursor-pointer border border-amber-300/30"
            style={{ backgroundColor: branding.accentColor }}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-neutral-950 text-amber-400 flex items-center justify-center text-xs font-black">
                {totalCartCount}
              </span>
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  View Cart
                </div>
                <div className="text-[11px] text-neutral-800 font-semibold">
                  {cart.length} unique dishes added
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-black text-sm">
              <span>{branding.currencySymbol}{cartGrandTotal}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </aside>
      )}

      {/* Bottom iOS Navigation Bar */}
      <BottomTabBar
        activeTab={activeTab}
        cartCount={totalCartCount}
        onSelectTab={handleTabSelect}
        branding={branding}
      />

      {/* MODALS */}
      {/* 1. Dish Customization Detail Sheet */}
      <ItemDetailModal
        item={selectedDishForDetail}
        onClose={() => setSelectedDishForDetail(null)}
        onAddCustomized={handleAddCustomized}
        currencySymbol={branding.currencySymbol}
        primaryColor={branding.primaryColor}
        accentColor={branding.accentColor}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        branding={branding}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={(idx) => setCart((prev) => prev.filter((_, i) => i !== idx))}
        onClearCart={() => setCart([])}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Address Modal */}
      <AddressModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        branding={branding}
        onSelectAddress={handleAddressConfirmed}
      />

      {/* 4. Payment Gateway (Razorpay simulator) */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        branding={branding}
        grandTotal={cartGrandTotal}
        onCompletePayment={handlePaymentCompleted}
      />

      {/* 5. Live Order Tracking Modal */}
      <LiveTrackingModal
        order={activeTrackingOrder}
        onClose={() => setIsTrackingOpen(false)}
        branding={branding}
        onAdvanceStatus={(orderId, newStatus) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
          );
        }}
      />

      {/* 6. Table Booking Modal */}
      <TableBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        branding={branding}
        onConfirmBooking={(booking) => {
          setTableBookings((prev) => [booking, ...prev]);
        }}
      />

      {/* 7. Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        branding={branding}
        onTrackOrder={(order) => {
          setIsOrderHistoryOpen(false);
          setActiveTrackingOrder(order);
          setIsTrackingOpen(true);
        }}
        onViewInvoice={(order) => {
          setActiveInvoiceOrder(order);
          setIsInvoiceOpen(true);
        }}
        onReorder={(items) => {
          setCart(items);
          setIsOrderHistoryOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* 8. Official Printable GST Bill / Receipt Modal */}
      <BillInvoiceModal
        order={activeInvoiceOrder}
        onClose={() => setIsInvoiceOpen(false)}
        branding={branding}
      />

      {/* 9. Mobile OTP Auth Modal */}
      <PhoneAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        branding={branding}
        onLoginSuccess={(name, phone) => {
          setUser({
            ...user,
            name,
            phone,
            isLoggedIn: true,
          });
        }}
      />

      {/* 10. Admin & Kitchen Control Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        branding={branding}
        onUpdateBranding={setBranding}
        menuItems={menuItems}
        onUpdateMenuItem={(updated) => {
          setMenuItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        }}
        onAddMenuItem={(newItem) => {
          setMenuItems((prev) => [newItem, ...prev]);
        }}
        orders={orders}
        onUpdateOrderStatus={(orderId, newStatus) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
          );
          if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
            setActiveTrackingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
          }
        }}
        tableBookings={tableBookings}
      />
    </div>
  );
}
