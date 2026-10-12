import React, { useState } from 'react';
import { X, Calendar, Users, Clock, Utensils, CheckCircle2, Sparkles } from 'lucide-react';
import { BrandingSettings, TableBooking } from '../types';

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingSettings;
  onConfirmBooking: (booking: TableBooking) => void;
}

export const TableBookingModal: React.FC<TableBookingModalProps> = ({
  isOpen,
  onClose,
  branding,
  onConfirmBooking,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('Ananya Sharma');
  const [phone, setPhone] = useState('+91 98200 12345');
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('8:00 PM (Dinner)');
  const [seatingArea, setSeatingArea] = useState<'Indoor AC' | 'Rooftop Tandoor' | 'Family Hall' | 'Private Dining'>('Rooftop Tandoor');
  const [occasion, setOccasion] = useState<'Birthday' | 'Anniversary' | 'Business Dinner' | 'Casual'>('Casual');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  const lunchSlots = ['12:30 PM', '1:15 PM', '2:00 PM', '2:45 PM'];
  const dinnerSlots = ['7:30 PM', '8:15 PM', '9:00 PM', '9:45 PM', '10:30 PM'];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const bookingNumber = 'TB-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking: TableBooking = {
      id: 'book-' + Date.now(),
      bookingNumber,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      guests,
      date,
      timeSlot,
      seatingArea,
      specialOccasion: occasion,
      specialRequest: specialRequest.trim(),
      status: 'confirmed',
      tableAssigned: `Table ${Math.floor(Math.random() * 15) + 1}`,
      createdAt: new Date().toISOString(),
    };

    onConfirmBooking(newBooking);
    setConfirmedBookingId(bookingNumber);
    setIsSuccess(true);
  };

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
          <div className="flex items-center gap-2.5">
            <Utensils className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base leading-tight">Reserve a Royal Table</h3>
              <p className="text-xs text-white/80">{branding.appName} Fine Dining Experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center text-neutral-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-white mb-1">Table Confirmed!</h4>
            <div className="text-xs font-mono font-bold text-amber-400 bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700 mb-4">
              Booking Ref: {confirmedBookingId}
            </div>
            <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
              We look forward to welcoming you and your guests. A confirmation SMS with directions has been sent to {phone}.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-900 shadow-md cursor-pointer hover:brightness-110"
              style={{ backgroundColor: branding.accentColor }}
            >
              Done & Return to Menu
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-4 overflow-y-auto space-y-4 text-neutral-200">
            {/* Guest Counter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Number of Guests
              </label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border transition cursor-pointer ${
                      guests === num
                        ? 'border-amber-400 bg-amber-400 text-neutral-950 shadow-md'
                        : 'border-neutral-800 bg-neutral-800/60 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Select Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-400"
                >
                  <optgroup label="Lunch">
                    {lunchSlots.map((slot) => (
                      <option key={slot} value={`${slot} (Lunch)`}>
                        {slot} (Lunch)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Dinner">
                    {dinnerSlots.map((slot) => (
                      <option key={slot} value={`${slot} (Dinner)`}>
                        {slot} (Dinner)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Seating Ambiance Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Preferred Seating Ambiance
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Indoor AC', desc: 'Regal interior chandelier dining' },
                  { name: 'Rooftop Tandoor', desc: 'Open-air candlelit with live kitchen' },
                  { name: 'Family Hall', desc: 'Spacious circular sofa seating' },
                  { name: 'Private Dining', desc: 'Exclusive curtained royal lounge' },
                ].map((area) => (
                  <button
                    key={area.name}
                    type="button"
                    onClick={() => setSeatingArea(area.name as any)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      seatingArea === area.name
                        ? 'border-amber-400 bg-amber-400/15 text-white'
                        : 'border-neutral-800 bg-neutral-800/40 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{area.name}</div>
                    <div className="text-[10px] text-neutral-400 line-clamp-1">{area.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* Special Request */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Special Requests / Occasion (Optional)
              </label>
              <input
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Anniversary candlelight setup, quiet corner..."
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm transition shadow-lg active:scale-98 cursor-pointer hover:brightness-110"
                style={{ backgroundColor: branding.accentColor, color: '#1F1514' }}
              >
                Confirm Table Reservation (No Advance Fee)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
