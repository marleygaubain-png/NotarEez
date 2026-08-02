import React, { useState, useEffect } from 'react';
import { Booking, ContactInquiry, WeeklySchedule, DEFAULT_WEEKLY_SCHEDULE } from './types';
import HeroSection from './components/HeroSection';
import ServiceFees from './components/ServiceFees';
import BookingWizard from './components/BookingWizard';
import ContactSection from './components/ContactSection';
import EmployeePortal from './components/EmployeePortal';
import PinLockScreen from './components/PinLockScreen';
import { ShieldAlert, BookOpen, Calendar, HelpCircle, Shield, Phone, Sparkles, Scale, CheckSquare, Lock } from 'lucide-react';
import notaryLogo from './assets/images/notary_logo_1785623795805.jpg';

// Import Firestore instance and methods
import { db } from './lib/firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function App() {
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('notareez_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const stored = localStorage.getItem('notareez_inquiries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [schedule, setSchedule] = useState<WeeklySchedule>(() => {
    try {
      const stored = localStorage.getItem('notareez_schedule');
      return stored ? JSON.parse(stored) : DEFAULT_WEEKLY_SCHEDULE;
    } catch {
      return DEFAULT_WEEKLY_SCHEDULE;
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'rates' | 'book' | 'contact' | 'owner'>('home');
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => {
    return localStorage.getItem('notareez_is_owner') === 'true';
  });
  const [ownerPin, setOwnerPin] = useState<string>('4219');

  // Push local-only bookings and inquiries to Firestore once on mount (so that any bookings made on client browsers before Firebase are automatically synced to the cloud!)
  useEffect(() => {
    const syncLocalToCloud = async () => {
      try {
        const storedBookings = localStorage.getItem('notareez_bookings');
        if (storedBookings) {
          const list: Booking[] = JSON.parse(storedBookings);
          for (const b of list) {
            await setDoc(doc(db, 'bookings', b.id), b);
          }
        }
        const storedInquiries = localStorage.getItem('notareez_inquiries');
        if (storedInquiries) {
          const list: ContactInquiry[] = JSON.parse(storedInquiries);
          for (const inq of list) {
            await setDoc(doc(db, 'inquiries', inq.id), inq);
          }
        }
      } catch (err) {
        console.warn("Could not sync older offline bookings to cloud on mount:", err);
      }
    };
    syncLocalToCloud();
  }, []);

  // 1. Subscribe to Bookings real-time
  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Booking[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Booking);
      });
      setBookings(list);
      localStorage.setItem('notareez_bookings', JSON.stringify(list));
      setIsSynced(true);
      setSyncError(null);
    }, (error) => {
      console.error("Error syncing bookings from Firestore:", error);
      setSyncError(`Live database sync warning: ${error.message}. Offline backup is active.`);
      setIsSynced(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Inquiries real-time
  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ContactInquiry[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ContactInquiry);
      });
      setInquiries(list);
      localStorage.setItem('notareez_inquiries', JSON.stringify(list));
    }, (error) => {
      console.error("Error syncing inquiries from Firestore:", error);
    });
    return () => unsubscribe();
  }, []);

  // 3. Subscribe to Work Schedule real-time
  useEffect(() => {
    const docRef = doc(db, 'settings', 'schedule');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as WeeklySchedule;
        setSchedule(data);
        localStorage.setItem('notareez_schedule', JSON.stringify(data));
      } else {
        // Initialize with default schedule if missing
        setDoc(docRef, DEFAULT_WEEKLY_SCHEDULE)
          .catch(err => console.error("Error setting default schedule:", err));
        setSchedule(DEFAULT_WEEKLY_SCHEDULE);
      }
    }, (error) => {
      console.error("Error syncing schedule from Firestore:", error);
    });
    return () => unsubscribe();
  }, []);

  // 4. Subscribe to Owner PIN real-time
  useEffect(() => {
    const docRef = doc(db, 'settings', 'owner_pin');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setOwnerPin(docSnap.data().pin);
      } else {
        // Initialize with default PIN if missing
        setDoc(docRef, { pin: '4219' })
          .catch(err => console.error("Error setting default PIN:", err));
        setOwnerPin('4219');
      }
    }, (error) => {
      console.error("Error syncing owner pin from Firestore:", error);
    });
    return () => unsubscribe();
  }, []);

  // Check URL query parameters or hash to trigger automatic owner log in
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasOwnerKey = params.has('owner') || params.get('portal') === 'georgina' || window.location.hash.includes('owner');
    if (hasOwnerKey) {
      setIsOwnerMode(true);
      localStorage.setItem('notareez_is_owner', 'true');
      setActiveTab('owner');
    }
  }, []);

  const handleOwnerLoginSuccess = () => {
    setIsOwnerMode(true);
    localStorage.setItem('notareez_is_owner', 'true');
  };

  const handleOwnerSignOut = () => {
    setIsOwnerMode(false);
    localStorage.setItem('notareez_is_owner', 'false');
    setActiveTab('home');
  };

  const handlePinChange = async (newPin: string) => {
    setOwnerPin(newPin);
    try {
      await setDoc(doc(db, 'settings', 'owner_pin'), { pin: newPin });
    } catch (error) {
      console.error("Error changing owner PIN in Firestore:", error);
    }
  };

  const handleScheduleChange = async (updated: WeeklySchedule) => {
    setSchedule(updated);
    localStorage.setItem('notareez_schedule', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'settings', 'schedule'), updated);
    } catch (error) {
      console.error("Error updating schedule in Firestore:", error);
    }
  };

  // State modification triggers saving to Firestore
  const handleBookingCreated = async (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('notareez_bookings', JSON.stringify(updated));
    try {
      // Use client-generated ID as document ID for easy identification and overwrite avoidance
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
    } catch (error) {
      console.error("Error creating booking in Firestore:", error);
    }
  };

  const handleInquiryCreated = async (newInquiry: ContactInquiry) => {
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('notareez_inquiries', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'inquiries', newInquiry.id), newInquiry);
    } catch (error) {
      console.error("Error creating inquiry in Firestore:", error);
    }
  };

  const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem('notareez_bookings', JSON.stringify(updated));
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status });
    } catch (error) {
      console.error("Error updating booking status in Firestore:", error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const updated = bookings.filter(b => b.id !== bookingId);
    setBookings(updated);
    localStorage.setItem('notareez_bookings', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (error) {
      console.error("Error deleting booking from Firestore:", error);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    const updated = inquiries.filter(i => i.id !== inquiryId);
    setInquiries(updated);
    localStorage.setItem('notareez_inquiries', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'inquiries', inquiryId));
    } catch (error) {
      console.error("Error deleting inquiry from Firestore:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-[#C5A059] selection:text-black scroll-smooth">
      
      {/* Dynamic Header Toolbar */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2D2D2D]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Logo brand label */}
          <button 
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <img 
              src={notaryLogo} 
              alt="NotarEez Logo" 
              className="w-9 h-9 rounded-full border border-[#C5A059]/40 object-cover shadow-sm shadow-[#C5A059]/10" 
              referrerPolicy="no-referrer"
            />
            <div className="leading-none">
              <span className="font-serif font-black text-sm tracking-widest text-white uppercase group-hover:text-[#C5A059] transition">
                Notar<span className="text-[#C5A059]">Eez</span>
              </span>
              <span className="block text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">Signing Services</span>
            </div>
          </button>

          {/* Desktop Nav options */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold">
            {[
              { id: 'home', label: 'Home' },
              { id: 'rates', label: 'Rates' },
              { id: 'book', label: 'Book Online' },
              { id: 'contact', label: 'Contact' },
              { id: 'owner', label: 'Owner Portal' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`transition uppercase tracking-wider text-xs font-semibold pb-1 border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#C5A059] border-[#C5A059]'
                    : 'text-gray-400 hover:text-white border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Action triggers */}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setActiveTab('book')}
              className="hidden sm:inline-block px-4 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059] hover:text-black text-[#C5A059] border border-[#C5A059]/20 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
            >
              Book Georgina
            </button>

            {/* Backoffice Dashboard Toggle */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'owner' ? 'home' : 'owner')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'owner' 
                  ? 'bg-[#C5A059] text-black shadow-md shadow-[#C5A059]/10' 
                  : 'bg-[#0D0D0D] text-[#C5A059] border border-[#2D2D2D] hover:border-[#C5A059]/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {activeTab === 'owner' ? 'Close Portal' : 'Owner Portal'}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden sticky top-16 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#2D2D2D] py-2.5 px-4 flex justify-around items-center">
        {[
          { id: 'home', label: 'Home' },
          { id: 'rates', label: 'Rates' },
          { id: 'book', label: 'Book' },
          { id: 'contact', label: 'Contact' },
          { id: 'owner', label: 'Owner' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-[11px] uppercase tracking-widest font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'text-[#C5A059] bg-[#C5A059]/10'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Admin Notice Bar */}
      {activeTab === 'owner' && (
        <div className="bg-gradient-to-r from-[#C5A059]/20 via-[#E5C079]/10 to-transparent border-b border-[#2D2D2D] py-2.5 px-4 text-center text-xs text-[#C5A059] flex flex-col md:flex-row items-center justify-center gap-2 animate-fadeIn">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Logged in as <strong>Georgina Aubain</strong>. Direct link to your secure portal (bookmark this!):</span>
          </div>
          <span className="bg-black/80 px-2.5 py-1 rounded text-[10px] font-mono border border-[#C5A059]/30 text-[#E5C079] select-all">
            {window.location.origin}/?owner=true
          </span>
        </div>
      )}

      {/* Main Container Views */}
      <main className="flex-grow">
        
        <div className="animate-fadeIn">
          {activeTab === 'home' && (
            <HeroSection onTabChange={setActiveTab} />
          )}
          {activeTab === 'rates' && (
            <ServiceFees onBookClick={() => setActiveTab('book')} />
          )}
          {activeTab === 'book' && (
            <BookingWizard 
              onBookingCreated={handleBookingCreated} 
              onInquiryCreated={handleInquiryCreated}
              schedule={schedule}
            />
          )}
          {activeTab === 'contact' && (
            <ContactSection onInquiryCreated={handleInquiryCreated} />
          )}
          {activeTab === 'owner' && (
            isOwnerMode ? (
              <OwnerPortal 
                bookings={bookings}
                inquiries={inquiries}
                onStatusChange={handleStatusChange}
                onDeleteBooking={handleDeleteBooking}
                onDeleteInquiry={handleDeleteInquiry}
                schedule={schedule}
                onScheduleChange={handleScheduleChange}
                onSignOut={handleOwnerSignOut}
                currentPin={ownerPin}
                onPinChange={handlePinChange}
                isSynced={isSynced}
                syncError={syncError}
              />
            ) : (
              <PinLockScreen 
                correctPin={ownerPin}
                onSuccess={handleOwnerLoginSuccess}
                onBackToSite={() => setActiveTab('home')}
              />
            )
          )}
        </div>

      </main>

      {/* Page Footer */}
      <footer className="bg-[#0D0D0D] py-12 px-4 border-t border-[#2D2D2D]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-1">
            <h4 className="font-serif font-black text-white text-base tracking-widest uppercase">
              Notar<span className="text-[#C5A059]">Eez</span>
            </h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Professional • Reliable • Convenient Mobile Notary Services
            </p>
          </div>

          <div className="text-[11px] text-gray-400 max-w-sm space-y-1.5">
            <p>
              © {new Date().getFullYear()} NotarEez Signing Services. All Rights Reserved.
            </p>
            <p className="text-[10px] text-gray-500">
              Notary public services are performed in accordance with Chapter 117 of the Florida Statutes. Travel fees are negotiated and agreed upon in advance.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('owner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[10px] text-gray-500 hover:text-[#C5A059] uppercase tracking-widest transition-colors font-bold cursor-pointer flex items-center gap-1"
            >
              🔒 Administrative Owner Portal
            </button>
            <div className="flex items-center gap-1.5 justify-center md:justify-end text-xs text-[#C5A059] font-serif italic">
              <span>Notarizing Made Eez.</span>
              <span>❤️</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
