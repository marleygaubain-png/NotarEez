import React, { useState } from 'react';
import { Booking, ContactInquiry, NOTARY_SERVICES, WeeklySchedule, ScheduleStatus, ALL_TIME_SLOTS, DAYS_OF_WEEK, DEFAULT_WEEKLY_SCHEDULE, isTypicalWorkingHour } from '../types';
import { 
  Calendar, CheckCircle, Clock, XCircle, Search, Mail, Phone, 
  MapPin, Shield, DollarSign, Award, ArrowUpRight, MessageSquare, 
  Filter, Sparkles, UserCheck, Home, Briefcase, Sliders, RefreshCw, Check, LogOut, Key, Lock, Trash2
} from 'lucide-react';

interface OwnerPortalProps {
  bookings: Booking[];
  inquiries: ContactInquiry[];
  onStatusChange: (bookingId: string, status: Booking['status']) => void;
  onDeleteBooking: (bookingId: string) => void;
  onDeleteInquiry: (inquiryId: string) => void;
  onUpdateBookingFee?: (bookingId: string, travelFee: number, notaryFee: number, totalFee: number) => void;
  onConvertInquiryToBooking?: (booking: Booking, inquiryId: string) => void;
  schedule: WeeklySchedule;
  onScheduleChange: (updated: WeeklySchedule) => void;
  onSignOut: () => void;
  currentUsername?: string;
  currentPassword?: string;
  onCredentialsChange?: (username: string, password: string) => void;
  isSynced?: boolean;
  syncError?: string | null;
}

