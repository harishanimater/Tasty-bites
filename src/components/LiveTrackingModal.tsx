import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Phone, Bike, ChefHat, Check, MapPin, Sparkles, Navigation } from 'lucide-react';
import { Order, BrandingSettings, OrderStatus } from '../types';

interface LiveTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  branding: BrandingSettings;
  onAdvanceStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  order,
  onClose,
  branding,
  onAdvanceStatus,
}) => {
  if (!order) return null;

  const [eta, setEta] = useState(order.etaMinutes || 30);
  const [riderProgress, setRiderProgress] = useState(45); // percentage along route

  // Simulated rider moving slightly
  useEffect(() => {
    const timer = setInterval(() => {
      setRiderProgress((prev) => (prev >= 95 ? 45 : prev + 5));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const stages: Array<{ key: OrderStatus; label: string; desc: string; icon: any }> = [
    { key: 'placed', label: 'Order Confirmed', desc: 'Received by kitchen', icon: CheckCircle2 },
    { key: 'preparing', label: 'In Tandoor & Wok', desc: 'Chef preparing fresh dishes', icon: ChefHat },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider on electric scooter', icon: Bike },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your hot meal!', icon: Check },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-4 text-white flex items-center justify-between"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-300">Live Order</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h3 className="text-lg font-black">{order.orderNumber}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-neutral-200">
          {/* ETA Banner */}
          <div className="bg-neutral-800/80 p-4 rounded-2xl border border-neutral-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Estimated Arrival</span>
              </div>
              <div className="text-2xl font-black text-amber-400 mt-0.5">
                {order.status === 'delivered' ? 'Arrived!' : `${eta} Minutes`}
              </div>
              <div className="text-[11px] text-neutral-300 mt-1">
                {order.status === 'delivered'
                  ? 'Thank you for ordering with Tasty Bites!'
                  : 'Freshly packed in insulated thermal container'}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Bike className="w-6 h-6 text-amber-400 animate-bounce" />
            </div>
          </div>

          {/* Interactive Live Scooter Map Simulation */}
          <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950 flex items-center justify-center shadow-inner">
            {/* Road path */}
            <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path
                d="M 15 50 Q 50 20 85 50"
                fill="none"
                stroke="#4B5563"
                strokeWidth="4"
                strokeDasharray="6 4"
              />
              <path
                d="M 15 50 Q 50 20 85 50"
                fill="none"
                stroke="#E9A227"
                strokeWidth="4"
                strokeDasharray="100"
                strokeDashoffset={100 - riderProgress}
              />
            </svg>

            {/* Restaurant Pin */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-red-800 text-white flex items-center justify-center shadow-lg text-xs font-black border border-red-500">
                TB
              </div>
              <span className="text-[10px] text-neutral-400 font-bold mt-1 bg-black/80 px-1.5 rounded">
                Kitchen
              </span>
            </div>

            {/* User House Pin */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border border-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-neutral-400 font-bold mt-1 bg-black/80 px-1.5 rounded">
                You
              </span>
            </div>

            {/* Moving Scooter Marker */}
            <div
              className="absolute top-1/2 -translate-y-8 flex flex-col items-center transition-all duration-1000"
              style={{ left: `${riderProgress}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-7 h-7 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg font-bold border border-white">
                <Bike className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-amber-300 bg-neutral-900/90 px-1 rounded mt-0.5 border border-amber-400/30">
                Rider Rajesh
              </span>
            </div>
          </div>

          {/* Stepper Status Indicators */}
          <div className="p-4 bg-neutral-800/40 rounded-2xl border border-neutral-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Order Milestones
            </h4>
            <div className="space-y-4 relative">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isPending = idx > currentStageIndex;

                return (
                  <div key={stage.key} className="flex items-start gap-3">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-amber-400 text-neutral-950 shadow-md ring-4 ring-amber-400/20'
                            : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {idx < stages.length - 1 && (
                        <div
                          className={`w-0.5 h-7 mt-1 ${
                            idx < currentStageIndex ? 'bg-emerald-500' : 'bg-neutral-800'
                          }`}
                        />
                      )}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-amber-400'
                            : isCompleted
                            ? 'text-white'
                            : 'text-neutral-500'
                        }`}
                      >
                        {stage.label}
                      </div>
                      <div className="text-[11px] text-neutral-400">{stage.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Partner Contact Card */}
          <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 font-black">
                RP
              </div>
              <div>
                <div className="text-xs font-bold text-white">Rajesh Patel (Delivery Partner)</div>
                <div className="text-[11px] text-neutral-400">Vaccinated • Thermal Bag Assured</div>
              </div>
            </div>
            <a
              href={`tel:${branding.phone.replace(/[^0-9+]/g, '')}`}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
              title="Call Delivery Partner"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Ordered Dishes Summary */}
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <div className="font-bold text-white mb-2">Dishes in this order:</div>
            <ul className="space-y-1">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.item.name}
                  </span>
                  <span className="font-semibold text-neutral-400">
                    {branding.currencySymbol}{item.item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-white transition cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
