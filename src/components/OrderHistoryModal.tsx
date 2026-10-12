import React from 'react';
import { X, Clock, Repeat, Receipt, Bike, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { Order, BrandingSettings, CartItem } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  branding: BrandingSettings;
  onTrackOrder: (order: Order) => void;
  onViewInvoice: (order: Order) => void;
  onReorder: (items: CartItem[]) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  branding,
  onTrackOrder,
  onViewInvoice,
  onReorder,
}) => {
  if (!isOpen) return null;

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
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Your Orders & History</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-neutral-200 flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-neutral-600 stroke-1" />
              <h4 className="font-bold text-base text-white">No previous orders yet</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Once you place an order, you can track it live, download tax invoices, and reorder with one click.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isDelivered = order.status === 'delivered';

              return (
                <div
                  key={order.id}
                  className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-800 space-y-3 hover:border-neutral-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-amber-400">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                          isDelivered
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-400/20 text-amber-400 border border-amber-400/30 animate-pulse'
                        }`}
                      >
                        {isDelivered ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Delivered</span>
                          </>
                        ) : (
                          <>
                            <Bike className="w-3 h-3" />
                            <span>In Progress</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Dishes Preview */}
                  <div className="text-xs text-neutral-300 line-clamp-2 bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800/80">
                    {order.items.map((it) => `${it.quantity}x ${it.item.name}`).join(' • ')}
                  </div>

                  {/* Bottom Action Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                        Total Paid
                      </span>
                      <span className="text-sm font-black text-white">
                        {branding.currencySymbol}{order.total}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewInvoice(order)}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="View Official Receipt"
                      >
                        <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bill</span>
                      </button>

                      {!isDelivered ? (
                        <button
                          onClick={() => onTrackOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 text-neutral-950 hover:bg-amber-300 text-xs font-bold flex items-center gap-1 transition shadow-md cursor-pointer"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Track Live</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onReorder(order.items)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Reorder</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
