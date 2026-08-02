import React, { useState } from 'react';
import { NOTARY_SERVICES, TRAVEL_OPTIONS, TRAVEL_BRACKETS, Booking, ContactInquiry, WeeklySchedule, ALL_TIME_SLOTS, isTypicalWorkingHour } from '../types';
import { 
  Calendar as CalendarIcon, Clock, MapPin, User, Mail, Phone, 
  ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, 
  ShieldCheck, Calculator, Sparkles, Building, Landmark, Laptop, FileText, Info
} from 'lucide-react';
import ContactQRCode from './ContactQRCode';

interface BookingWizardProps {
  onBookingCreated: (booking: Booking) => void;
  onInquiryCreated: (inquiry: ContactInquiry) => void;
  schedule: WeeklySchedule;
}

export default function BookingWizard({ onBookingCreated, onInquiryCreated, schedule }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  
  // Step 1: Service & Quantity & Location Type
  const [selectedServiceId, setSelectedServiceId] = useState(NOTARY_SERVICES[0].id);
  const [quantity, setQuantity] = useState(1);
  const [locationType, setLocationType] = useState('home'); // home, office, hospital, nursing_home
  
  // Step 2: Location Address & Distance Bracket
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [distanceBracketId, setDistanceBracketId] = useState('under_10');
  const [customDistanceMiles, setCustomDistanceMiles] = useState(45);

  // Step 3: Date & Time
  const [selectedDate, setSelectedDate] = useState(''); // YYYY-MM-DD
  const [selectedSlot, setSelectedSlot] = useState(''); // e.g., "10:00 AM"
  const [currentMonth, setCurrentMonth] = useState(new Date()); // For inline calendar navigation

  // Step 4: Contact Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 5: Success State
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Weekly Work Schedule checks for Instant Booking vs Forced Inquiry
  const getDayOfWeek = (dateStr: string) => {
    if (!dateStr) return '';
    const dateParts = dateStr.split('-');
    const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getSlotStatus = (dateStr: string, slotStr: string) => {
    if (!dateStr || !slotStr || !schedule) return 'home';
    const day = getDayOfWeek(dateStr);
    return (schedule[day] && schedule[day][slotStr]) || 'home';
  };

  const isForcedInquiry = selectedDate && selectedSlot ? (
    !isTypicalWorkingHour(getDayOfWeek(selectedDate), selectedSlot) || getSlotStatus(selectedDate, selectedSlot) === 'away'
  ) : false;

  // Helper lists & functions
  const selectedService = NOTARY_SERVICES.find(s => s.id === selectedServiceId) || NOTARY_SERVICES[0];
  const selectedLocation = TRAVEL_OPTIONS.find(l => l.id === locationType) || TRAVEL_OPTIONS[0];
  const selectedDistanceBracket = TRAVEL_BRACKETS.find(b => b.id === distanceBracketId) || TRAVEL_BRACKETS[0];

  // Dynamically calculate estimated fees
  const calculateEstimatedFees = () => {
    const notaryFee = selectedService.fee * quantity;
    let travelFee = 0;
    
    if (selectedDistanceBracket.id === 'over_40') {
      const extraMiles = Math.max(0, customDistanceMiles - 40);
      travelFee = 60 + extraMiles * 1.0;
    } else {
      travelFee = selectedDistanceBracket.fee;
    }
    
    return {
      notaryFee,
      travelFee,
      total: notaryFee + travelFee
    };
  };

  const { notaryFee, travelFee, total } = calculateEstimatedFees();

  // Custom Inline Calendar Logic
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleMonthNav = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    // Prevent navigating to past months
    const today = new Date();
    today.setHours(0,0,0,0);
    const checkDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    if (checkDate >= today) {
      setCurrentMonth(newDate);
    }
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth);
    const startDay = startDayOfMonth(currentMonth);
    const today = new Date();
    today.setHours(0,0,0,0);

    const dayCells: React.ReactNode[] = [];

    // Empty blank cells for start day offset
    for (let i = 0; i < startDay; i++) {
      dayCells.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Actual day cells
    for (let d = 1; d <= totalDays; d++) {
      const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const isPast = cellDate < today;
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate === dateString;

      dayCells.push(
        <button
          key={`day-${d}`}
          type="button"
          disabled={isPast}
          onClick={() => {
            setSelectedDate(dateString);
            setSelectedSlot(''); // Reset slot on date change
          }}
          className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold transition-all relative ${
            isPast 
              ? 'text-gray-600 cursor-not-allowed opacity-30' 
              : isSelected
                ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/20 scale-105'
                : 'text-gray-200 hover:bg-[#C5A059]/10 hover:text-[#C5A059] border border-transparent hover:border-[#C5A059]/20'
          }`}
        >
          {d}
          {/* Highlight indicator for today */}
          {cellDate.getTime() === today.getTime() && (
            <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-black' : 'bg-[#C5A059]'}`}></span>
          )}
        </button>
      );
    }

    return dayCells;
  };

  const timeSlots = {
    standard: [
      "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
      "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
    ],
    afterHours: [
      "6:00 AM", "7:00 AM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"
    ],
    emergency: [
      "11:00 PM", "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM"
    ]
  };

  // Step Validation Helpers
  const isStepValid = () => {
    if (step === 1) return true; // Service and location always selected
    if (step === 2) {
      return streetAddress.trim() !== '' && city.trim() !== '' && zipCode.trim() !== '';
    }
    if (step === 3) {
      return selectedDate !== '' && selectedSlot !== '';
    }
    if (step === 4) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return clientName.trim() !== '' && emailRegex.test(clientEmail) && clientPhone.trim().length >= 7;
    }
    return true;
  };

  const handleNext = () => {
    if (isStepValid()) {
      if (step < 5) {
        setStep(step + 1);
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Complete Booking Submission or Inquiry Submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;

    if (isForcedInquiry) {
      // Create Inquiry
      const inquiryId = 'INQ-' + Math.floor(100000 + Math.random() * 900000);
      const serviceName = selectedService.name;
      const fullInquiryMessage = `[Forced Inquiry via Work Schedule] [Requested Slot: ${selectedDate} at ${selectedSlot}] client wants ${serviceName} (x${quantity}) at ${streetAddress}, ${city}, FL ${zipCode}. Travel Bracket: ${selectedDistanceBracket.milesRange}. Customer Note: ${additionalNotes}`;

      const newInquiry: ContactInquiry = {
        id: inquiryId,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        message: fullInquiryMessage,
        createdAt: new Date().toISOString()
      };

      onInquiryCreated(newInquiry);
      setStep(5);
    } else {
      const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
      
      // Exact starting address of Georgina (hidden from customer facing views but used internally for reference and tracking calculations)
      const secretStartAddress = "2406 taloncrest ct, eagle lake fl";

      const newBooking: Booking = {
        id: bookingId,
        clientName,
        clientEmail,
        clientPhone,
        serviceId: selectedServiceId,
        quantity,
        locationType,
        customAddress: `${streetAddress}, ${city}, FL ${zipCode}`,
        distanceBracketId: distanceBracketId,
        customDistanceMiles: distanceBracketId === 'over_40' ? customDistanceMiles : undefined,
        date: selectedDate,
        timeSlot: selectedSlot,
        additionalNotes: additionalNotes.trim() !== '' ? additionalNotes : undefined,
        estimatedNotaryFee: notaryFee,
        estimatedTravelFee: travelFee,
        estimatedTotal: total,
        status: 'confirmed', // Instantly confirm to simulate seamless experience
        createdAt: new Date().toISOString()
      };

      onBookingCreated(newBooking);
      setCreatedBooking(newBooking);
      setStep(5);
    }
  };

  // Location type styling icon selectors
  const getLocationIcon = (id: string) => {
    switch (id) {
      case 'home': return <MapPin className="w-5 h-5 text-[#C5A059]" />;
      case 'office': return <Building className="w-5 h-5 text-[#C5A059]" />;
      case 'hospital': return <AlertCircle className="w-5 h-5 text-[#C5A059]" />;
      case 'nursing_home': return <Landmark className="w-5 h-5 text-[#C5A059]" />;
      default: return <MapPin className="w-5 h-5 text-[#C5A059]" />;
    }
  };

  return (
    <section id="booking-section" className="py-20 px-4 md:px-8 bg-[#0A0A0A] text-gray-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" /> Book Georgina Online
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
            Schedule a <span className="text-[#C5A059] italic font-normal">Notarization</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            Choose your services, calculate travel distance, select a convenient date, and secure your appointment in less than 2 minutes.
          </p>
        </div>

        {/* Outer Form Container */}
        <div className="bg-[#121212] border border-[#2D2D2D] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Progress Indicators */}
          {step < 5 && (
            <div className="bg-[#0D0D0D] px-6 py-4 border-b border-[#2D2D2D] flex justify-between items-center overflow-x-auto gap-4 scrollbar-none">
              {[
                { s: 1, label: 'Service' },
                { s: 2, label: 'Travel' },
                { s: 3, label: 'Date & Time' },
                { s: 4, label: 'Contact' }
              ].map((stepItem, index) => {
                const isCompleted = step > stepItem.s;
                const isActive = step === stepItem.s;

                return (
                  <div key={stepItem.s} className="flex items-center gap-2 shrink-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                      isCompleted 
                        ? 'bg-[#C5A059] text-black' 
                        : isActive
                          ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]'
                          : 'bg-[#121212] text-gray-500 border border-gray-700'
                    }`}>
                      {isCompleted ? '✓' : stepItem.s}
                    </span>
                    <span className={`text-xs font-serif ${isActive ? 'text-[#C5A059] font-bold' : isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                      {stepItem.label}
                    </span>
                    {index < 3 && <span className="text-gray-700 text-xs ml-1 font-sans">→</span>}
                  </div>
                );
              })}
            </div>
          )}

          <form onSubmit={handleSubmitBooking} className="p-6 md:p-8">
            
            {/* Step 1: Select Service, Quantity and Location Type */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-[#2D2D2D] pb-4">
                  <h3 className="text-xl font-serif text-white">Select Notary Services & Meeting Type</h3>
                  <p className="text-xs text-gray-400 mt-1">Which document types do you need notarized and where?</p>
                </div>

                {/* Service Picker */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059]">1. Select Notary Act</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {NOTARY_SERVICES.map((srv) => {
                      const isSelected = selectedServiceId === srv.id;
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => {
                            setSelectedServiceId(srv.id);
                            // Auto trigger Location RON if RON is selected
                            if (srv.id === 'ron') {
                              setLocationType('ron_only');
                            } else if (locationType === 'ron_only') {
                              setLocationType('home'); // revert from RON
                            }
                          }}
                          className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                            isSelected 
                              ? 'bg-[#C5A059]/10 border-[#C5A059] text-white shadow-lg' 
                              : 'bg-[#0D0D0D]/60 border-[#2D2D2D] text-gray-300 hover:border-[#C5A059]/40 hover:bg-[#C5A059]/5'
                          }`}
                        >
                          <span className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-lg shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="font-serif font-bold text-sm tracking-wide text-white">{srv.name}</h4>
                            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{srv.description}</p>
                            <span className="inline-block mt-2 text-xs font-semibold text-[#C5A059] bg-[#C5A059]/15 px-2 py-0.5 rounded-full border border-[#C5A059]/20">
                              {srv.feeLabel}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-2">2. Quantity of Notarial Acts</label>
                    <p className="text-[11px] text-gray-400 mb-3">Number of seals/signatures needed across your documents.</p>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-[#0D0D0D] border border-[#2D2D2D] text-white rounded-lg hover:border-[#C5A059] active:bg-[#C5A059]/10 text-xl font-bold flex items-center justify-center transition"
                      >
                        -
                      </button>
                      <span className="w-16 text-center text-xl font-mono font-bold text-white bg-[#0D0D0D] border border-[#2D2D2D] py-1.5 rounded-lg select-none">
                        {quantity}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-[#0D0D0D] border border-[#2D2D2D] text-white rounded-lg hover:border-[#C5A059] active:bg-[#C5A059]/10 text-xl font-bold flex items-center justify-center transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Meeting Location Type Picker */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-2">3. Notary Meeting Format</label>
                    <p className="text-[11px] text-gray-400 mb-3">Where should Georgina meet you for the notarization?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {TRAVEL_OPTIONS.map((opt) => {
                        const isSelected = locationType === opt.id;
                        // Disable standard mobile options if selected service is RON
                        const isDisabled = selectedServiceId === 'ron' && opt.id !== 'ron_only';

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setLocationType(opt.id)}
                            className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all ${
                              isDisabled 
                                ? 'opacity-20 cursor-not-allowed border-dashed border-gray-800'
                                : isSelected 
                                  ? 'bg-[#C5A059]/10 border-[#C5A059] text-white' 
                                  : 'bg-[#0D0D0D]/60 border-[#2D2D2D] text-gray-400 hover:border-[#C5A059]/30 hover:bg-[#C5A059]/5'
                            }`}
                          >
                            <span className="shrink-0">{getLocationIcon(opt.id)}</span>
                            <span className="truncate font-semibold text-[11px]">{opt.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address & Distance details */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-[#2D2D2D] pb-4">
                  <h3 className="text-xl font-serif text-white">Provide Travel & Distance Information</h3>
                  <p className="text-xs text-gray-400 mt-1">We come directly to your specified location in Central Florida.</p>
                </div>

                {/* Input Details */}
                <div className="space-y-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059]">1. Meeting Address</label>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Street Address, Apt / Suite / Unit / Hospital Room #"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      required
                      className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="City (Central Florida Area)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C5A059]"
                      />
                      <input 
                        type="text" 
                        placeholder="Zip Code"
                        maxLength={5}
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>

                {/* Distance bracket calculator selection */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                    2. Approximate Travel Distance Bracket (From starting point in Eagle Lake, FL - subject to change)
                  </label>
                  <p className="text-[11px] text-gray-400">Our statutory travel rates are pre-determined by distance tiers to keep booking fair.</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {TRAVEL_BRACKETS.map((brk) => {
                      const isSelected = distanceBracketId === brk.id;
                      return (
                        <button
                          key={brk.id}
                          type="button"
                          onClick={() => setDistanceBracketId(brk.id)}
                          className={`p-3 rounded-xl border text-center flex flex-col justify-center items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-[#C5A059]/10 border-[#C5A059] text-white shadow-md'
                              : 'bg-[#0D0D0D]/60 border-[#2D2D2D] text-gray-400 hover:border-[#C5A059]/30'
                          }`}
                        >
                          <span className="text-[10px] font-medium text-gray-400">{brk.milesRange}</span>
                          <span className="font-mono font-bold text-[#C5A059] text-xs">
                            {brk.id === 'over_40' ? 'starts $60' : `$${brk.fee}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {distanceBracketId === 'over_40' && (
                    <div className="p-4 bg-[#C5A059]/5 rounded-xl border border-[#2D2D2D] animate-fadeIn">
                      <label className="block text-xs font-medium text-gray-300 mb-2">Select Estimated Distance (Miles)</label>
                      <div className="flex items-center gap-4">
                        <input 
                           type="range" 
                           min="41" 
                           max="120" 
                           value={customDistanceMiles}
                           onChange={(e) => setCustomDistanceMiles(parseInt(e.target.value))}
                           className="w-full accent-[#C5A059] bg-[#2D2D2D] rounded-lg h-2 cursor-pointer"
                        />
                        <span className="text-[#C5A059] font-mono font-bold text-sm bg-[#0D0D0D] px-3 py-1 rounded-md border border-[#2D2D2D] shrink-0">
                           {customDistanceMiles} mi
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">
                        Calculated at $60.00 base for up to 40 miles, plus $1.00 for every additional mile (Total: ${60 + (customDistanceMiles - 40)}). All travel rates are fully transparent.
                      </p>
                    </div>
                  )}
                </div>

                {/* Info Note */}
                <div className="p-3.5 bg-[#C5A059]/5 rounded-xl border border-[#2D2D2D] text-xs text-gray-300 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[#C5A059] font-serif font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Negotiable Travel Fee Info</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-400">
                    Travel fees are <span className="text-[#C5A059] font-semibold">negotiable and will be agreed upon prior to finalized booking</span>. Because Georgina is a mobile notary, the exact fee depends on where she is located at that moment in time relative to your location. If you are unsure about the distance bracket, we will review the address and contact you. You will receive a follow-up communication via <span className="text-white font-semibold">text message</span> about the travel fee if it applies.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Calendar Date and Slot Picker */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-[#2D2D2D] pb-4">
                  <h3 className="text-xl font-serif text-white">Select Date & Time</h3>
                  <p className="text-xs text-gray-400 mt-1">Pick a date and convenient slot. Same-day & after-hours available.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Inline Calendar - 7 Cols */}
                  <div className="md:col-span-7 bg-[#0D0D0D] rounded-xl border border-[#2D2D2D] p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-serif font-bold text-sm text-white">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h4>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMonthNav('prev')}
                          className="p-1.5 rounded-lg bg-[#121212] border border-[#2D2D2D] text-gray-400 hover:text-white transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMonthNav('next')}
                          className="p-1.5 rounded-lg bg-[#121212] border border-[#2D2D2D] text-gray-400 hover:text-white transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Weekdays header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#C5A059] font-serif font-semibold mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                        <div key={w} className="h-6 flex items-center justify-center">{w}</div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {renderCalendarDays()}
                    </div>
                  </div>

                  {/* Time Slots - 5 Cols */}
                  <div className="md:col-span-5 space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Available Time Slots</h4>
                    {selectedDate === '' ? (
                      <div className="p-8 rounded-xl bg-[#0D0D0D]/40 border border-[#2D2D2D] text-center text-sm text-gray-500 italic">
                        Please select a date on the calendar to view slots.
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1">
                                             {/* Standard Slots */}
                        <div>
                          <span className="text-[10px] text-gray-400 block mb-1 font-serif italic">Standard Business Hours</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {timeSlots.standard.map(slot => {
                              const isUnavailable = selectedDate ? getSlotStatus(selectedDate, slot) === 'unavailable' : false;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isUnavailable}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all ${
                                    selectedSlot === slot 
                                      ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]' 
                                      : isUnavailable
                                        ? 'bg-[#121212]/30 text-gray-600 border-red-950/20 line-through cursor-not-allowed opacity-30'
                                        : 'bg-[#0D0D0D] text-gray-300 border-[#2D2D2D] hover:border-[#C5A059]/30'
                                  }`}
                                >
                                  {slot} {isUnavailable && '🚫'}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* After Hours Slots */}
                        <div>
                          <span className="text-[10px] text-[#C5A059]/80 block mb-1 font-serif italic">After-Hours Appointments (+ Travel Premium)</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {timeSlots.afterHours.map(slot => {
                              const isUnavailable = selectedDate ? getSlotStatus(selectedDate, slot) === 'unavailable' : false;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isUnavailable}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all ${
                                    selectedSlot === slot 
                                      ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]' 
                                      : isUnavailable
                                        ? 'bg-[#121212]/30 text-gray-600 border-red-950/20 line-through cursor-not-allowed opacity-30'
                                        : 'bg-[#0D0D0D] text-[#C5A059] border-[#2D2D2D] hover:border-[#C5A059]/40'
                                  }`}
                                >
                                  {slot} {isUnavailable && '🚫'}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Late night Slots */}
                        <div>
                          <span className="text-[10px] text-red-400 block mb-1 font-serif italic">Late Night / Emergency</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {timeSlots.emergency.map(slot => {
                              const isUnavailable = selectedDate ? getSlotStatus(selectedDate, slot) === 'unavailable' : false;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isUnavailable}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all ${
                                    selectedSlot === slot 
                                      ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]' 
                                      : isUnavailable
                                        ? 'bg-[#121212]/30 text-gray-600 border-red-950/20 line-through cursor-not-allowed opacity-30'
                                        : 'bg-[#0D0D0D] text-red-300 border-red-500/20 hover:border-red-400'
                                  }`}
                                >
                                  {slot} {isUnavailable && '🚫'}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>

                {selectedDate && selectedSlot && (
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
                    isForcedInquiry 
                      ? 'bg-amber-950/10 border-amber-500/20' 
                      : 'bg-emerald-950/10 border-emerald-500/20'
                  }`}>
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider block text-gray-400">Selected Appointment:</span>
                      <span className="text-sm font-serif font-bold text-white">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} at <span className="font-mono text-[#C5A059]">{selectedSlot}</span>
                      </span>
                    </div>
                    
                    {/* Routing status tag */}
                    <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                      isForcedInquiry 
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {isForcedInquiry ? (
                        <>
                          <Info className="w-3.5 h-3.5 shrink-0" /> Mobile Inquiry Required
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> 🏡 Instant Booking Eligible
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Contact & Confirm Details */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-[#2D2D2D] pb-4">
                  <h3 className="text-xl font-serif text-white">Your Contact Details & Confirmation</h3>
                  <p className="text-xs text-gray-400 mt-1">Complete your booking details. We will send notifications directly to you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase">Full Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                          <User className="w-4 h-4" />
                        </span>
                        <input 
                          type="text" 
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input 
                          type="email" 
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="johndoe@example.com"
                          className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase">Phone Number</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                          <Phone className="w-4 h-4" />
                        </span>
                        <input 
                          type="tel" 
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="(407) 555-0199"
                          className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase">Additional Instructions or Special Notes</label>
                      <textarea 
                        rows={5}
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="e.g. Please call upon arrival, documents need two witnesses, hospital floor details, etc."
                        className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#C5A059] resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Checklist Requirements */}
                <div className="p-4 bg-[#C5A059]/5 rounded-xl border border-[#2D2D2D] space-y-2.5">
                  <h4 className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Important Notary Requirements
                  </h4>
                  <ul className="text-[11px] text-gray-300 space-y-1.5 list-disc pl-4">
                    <li>All signatories **must possess active, unexpired government-issued photo identification** (e.g. Driver's license, Passport).</li>
                    <li>Signatories **must be mentally competent, fully aware, and signing under their own free will**.</li>
                    <li>If the document requires independent witnesses, please arrange them or specify in the notes.</li>
                  </ul>
                </div>

                {/* Travel Fee Disclaimer Callout */}
                <div className="p-4 bg-[#C5A059]/10 rounded-xl border border-[#C5A059]/30 space-y-1.5">
                  <h4 className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                    <Info className="w-4 h-4 text-[#C5A059]" /> Travel Fee Agreement Communication
                  </h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    By submitting this request, you acknowledge that <span className="text-[#C5A059] font-semibold">travel fees are negotiable and will be agreed upon prior to finalized booking</span>. You will receive a follow-up communication via <span className="text-white font-semibold">text message</span> about the travel fee if it applies.
                  </p>
                </div>

                {/* Away/Mobile Forced Inquiry Warning */}
                {isForcedInquiry && (
                  <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-1.5">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Info className="w-4 h-4 text-amber-400" /> Georgina is Away / Mobile during this slot
                    </h4>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Because Georgina is scheduled for mobile notary field services during this hour, this appointment slot is <span className="text-amber-400 font-semibold">Inquiry Only</span>. Submit your request below, and Georgina will review and follow up with you via text to finalize travel details and coordinate the meeting.
                    </p>
                  </div>
                )}

                {/* Itemized Estimate Review Card */}
                <div className="bg-[#0D0D0D] p-4 rounded-xl border border-[#2D2D2D]">
                  <h4 className="font-serif font-bold text-sm text-white mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#C5A059]" />
                    Itemized Quote Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-gray-400">
                    <span>Service chosen:</span>
                    <span className="text-right text-white font-medium">{selectedService.name}</span>

                    <span>Quantity of acts:</span>
                    <span className="text-right text-white font-mono">{quantity}x</span>

                    <span>Notary fee ({quantity} x ${selectedService.fee}):</span>
                    <span className="text-right text-white font-mono">${notaryFee}.00</span>

                    <span>Travel destination:</span>
                    <span className="text-right text-white">{selectedLocation.name}</span>

                    <span>Travel distance fee:</span>
                    <span className="text-right text-white font-mono">${travelFee}.00</span>

                    <span className="font-bold text-[#C5A059] text-sm mt-2 pt-2 border-t border-[#2D2D2D]">Estimated Total:</span>
                    <span className="text-right text-[#C5A059] text-base font-bold font-mono mt-2 pt-2 border-t border-[#2D2D2D]">${total}.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: SUCCESS RECEIPT */}
            {step === 5 && (
              <div className="text-center py-8 space-y-6 animate-fadeIn">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isForcedInquiry 
                    ? 'bg-amber-500/10 border border-amber-500 text-amber-400' 
                    : 'bg-[#C5A059]/10 border border-[#C5A059] text-[#C5A059]'
                }`}>
                  {isForcedInquiry ? (
                    <Info className="w-10 h-10 animate-scaleIn" />
                  ) : (
                    <CheckCircle2 className="w-10 h-10 animate-scaleIn" />
                  )}
                </div>
                
                {isForcedInquiry ? (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif text-white">Inquiry Request Sent!</h3>
                    <p className="text-xs text-amber-400 font-mono mt-1">Status: Pending Administrative Review</p>
                    <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto">
                      Thank you for your request! Your inquiry has been sent to **Georgina Aubain**. Because she is away from home conducting off-site notary signings during this slot, she will review your address and text you shortly to finalize details.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif text-white">Notarization Confirmed!</h3>
                    <p className="text-xs text-[#C5A059] font-mono mt-1">Receipt ID: {createdBooking ? createdBooking.id : 'BK-INSTANT'}</p>
                    <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto">
                      Your appointment has been registered with **Georgina Aubain**. You will receive a follow-up communication via <span className="text-[#C5A059] font-semibold">text message</span> shortly to agree on and finalize the travel fee details prior to booking finalization.
                    </p>
                  </div>
                )}

                {/* Ticket and QR Code Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">
                  {/* Ticket Receipt Visual */}
                  <div className="bg-[#0D0D0D] border border-[#2D2D2D] rounded-2xl w-full text-left relative overflow-hidden shadow-xl font-mono flex flex-col justify-between">
                    {/* Decorative side ticket notches */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#121212] rounded-full border border-[#2D2D2D] transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#121212] rounded-full border border-[#2D2D2D] transform -translate-y-1/2"></div>

                    <div className="p-5 border-b border-dashed border-[#2D2D2D] text-center">
                      <span className="text-xs text-[#C5A059] font-serif font-bold tracking-widest block uppercase">NotarEez Signing Services</span>
                      <span className="text-[9px] text-gray-500 uppercase">Orlando & Central Florida Mobile</span>
                    </div>

                    <div className="p-5 space-y-3 text-xs text-gray-300 flex-grow">
                      <div className="flex justify-between">
                        <span className="text-gray-500">CLIENT:</span>
                        <span className="text-white font-bold">{clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">CONTACT:</span>
                        <span className="text-white">{clientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">APPT DATE:</span>
                        <span className="text-white">
                          {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">APPT TIME:</span>
                        <span className={`${isForcedInquiry ? 'text-amber-400' : 'text-[#C5A059]'} font-bold`}>{selectedSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">SERVICE:</span>
                        <span className="text-white text-right max-w-[150px] truncate">{selectedService.name} (x{quantity})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">LOCATION:</span>
                        <span className="text-white text-right max-w-[150px] truncate">{streetAddress}, {city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">TYPE:</span>
                        <span className="text-white font-bold">{isForcedInquiry ? 'OFFSITE INQUIRY' : 'ONLINE BOOKING'}</span>
                      </div>
                    </div>
                    
                    <div className="p-5 border-t border-[#2D2D2D] bg-[#0A0A0A] rounded-b-2xl">
                      <div className="flex justify-between font-bold text-[#C5A059] text-sm">
                        <span>EST. VALUE:</span>
                        <span>${total}.00</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <ContactQRCode />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setSelectedDate('');
                      setSelectedSlot('');
                      setStreetAddress('');
                      setCity('');
                      setZipCode('');
                      setClientName('');
                      setClientEmail('');
                      setClientPhone('');
                      setAdditionalNotes('');
                      setCreatedBooking(null);
                    }}
                    className="px-6 py-2 bg-[#C5A059] text-black font-serif font-semibold rounded-lg hover:bg-[#E5C079] transition mx-auto cursor-pointer"
                  >
                    Schedule Another
                  </button>
                </div>
              </div>
            )}

            {/* Back & Next controls */}
            {step < 5 && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#2D2D2D]">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    step === 1 
                      ? 'text-gray-600 border-transparent cursor-not-allowed opacity-20' 
                      : 'bg-transparent text-gray-300 border-[#2D2D2D] hover:border-[#C5A059]/40 hover:text-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                {step === 4 ? (
                  <button
                    type="submit"
                    disabled={!isStepValid()}
                    className={`flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-serif font-semibold tracking-wide transition-all cursor-pointer ${
                      isStepValid()
                        ? isForcedInquiry 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black shadow-lg shadow-amber-500/10'
                          : 'bg-gradient-to-r from-[#E5C079] via-[#C5A059] to-[#9E7D3B] hover:from-[#C5A059] hover:to-[#7E612B] text-black shadow-lg shadow-[#C5A059]/10' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isForcedInquiry ? 'Confirm Inquiry Request' : 'Confirm Booking'} <Sparkles className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-serif font-semibold tracking-wide transition-all cursor-pointer ${
                      isStepValid()
                        ? 'bg-gradient-to-r from-[#E5C079] via-[#C5A059] to-[#9E7D3B] hover:from-[#C5A059] hover:to-[#7E612B] text-black shadow-lg shadow-[#C5A059]/10' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

          </form>

        </div>

      </div>
    </section>
  );
}