export default function OwnerPortal({ 
  bookings, 
  inquiries, 
  onStatusChange, 
  onDeleteBooking, 
  onDeleteInquiry,
  onUpdateBookingFee,
  onConvertInquiryToBooking,
  schedule, 
  onScheduleChange,
  onSignOut,
  currentUsername = 'GMarieA',
  currentPassword = '2406Talon',
  onCredentialsChange,
  isSynced = true,
  syncError = null
}: OwnerPortalProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'inquiries' | 'schedule' | 'insights' | 'settings'>('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all');
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<string>('Monday');

  // Credentials settings state
  const [usernameInput, setUsernameInput] = useState(currentUsername);
  const [passwordInput, setPasswordInput] = useState(currentPassword);
  const [settingsMsg, setSettingsMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Edit Fee Modal State
  const [editingFeeBooking, setEditingFeeBooking] = useState<Booking | null>(null);
  const [editTravelFee, setEditTravelFee] = useState<number>(0);
  const [editNotaryFee, setEditNotaryFee] = useState<number>(0);

  // Convert Inquiry to Booking Modal State
  const [convertingInquiry, setConvertingInquiry] = useState<ContactInquiry | null>(null);
  const [convName, setConvName] = useState('');
  const [convEmail, setConvEmail] = useState('');
  const [convPhone, setConvPhone] = useState('');
  const [convServiceId, setConvServiceId] = useState('acknowledgment');
  const [convQuantity, setConvQuantity] = useState(1);
  const [convLocationType, setConvLocationType] = useState('home');
  const [convAddress, setConvAddress] = useState('');
  const [convDate, setConvDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [convTimeSlot, setConvTimeSlot] = useState('10:00 AM');
  const [convNotaryFee, setConvNotaryFee] = useState(10);
  const [convTravelFee, setConvTravelFee] = useState(25);
  const [convNotes, setConvNotes] = useState('');

  const handleSaveCredentials = () => {
    if (!usernameInput.trim()) {
      setSettingsMsg({ text: 'Username cannot be blank.', type: 'error' });
      return;
    }
    if (passwordInput.length < 4) {
      setSettingsMsg({ text: 'Password must be at least 4 characters long.', type: 'error' });
      return;
    }
    if (onCredentialsChange) {
      onCredentialsChange(usernameInput.trim(), passwordInput);
    }
    setSettingsMsg({ text: 'Owner credentials updated successfully!', type: 'success' });
    setTimeout(() => {
      setSettingsMsg(null);
    }, 4000);
  };

  const openFeeEditModal = (b: Booking) => {
    setEditingFeeBooking(b);
    setEditTravelFee(b.estimatedTravelFee || 25);
    setEditNotaryFee(b.estimatedNotaryFee || 10);
  };

  const handleSaveFeeEdit = () => {
    if (!editingFeeBooking) return;
    const total = editNotaryFee + editTravelFee;
    if (onUpdateBookingFee) {
      onUpdateBookingFee(editingFeeBooking.id, editTravelFee, editNotaryFee, total);
    }
    setEditingFeeBooking(null);
  };

  const openConvertModal = (inq: ContactInquiry) => {
    setConvertingInquiry(inq);
    setConvName(inq.name);
    setConvEmail(inq.email);
    setConvPhone(inq.phone);
    setConvServiceId('acknowledgment');
    setConvQuantity(1);
    setConvLocationType('home');
    setConvAddress('Client Specified Address (To Be Confirmed)');
    setConvDate(new Date().toISOString().split('T')[0]);
    setConvTimeSlot('10:00 AM');
    setConvNotaryFee(10);
    setConvTravelFee(25);
    setConvNotes(inq.message || '');
  };

  const handleConfirmConvertInquiry = () => {
    if (!convertingInquiry) return;
    const newBooking: Booking = {
      id: `NEZ-${Math.floor(100000 + Math.random() * 900000)}`,
      clientName: convName,
      clientEmail: convEmail,
      clientPhone: convPhone,
      serviceId: convServiceId,
      quantity: convQuantity,
      locationType: convLocationType,
      customAddress: convAddress,
      distanceBracketId: 'under_10',
      date: convDate,
      timeSlot: convTimeSlot,
      additionalNotes: convNotes,
      estimatedNotaryFee: convNotaryFee,
      estimatedTravelFee: convTravelFee,
      estimatedTotal: convNotaryFee + convTravelFee,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    if (onConvertInquiryToBooking) {
      onConvertInquiryToBooking(newBooking, convertingInquiry.id);
    }
    setConvertingInquiry(null);
    setActiveTab('bookings');
  };


  // Stats Calculations
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.estimatedTotal, 0);

  const notaryFeesTotal = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.estimatedNotaryFee, 0);

  const travelFeesTotal = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.estimatedTravelFee, 0);

  // Filters bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customAddress.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Count services
  const getServiceCount = (serviceId: string) => {
    return bookings.filter(b => b.serviceId === serviceId).length;
  };

  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-gray-200 border-t border-[#2D2D2D]">
      <div className="max-w-6xl mx-auto">
        
        {/* Sync Status Banner */}
        {syncError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <strong>Database Status Warning:</strong> {syncError}
          </div>
        )}

        {/* Title & Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[#2D2D2D]">
          <div>
            <div className="flex items-center gap-2 text-[#C5A059] text-xs font-mono uppercase tracking-widest mb-1">
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              Secure Administrative Area
              {isSynced && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 ml-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  LIVE SYNC CONNECTED
                </span>
              )}
            </div>
            <h2 className="text-3xl font-serif text-white">
              Georgina's <span className="text-[#C5A059] italic font-normal">Business Portal</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage schedule, client receipts, and inquiries in real-time.</p>
          </div>

          {/* Quick Access Tabs & Sign Out */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <div className="flex bg-[#0D0D0D] p-1.5 rounded-xl border border-[#2D2D2D] overflow-x-auto max-w-full">
              {[
                { id: 'bookings', label: 'Appointments', count: bookings.length },
                { id: 'schedule', label: 'Work Schedule', count: null },
                { id: 'inquiries', label: 'Inquiries', count: inquiries.length },
                { id: 'insights', label: 'Insights & Stats', count: null },
                { id: 'settings', label: 'PIN Settings', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all relative shrink-0 ${
                    activeTab === tab.id 
                      ? 'bg-[#C5A059] text-black shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === tab.id ? 'bg-black text-[#C5A059]' : 'bg-[#C5A059]/10 text-[#C5A059]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="px-3.5 py-2 rounded-xl bg-red-950/10 border border-red-500/20 hover:bg-red-950/30 hover:border-red-500 text-red-400 text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Analytical Scoreboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-4 right-4 text-[#C5A059]/10">
              <DollarSign className="w-10 h-10" />
            </div>
            <span className="text-gray-400 text-[11px] uppercase tracking-wider block">Estimated Booked Revenue</span>
            <span className="text-2xl md:text-3xl font-mono font-bold text-[#C5A059] mt-1 block">${totalRevenue}.00</span>
            <span className="text-[10px] text-gray-500 mt-1 block">Active slots: {confirmedBookings.length + completedBookings.length}</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-4 right-4 text-[#C5A059]/10">
              <Award className="w-10 h-10" />
            </div>
            <span className="text-gray-400 text-[11px] uppercase tracking-wider block">Statutory Notary Fees</span>
            <span className="text-2xl md:text-3xl font-mono font-bold text-white mt-1 block">${notaryFeesTotal}.00</span>
            <span className="text-[10px] text-[#C5A059]/60 mt-1 block">Maximum permissible by law</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-4 right-4 text-[#C5A059]/10">
              <MapPin className="w-10 h-10" />
            </div>
            <span className="text-gray-400 text-[11px] uppercase tracking-wider block">Est. Mobile Travel Fees</span>
            <span className="text-2xl md:text-3xl font-mono font-bold text-white mt-1 block">${travelFeesTotal}.00</span>
            <span className="text-[10px] text-gray-500 mt-1 block">Based on mileage travel brackets</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-4 right-4 text-[#C5A059]/10">
              <UserCheck className="w-10 h-10" />
            </div>
            <span className="text-gray-400 text-[11px] uppercase tracking-wider block">Completion Rate</span>
            <span className="text-2xl md:text-3xl font-mono font-bold text-[#E5C079] mt-1 block">
              {bookings.length > 0 
                ? `${Math.round((completedBookings.length / bookings.length) * 100)}%`
                : '100%'}
            </span>
            <span className="text-[10px] text-gray-500 mt-1 block">Total bookings registered: {bookings.length}</span>
          </div>

        </div>

        {/* Tab 1: APPOINTMENTS LIST */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Search and Filters toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#0D0D0D] p-4 rounded-xl border border-[#2D2D2D] justify-between">
              
              {/* Search input */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  placeholder="Search bookings by name, email, street, receipt ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2D2D2D] rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="text-[11px] text-gray-400 mr-1 uppercase">Filter:</span>
                <div className="flex bg-[#121212] p-1 rounded-lg border border-[#2D2D2D] gap-1">
                  {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide transition-all ${
                        statusFilter === filter
                          ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20'
                          : 'text-gray-500 hover:text-gray-300 border border-transparent'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bookings items list */}
            {filteredBookings.length === 0 ? (
              <div className="p-16 rounded-2xl bg-[#121212] border border-[#2D2D2D] text-center space-y-3">
                <p className="text-sm text-gray-500 italic">No bookings found matching your active criteria.</p>
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                  className="px-4 py-1.5 bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] rounded-lg text-xs"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookings.map((b) => {
                  const srv = NOTARY_SERVICES.find(s => s.id === b.serviceId) || NOTARY_SERVICES[0];
                  
                  return (
                    <div 
                      key={b.id} 
                      className={`p-5 rounded-2xl bg-[#121212] border transition-all relative ${
                        b.status === 'completed'
                          ? 'border-emerald-500/20 bg-emerald-950/5'
                          : b.status === 'cancelled'
                            ? 'border-rose-500/20 opacity-60'
                            : 'border-[#2D2D2D] hover:border-[#C5A059]/40'
                      }`}
                    >
                      {/* Ticket header info */}
                      <div className="flex justify-between items-start border-b border-[#2D2D2D] pb-3 mb-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#C5A059] block">{b.id}</span>
                          <h4 className="font-serif font-bold text-white text-base mt-0.5">{b.clientName}</h4>
                        </div>
                        
                        {/* Status Badge and Delete Action */}
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            b.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : b.status === 'cancelled'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30'
                          }`}>
                            {b.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete appointment ${b.id} for ${b.clientName}?`)) {
                                onDeleteBooking(b.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-400 hover:bg-rose-900/40 hover:text-rose-300 transition-colors"
                            title="Delete appointment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="space-y-2 text-xs text-gray-300 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>
                            {new Date(b.date + 'T00:00:00').toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at <span className="text-[#C5A059] font-mono font-semibold">{b.timeSlot}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span className="truncate" title={b.customAddress}>{b.customAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span className="font-mono">{b.clientPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span className="truncate">{b.clientEmail}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white">{srv.name} (x{b.quantity})</span>
                            <p className="text-[10px] text-gray-500 mt-0.5">Notary: ${b.estimatedNotaryFee} | Travel: ${b.estimatedTravelFee}</p>
                          </div>
                        </div>

                        {b.additionalNotes && (
                          <div className="p-2 bg-[#0D0D0D] rounded-lg text-[10px] text-gray-400 border border-[#2D2D2D] mt-2">
                            <span className="text-gray-500 font-bold">CLIENT NOTE:</span> "{b.additionalNotes}"
                          </div>
                        )}
                      </div>

                      {/* Footer Cost and Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-[#2D2D2D]">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-[10px] text-gray-500 block uppercase">Estimated Revenue</span>
                            <span className="font-mono font-bold text-base text-[#C5A059]">${b.estimatedTotal}.00</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openFeeEditModal(b)}
                            className="px-2 py-1 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 rounded-lg text-[10px] text-[#C5A059] font-semibold transition flex items-center gap-1 cursor-pointer"
                            title="Edit / Negotiate Travel Fee"
                          >
                            <DollarSign className="w-3 h-3" /> Edit Fee
                          </button>
                        </div>

                        {/* Quick action triggers */}
                        <div className="flex gap-1.5 self-end sm:self-auto">
                          {b.status === 'confirmed' && (
                            <>
                              <button
                                type="button"
                                onClick={() => onStatusChange(b.id, 'completed')}
                                className="p-1 px-2 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold transition flex items-center gap-0.5 border border-emerald-500/20"
                                title="Mark notarization completed"
                              >
                                <CheckCircle className="w-3 h-3" /> Done
                              </button>
                              <button
                                type="button"
                                onClick={() => onStatusChange(b.id, 'cancelled')}
                                className="p-1 px-2 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-bold transition flex items-center gap-0.5 border border-rose-500/20"
                                title="Cancel appointment"
                              >
                                <XCircle className="w-3 h-3" /> Cancel
                              </button>
                            </>
                          )}
                          {b.status === 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => onDeleteBooking(b.id)}
                              className="p-1 px-2 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 text-[10px] transition"
                            >
                              Archive
                            </button>
                          )}
                          {b.status === 'completed' && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold font-serif italic">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: WORK SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#2D2D2D]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2D2D2D] mb-6">
                <div>
                  <h3 className="text-lg font-serif text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#C5A059]" />
                    Online Booking vs. Mobile Inquiry Router
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Toggle whether you are <span className="text-[#C5A059] font-bold">At Home 🏡</span> (allowing online booking) or <span className="text-[#E5C079] font-bold">Away / Mobile 🚗</span> (forcing inquiries) for each slot.
                  </p>
                </div>
                
                {/* Bulk Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...schedule };
                      ALL_TIME_SLOTS.forEach(slot => {
                        updated[selectedScheduleDay][slot] = 'home';
                      });
                      onScheduleChange(updated);
                    }}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    🏡 All At Home
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...schedule };
                      ALL_TIME_SLOTS.forEach(slot => {
                        updated[selectedScheduleDay][slot] = 'away';
                      });
                      onScheduleChange(updated);
                    }}
                    className="px-3 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/20 text-[#C5A059] text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    🚗 All Away
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...schedule };
                      DAYS_OF_WEEK.forEach(day => {
                        updated[day] = {};
                        ALL_TIME_SLOTS.forEach(slot => {
                          updated[day][slot] = isTypicalWorkingHour(day, slot) ? 'home' : 'away';
                        });
                      });
                      onScheduleChange(updated);
                    }}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5 shrink-0" /> Reset Week
                  </button>
                </div>
              </div>

              {/* Day of Week Selector Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 mb-6">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedScheduleDay === day;
                  const homeSlotsCount = Object.values(schedule[day] || {}).filter(status => status === 'home').length;
                  const blockedSlotsCount = Object.values(schedule[day] || {}).filter(status => status === 'unavailable').length;
                  const awaySlotsCount = ALL_TIME_SLOTS.length - homeSlotsCount - blockedSlotsCount;
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedScheduleDay(day)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected 
                          ? 'bg-[#C5A059] border-[#C5A059] text-black shadow-md shadow-[#C5A059]/10' 
                          : 'bg-[#0D0D0D] border-[#2D2D2D] text-gray-400 hover:text-white hover:border-[#C5A059]/30'
                      }`}
                    >
                      <span className="text-xs font-serif font-bold">{day}</span>
                      <span className="text-[9px] mt-1 font-mono font-medium opacity-80">
                        🏡{homeSlotsCount} 🚗{awaySlotsCount} 🚫{blockedSlotsCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Slot Grid for selected Day */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#2D2D2D]">
                  <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                    <span>Manage slots for {selectedScheduleDay}</span>
                    <span className="text-xs text-gray-500 italic">({selectedScheduleDay === 'Saturday' || selectedScheduleDay === 'Sunday' ? 'Weekend' : 'Weekday'})</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ALL_TIME_SLOTS.map((slot) => {
                    const currentStatus = (schedule[selectedScheduleDay] && schedule[selectedScheduleDay][slot]) || 'home';
                    const isTypical = isTypicalWorkingHour(selectedScheduleDay, slot);
                    
                    return (
                      <div 
                        key={slot}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                          currentStatus === 'home'
                            ? 'bg-emerald-950/10 border-emerald-500/20'
                            : currentStatus === 'away'
                              ? 'bg-amber-950/10 border-amber-500/20'
                              : 'bg-red-950/10 border-red-500/20'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${
                              currentStatus === 'home' ? 'text-emerald-400' :
                              currentStatus === 'away' ? 'text-amber-400' : 'text-red-400'
                            }`} />
                            <span className="font-mono font-bold text-xs text-white">{slot}</span>
                          </div>
                          <span className="text-[9px] text-gray-500 uppercase font-semibold block">
                            {isTypical ? 'Typical Working Hours' : 'Outside Typical Hours'}
                          </span>
                        </div>

                        {/* Interactive Status Segmented Button Group */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex bg-black/60 p-0.5 rounded-lg border border-[#2D2D2D] text-[9px] font-semibold">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...schedule };
                                if (!updated[selectedScheduleDay]) updated[selectedScheduleDay] = {};
                                updated[selectedScheduleDay][slot] = 'home';
                                onScheduleChange(updated);
                              }}
                              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                currentStatus === 'home'
                                  ? 'bg-emerald-500 text-black font-bold shadow'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              Home
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...schedule };
                                if (!updated[selectedScheduleDay]) updated[selectedScheduleDay] = {};
                                updated[selectedScheduleDay][slot] = 'away';
                                onScheduleChange(updated);
                              }}
                              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                currentStatus === 'away'
                                  ? 'bg-amber-500 text-black font-bold shadow'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              Away
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...schedule };
                                if (!updated[selectedScheduleDay]) updated[selectedScheduleDay] = {};
                                updated[selectedScheduleDay][slot] = 'unavailable';
                                onScheduleChange(updated);
                              }}
                              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                currentStatus === 'unavailable'
                                  ? 'bg-red-500 text-black font-bold shadow'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              Block
                            </button>
                          </div>
                          
                          <span className="text-[9px] font-mono text-gray-400">
                            {currentStatus === 'home' ? '🏡 Instant Book' :
                             currentStatus === 'away' ? '🚗 Inquiry only' : '🚫 Blocked'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: CONTACT INQUIRIES LOG */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4 animate-fadeIn">
            {inquiries.length === 0 ? (
              <div className="p-16 rounded-2xl bg-[#121212] border border-[#2D2D2D] text-center text-sm text-gray-500 italic">
                No direct contact inquiries have been received yet.
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 rounded-xl bg-[#121212] border border-[#2D2D2D] hover:border-[#C5A059]/20 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 border-b border-[#2D2D2D] pb-3 mb-3">
                      <div>
                        <h4 className="font-serif font-bold text-white text-base">{inq.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                          <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-[#C5A059] transition">
                            <Mail className="w-3 h-3 text-[#C5A059]" /> {inq.email}
                          </a>
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-[#C5A059] transition">
                            <Phone className="w-3 h-3 text-[#C5A059]" /> {inq.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className="text-[10px] font-mono text-gray-500">
                          {new Date(inq.createdAt).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete this inquiry from ${inq.name}?`)) {
                              onDeleteInquiry(inq.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-400 hover:bg-rose-900/40 hover:text-rose-300 transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-[#0D0D0D] rounded-lg border border-[#2D2D2D] text-xs text-gray-300 italic mb-3">
                      "{inq.message}"
                    </div>

                    <div className="flex justify-end border-t border-[#2D2D2D] pt-2.5">
                      <button
                        type="button"
                        onClick={() => openConvertModal(inq)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#d1ab63] hover:to-[#ebd08f] text-black rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#C5A059]/10 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Convert to Booking (Owner Override)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: INSIGHTS & STATS */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            
            {/* Service Popularity breakdown */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#2D2D2D]">
              <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
                Popular Notary Acts
              </h3>
              
              <div className="space-y-4 text-xs">
                {NOTARY_SERVICES.map((srv) => {
                  const count = getServiceCount(srv.id);
                  const totalCount = bookings.length;
                  const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                  
                  return (
                    <div key={srv.id} className="space-y-1.5">
                       <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-300">{srv.name}</span>
                        <span className="font-mono text-[#C5A059] font-bold">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-[#0D0D0D] rounded-full overflow-hidden border border-[#2D2D2D]">
                        <div 
                          className="h-full bg-gradient-to-r from-[#E5C079] to-[#C5A059] rounded-full transition-all duration-1000" 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General tips for Georgina */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#2D2D2D] space-y-4">
              <h3 className="text-lg font-serif text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                Georgina's Business Intelligence
              </h3>
              
              <div className="space-y-3.5 text-xs text-gray-300 leading-relaxed">
                <div className="p-3 bg-[#C5A059]/5 rounded-xl border border-[#2D2D2D]">
                  <span className="font-serif font-bold text-[#C5A059] block mb-0.5">🌟 Travel Bracket Optimization</span>
                  <p className="text-[11px] text-gray-400">
                    Your 11-20 miles and 21-30 miles slots are the most requested. Keep travel bags organized with seals, blank Florida acknowledgment certificates, and jurat sheets.
                  </p>
                </div>
                
                <div className="p-3 bg-[#C5A059]/5 rounded-xl border border-[#2D2D2D]">
                  <span className="font-serif font-bold text-[#C5A059] block mb-0.5">💻 Remote Online Notarization (RON) Advantage</span>
                  <p className="text-[11px] text-gray-400">
                    With RON acts billing at $25 per seal under Florida statute, consider promoting your RON link via email follow-ups to save travel time.
                  </p>
                </div>

                <div className="p-3 bg-[#C5A059]/5 rounded-xl border border-[#2D2D2D]">
                  <span className="font-serif font-bold text-[#C5A059] block mb-0.5">🔒 Statute Compliance Reminder</span>
                  <p className="text-[11px] text-gray-400">
                    Ensure the notary journal remains up to date. This administrative applet saves your data locally in your browser cache.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 5: OWNER SECURITY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto bg-[#121212] p-6 rounded-2xl border border-[#2D2D2D] space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-serif text-white mb-1 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#C5A059]" />
                Owner Account Security Settings
              </h3>
              <p className="text-xs text-gray-400">Update the login username and password required to access your administrative portal.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold block">Portal Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] rounded-xl text-sm font-mono text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold block">Portal Password</label>
                <input
                  type="text"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] rounded-xl text-sm font-mono text-white outline-none"
                />
              </div>

              {settingsMsg && (
                <div className={`p-3 rounded-xl text-xs border ${
                  settingsMsg.type === 'success' 
                    ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-400' 
                    : 'bg-red-950/20 border-red-500/25 text-red-400'
                }`}>
                  {settingsMsg.text}
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveCredentials}
                className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#d1ab63] hover:to-[#ebd08f] text-black font-serif font-bold rounded-xl text-xs tracking-wider transition-all cursor-pointer active:scale-98"
              >
                Save New Credentials
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: EDIT / NEGOTIATE TRAVEL FEE */}
      {editingFeeBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#121212] border border-[#2D2D2D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#2D2D2D] pb-3">
              <div>
                <h3 className="font-serif font-bold text-white text-lg">Edit / Negotiate Fee</h3>
                <p className="text-xs text-gray-400">Appointment {editingFeeBooking.id} • {editingFeeBooking.clientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingFeeBooking(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">Notary Fee ($)</label>
                <input
                  type="number"
                  min="0"
                  value={editNotaryFee}
                  onChange={(e) => setEditNotaryFee(Number(e.target.value) || 0)}
                  className="w-full py-2.5 px-3.5 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-xl text-sm font-mono text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">Negotiated Travel Fee ($)</label>
                <input
                  type="number"
                  min="0"
                  value={editTravelFee}
                  onChange={(e) => setEditTravelFee(Number(e.target.value) || 0)}
                  className="w-full py-2.5 px-3.5 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-xl text-sm font-mono text-white outline-none"
                />
                <p className="text-[10px] text-gray-500">Travel fees are negotiated and agreed upon in advance with client.</p>
              </div>

              <div className="p-3 bg-[#0D0D0D] rounded-xl border border-[#2D2D2D] flex justify-between items-center">
                <span className="text-gray-400 font-medium">New Total Fee:</span>
                <span className="font-mono font-bold text-lg text-[#C5A059]">${editNotaryFee + editTravelFee}.00</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-[#2D2D2D]">
              <button
                type="button"
                onClick={() => setEditingFeeBooking(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFeeEdit}
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d1ab63] text-black font-bold text-xs transition"
              >
                Save Fee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONVERT INQUIRY TO BOOKING (OWNER OVERRIDE) */}
      {convertingInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#121212] border border-[#2D2D2D] rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 space-y-4">
            <div className="flex justify-between items-center border-b border-[#2D2D2D] pb-3">
              <div>
                <h3 className="font-serif font-bold text-white text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  Convert Inquiry to Booking
                </h3>
                <p className="text-xs text-gray-400">Owner override: approve any time, date, & custom travel fee.</p>
              </div>
              <button
                type="button"
                onClick={() => setConvertingInquiry(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Client Name</label>
                  <input
                    type="text"
                    value={convName}
                    onChange={(e) => setConvName(e.target.value)}
                    className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Client Phone</label>
                  <input
                    type="text"
                    value={convPhone}
                    onChange={(e) => setConvPhone(e.target.value)}
                    className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Client Email</label>
                <input
                  type="email"
                  value={convEmail}
                  onChange={(e) => setConvEmail(e.target.value)}
                  className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Notary Act</label>
                  <select
                    value={convServiceId}
                    onChange={(e) => setConvServiceId(e.target.value)}
                    className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white"
                  >
                    {NOTARY_SERVICES.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (${s.fee})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Quantity / Seals</label>
                  <input
                    type="number"
                    min="1"
                    value={convQuantity}
                    onChange={(e) => setConvQuantity(Number(e.target.value) || 1)}
                    className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Date (Owner Override)</label>
                  <input
                    type="date"
                    value={convDate}
                    onChange={(e) => setConvDate(e.target.value)}
                    className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Time Slot (Owner Override)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2:00 PM"
                    value={convTimeSlot}
                    onChange={(e) => setConvTimeSlot(e.target.value)}
                    className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Signing Location / Address</label>
                <input
                  type="text"
                  placeholder="Full street address"
                  value={convAddress}
                  onChange={(e) => setConvAddress(e.target.value)}
                  className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Notary Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={convNotaryFee}
                    onChange={(e) => setConvNotaryFee(Number(e.target.value) || 0)}
                    className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Agreed Travel Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={convTravelFee}
                    onChange={(e) => setConvTravelFee(Number(e.target.value) || 0)}
                    className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#0D0D0D] rounded-xl border border-[#2D2D2D] flex justify-between items-center">
                <span className="text-gray-400 font-medium">Confirmed Total Revenue:</span>
                <span className="font-mono font-bold text-lg text-[#C5A059]">${convNotaryFee + convTravelFee}.00</span>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Notes / Client Request</label>
                <textarea
                  rows={2}
                  value={convNotes}
                  onChange={(e) => setConvNotes(e.target.value)}
                  className="w-full p-2 bg-[#0D0D0D] border border-[#2D2D2D] focus:border-[#C5A059] rounded-lg text-white text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-[#2D2D2D]">
              <button
                type="button"
                onClick={() => setConvertingInquiry(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConvertInquiry}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C079] text-black font-bold text-xs transition shadow-lg shadow-[#C5A059]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Confirm & Create Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
