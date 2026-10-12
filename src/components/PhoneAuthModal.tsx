import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { BrandingSettings } from '../types';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingSettings;
  onLoginSuccess: (name: string, phone: string) => void;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  isOpen,
  onClose,
  branding,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [name, setName] = useState('Harish Kumar');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setOtp('123456'); // Pre-fill for user convenience
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456' && otp.length !== 6) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(name.trim() || 'Guest Customer', `+91 ${phone}`);
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    onLoginSuccess('Harish Kumar', '+91 9876543210');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-5 text-white flex items-center justify-between"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">Sign In or Register</h3>
              <p className="text-xs text-white/80">Save addresses & track royal orders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-neutral-200">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Harish Kumar"
                  className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Mobile Number (India)
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm font-bold text-neutral-300 flex items-center">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="9876543210"
                    className="flex-1 px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white font-mono tracking-wider placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: branding.accentColor, color: '#1F1514' }}
              >
                {isLoading ? (
                  <span>Sending 6-Digit OTP...</span>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700 text-xs text-neutral-300 flex justify-between items-center">
                <span>
                  Code sent to <strong>+91 {phone}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-amber-400 font-bold underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Enter 6-Digit OTP (Demo: 123456)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.6em] px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-xl font-mono font-bold text-amber-400 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer hover:brightness-110"
                style={{ backgroundColor: branding.accentColor, color: '#1F1514' }}
              >
                {isLoading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Bypass Button */}
          <div className="pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-amber-400 flex items-center justify-center gap-1.5 transition cursor-pointer border border-neutral-700"
            >
              <UserCheck className="w-4 h-4" />
              <span>1-Click Test Login (Auto-fill Demo Account)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
