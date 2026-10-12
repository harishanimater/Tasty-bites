export interface BrandingSettings {
  appName: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  currencySymbol: string;
  gstPercentage: number;
  deliveryFeeBase: number;
  freeDeliveryThreshold: number;
  codEnabled: boolean;
  phone: string;
  address: string;
  openingHours: string;
}

export type FoodCategory =
  | 'All'
  | 'Starters'
  | 'Biryani'
  | 'Curries'
  | 'Breads'
  | 'Desserts'
  | 'Beverages';

export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  price: number;
  category: FoodCategory;
  isVeg: boolean;
  spiceLevel: 1 | 2 | 3; // 1: Mild, 2: Medium, 3: Spicy
  isBestSeller?: boolean;
  isAvailable: boolean;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  prepTimeMinutes: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
  customSpiceLevel?: 1 | 2 | 3;
}

export type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: 'razorpay_upi' | 'razorpay_card' | 'cod';
  paymentStatus: 'paid' | 'pending';
  deliveryAddress: {
    tag: string;
    street: string;
    city: string;
    landmark?: string;
  };
  customerName: string;
  customerPhone: string;
  createdAt: string;
  etaMinutes: number;
}

export interface TableBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  guests: number;
  date: string;
  timeSlot: string;
  seatingArea: 'Indoor AC' | 'Rooftop Tandoor' | 'Family Hall' | 'Private Dining';
  specialOccasion?: 'Birthday' | 'Anniversary' | 'Business Dinner' | 'Casual';
  specialRequest?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  tableAssigned?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  isLoggedIn: boolean;
  savedAddresses: Array<{
    id: string;
    tag: 'Home' | 'Work' | 'Other';
    street: string;
    city: string;
  }>;
}
