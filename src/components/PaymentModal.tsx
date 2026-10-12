import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Banknote, Smartphone, ArrowRight } from 'lucide-react';
import { BrandingSettings } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingSettings;
  grandTotal: number;
  onCompletePayment: (paymentMethod: 'razorpay_upi' | 'razorpay_card' | 'cod', paymentStatus: 'paid' | 'pending') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  branding,
  grandTotal,
  onCompletePayment,
}) => {
  if (!isOpen) return null;

  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (selectedMethod === 'cod') {
        onCompletePayment('cod', 'pending');
      } else if (selectedMethod === 'card') {
        onCompletePayment('razorpay_card', 'paid');
      } else {
        onCompletePayment('razorpay_upi', 'paid');
      }
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Razorpay Brand Header */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">
              RZP
            </div>
            <div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Secured by Razorpay</div>
              <div className="text-sm font-bold text-white">{branding.appName} Checkout</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount to Pay Banner */}
        <div
          className="p-4 text-white flex items-center justify-between"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <div>
            <div className="text-xs text-white/80">Total Payable Amount</div>
            <div className="text-2xl font-black">{branding.currencySymbol}{grandTotal}</div>
          </div>
          <div className="text-right text-xs text-amber-300 bg-black/30 px-3 py-1.5 rounded-xl">
            <span>Instant Confirmation</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="p-4 overflow-y-auto space-y-4 text-neutral-200">
          {/* Method 1: Instant UPI Apps */}
          <div
            onClick={() => setSelectedMethod('upi')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              selectedMethod === 'upi'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-neutral-800 bg-neutral-800/40 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-bold text-white">UPI Apps (Instant 0% Fee)</div>
                  <div className="text-xs text-neutral-400">Google Pay, PhonePe, Paytm, CRED</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedMethod === 'upi' ? 'border-blue-500 bg-blue-500' : 'border-neutral-600'
              }`}>
                {selectedMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {selectedMethod === 'upi' && (
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-800">
                {[
                  { id: 'gpay', name: 'Google Pay', color: 'bg-emerald-600' },
                  { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600' },
                  { id: 'paytm', name: 'Paytm UPI', color: 'bg-sky-600' },
                  { id: 'cred', name: 'CRED UPI', color: 'bg-neutral-700' },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUpiApp(app.id as any);
                    }}
                    className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      selectedUpiApp === app.id
                        ? 'border-blue-400 bg-neutral-900 text-white'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg ${app.color} flex items-center justify-center text-white text-[10px] font-black`}>
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="truncate w-full text-center">{app.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Method 2: Credit / Debit Card */}
          <div
            onClick={() => setSelectedMethod('card')}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              selectedMethod === 'card'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-neutral-800 bg-neutral-800/40 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-sm font-bold text-white">Credit / Debit Card</div>
                  <div className="text-xs text-neutral-400">Visa, Mastercard, RuPay & Amex</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-neutral-600'
              }`}>
                {selectedMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {selectedMethod === 'card' && (
              <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2">
                <input
                  type="text"
                  placeholder="Card Number: 4532 •••• •••• 8892"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder:text-neutral-500"
                  readOnly
                  value="4532 9901 2234 8892 (Demo Card)"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="12/28"
                    readOnly
                    className="w-1/2 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                  <input
                    type="password"
                    value="•••"
                    readOnly
                    className="w-1/2 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Method 3: Cash on Delivery (Admin Controllable) */}
          {branding.codEnabled && (
            <div
              onClick={() => setSelectedMethod('cod')}
              className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                selectedMethod === 'cod'
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-neutral-800 bg-neutral-800/40 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Cash on Delivery (COD)</div>
                    <div className="text-xs text-neutral-400">Pay cash/UPI directly to the delivery partner</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'cod' ? 'border-amber-500 bg-amber-500' : 'border-neutral-600'
                }`}>
                  {selectedMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900 space-y-2">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer hover:brightness-110 disabled:opacity-60"
            style={{ backgroundColor: branding.accentColor, color: '#1F1514' }}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                <span>Authorizing with Razorpay...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2 font-black uppercase tracking-wider text-xs">
                <span>
                  {selectedMethod === 'cod' ? 'Confirm Cash Order' : `Pay ${branding.currencySymbol}${grandTotal} Now`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Encrypted SSL Gateway by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
};
