import React from 'react';
import { X, Printer, CheckCircle2, Download, Receipt } from 'lucide-react';
import { Order, BrandingSettings } from '../types';

interface BillInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
  branding: BrandingSettings;
}

export const BillInvoiceModal: React.FC<BillInvoiceModalProps> = ({
  order,
  onClose,
  branding,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        className="w-full max-w-md bg-white text-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Print/Close Action Bar */}
        <div className="bg-neutral-100 p-3 px-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
            <Receipt className="w-4 h-4 text-amber-600" />
            <span>Tax Invoice / Cash Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-xs font-semibold flex items-center gap-1 hover:bg-neutral-800 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div id="printable-bill" className="p-6 overflow-y-auto font-mono text-xs space-y-4">
          {/* Restaurant Header */}
          <div className="text-center border-b border-dashed border-neutral-400 pb-3">
            <h2 className="text-base font-black uppercase tracking-wider text-neutral-900">
              {branding.appName}
            </h2>
            <div className="text-[11px] text-neutral-600">{branding.tagline}</div>
            <div className="text-[10px] text-neutral-500 mt-1">{branding.address}</div>
            <div className="text-[10px] text-neutral-500">Ph: {branding.phone}</div>
            <div className="text-[10px] font-bold text-neutral-700 mt-1">
              FSSAI Lic: 11521019000431 • GSTIN: 27AABCT1332Q1Z3
            </div>
          </div>

          {/* Order Details */}
          <div className="border-b border-dashed border-neutral-400 pb-2 text-[11px]">
            <div className="flex justify-between">
              <span>Invoice Ref:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{order.customerName || 'Walk-in Guest'}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="uppercase font-bold text-emerald-700">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-neutral-800 text-left font-bold">
                <th className="py-1">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Amt ({branding.currencySymbol})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.items.map((item, idx) => (
                <tr key={idx} className="py-1">
                  <td className="py-1 font-sans text-neutral-800">{item.item.name}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-right font-semibold">
                    {item.item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations */}
          <div className="border-t border-dashed border-neutral-400 pt-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{branding.currencySymbol}{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span>- {branding.currencySymbol}{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>CGST (2.5%):</span>
              <span>{branding.currencySymbol}{Math.round(order.gst / 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (2.5%):</span>
              <span>{branding.currencySymbol}{Math.round(order.gst / 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `${branding.currencySymbol}${order.deliveryFee}`}</span>
            </div>
            <div className="border-t-2 border-neutral-900 pt-1.5 flex justify-between text-sm font-black">
              <span>NET PAYABLE:</span>
              <span>{branding.currencySymbol}{order.total}</span>
            </div>
          </div>

          {/* Footer Thank You */}
          <div className="text-center pt-3 border-t border-dashed border-neutral-400 text-[10px] text-neutral-500">
            <div>Thank you for dining with {branding.appName}!</div>
            <div>We hope you enjoyed the authentic royal flavors.</div>
            <div className="mt-1 font-bold text-neutral-700">*** PAID & CONFIRMED ***</div>
          </div>
        </div>
      </div>
    </div>
  );
};
