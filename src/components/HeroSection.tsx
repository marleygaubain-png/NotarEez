import React from 'react';
import { 
  ShieldCheck, Award, Clock, MapPin, Phone, Mail, 
  Home, Building, Activity, Users, ChevronDown, CheckSquare, Sparkles 
} from 'lucide-react';
import notaryLogo from '../assets/images/notary_logo_1785623795805.jpg';

interface HeroSectionProps {
  onTabChange: (tab: 'home' | 'rates' | 'book' | 'contact') => void;
}

export default function HeroSection({ onTabChange }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-b from-[#0A0A0A] via-[#121212] to-[#0A0A0A] text-gray-200 overflow-hidden">
      
      {/* Sparkle effects overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#C5A059] rounded-full animate-ping"></div>
        <div className="absolute top-1/4 right-20 w-3 h-3 bg-[#E5C079] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-[#C5A059] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-[#E5C079] rounded-full animate-ping"></div>
        {/* Curved golden light line gradient overlay */}
        <div className="absolute -bottom-20 left-0 right-0 h-[300px] bg-gradient-to-t from-[#C5A059]/10 to-transparent blur-3xl rounded-full"></div>
      </div>

      {/* Hero Header Content */}
      <div className="max-w-6xl mx-auto pt-16 pb-20 px-4 md:px-8 relative z-10 text-center">
        
        {/* Luxurious Brand Logo & Monogram */}
        <div className="inline-flex flex-col items-center mb-8 animate-fadeIn">
          <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
            {/* Elegant Golden Seals & Crest */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059] to-[#E5C079] rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="w-28 h-28 rounded-full border-2 border-[#C5A059] flex items-center justify-center bg-[#0D0D0D] relative z-10 overflow-hidden shadow-2xl shadow-[#C5A059]/20">
              <img 
                src={notaryLogo} 
                alt="NotarEez Golden Crest" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-widest text-white uppercase select-none">
            Notar<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C079] via-[#C5A059] to-[#9E7D3B] font-extrabold">Eez</span>
          </h1>
          
          {/* Logo Divider Line */}
          <div className="flex items-center gap-3 w-full max-w-sm my-2">
            <span className="h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]/60 flex-1"></span>
            <span className="text-xs font-serif font-bold text-[#C5A059] tracking-[0.2em] uppercase">Signing Services</span>
            <span className="h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]/60 flex-1"></span>
          </div>
          
          {/* Slogan cursive style */}
          <p className="font-serif italic text-2xl md:text-3xl text-[#C5A059] mt-2 select-none tracking-wide">
            Notarizing Made Eez.
          </p>
        </div>

        {/* Heart icon divider */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="w-10 h-px bg-[#C5A059]/20"></span>
          <span className="text-[#C5A059] text-sm font-light">♥</span>
          <span className="w-10 h-px bg-[#C5A059]/20"></span>
        </div>

        {/* NEED A MOBILE NOTARY DISPLAY */}
        <div className="max-w-3xl mx-auto bg-[#141414] border border-[#2D2D2D] p-8 rounded-3xl backdrop-blur-sm shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl"></div>
          
          <p className="text-sm md:text-base font-serif font-semibold text-white tracking-[0.2em] uppercase mb-1">
            Need a
          </p>
          <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#E5C079] via-[#C5A059] to-[#9E7D3B] mb-2 uppercase">
            Mobile Notary?
          </h2>
          <p className="text-xs md:text-sm text-gray-400 uppercase tracking-widest mb-6 font-mono">
            Anywhere. Anytime. Your Convenience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              type="button"
              onClick={() => onTabChange('book')}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#E5C079] via-[#C5A059] to-[#9E7D3B] hover:from-[#C5A059] hover:to-[#7E612B] text-black font-serif font-bold rounded-full shadow-lg shadow-[#C5A059]/10 tracking-wide transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Book Online Now
            </button>
            <button 
              type="button"
              onClick={() => onTabChange('rates')}
              className="w-full sm:w-auto px-8 py-3 bg-transparent border border-[#C5A059]/30 hover:border-[#C5A059] text-[#C5A059] hover:text-white font-serif font-semibold rounded-full tracking-wide transition cursor-pointer"
            >
              View Statutory Rates
            </button>
          </div>
        </div>

        {/* 3 Pillars / Value Propositions (Professional, Reliable, Convenient) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16 text-left">
          
          <div className="p-6 rounded-2xl bg-[#121212] border-l-2 border-[#C5A059] border-t border-r border-b border-[#2D2D2D] hover:border-[#C5A059]/30 transition duration-300">
            <div className="w-10 h-10 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl flex items-center justify-center mb-4 text-[#C5A059]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-2">Professional</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fully commissioned, bonded, and error-and-omission insured. You can count on meticulous, error-free professional service for all legal signings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121212] border-l-2 border-[#C5A059] border-t border-r border-b border-[#2D2D2D] hover:border-[#C5A059]/30 transition duration-300">
            <div className="w-10 h-10 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl flex items-center justify-center mb-4 text-[#C5A059]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-2">Reliable</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Dependable, highly punctual, and detail-oriented. Trusted across Florida to get sensitive signings done right the first time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121212] border-l-2 border-[#C5A059] border-t border-r border-b border-[#2D2D2D] hover:border-[#C5A059]/30 transition duration-300">
            <div className="w-10 h-10 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl flex items-center justify-center mb-4 text-[#C5A059]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-2">Convenient</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We come to you! Meet at your home, corporate office, healthcare hospital room, or any custom location of your convenience.
            </p>
          </div>

        </div>

      </div>

      {/* Meet Georgina Intro Area */}
      <div className="border-t border-[#2D2D2D] bg-[#0D0D0D] py-20 px-4 md:px-8 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Elegant Intro Badge & Text - 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="font-serif italic text-[#C5A059] text-lg md:text-xl block mb-2">Hi, I'm Georgina Aubain</span>
              <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                Owner of NotarEez <br />
                <span className="text-[#C5A059] italic font-normal">Signing Services.</span>
              </h2>
              <div className="w-16 h-0.5 bg-[#C5A059]/40 mt-4"></div>
            </div>

            <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xl">
              As a dedicated Florida Mobile Notary Public, I understand that legal, real estate, and financial transactions can be stressful. My absolute priority is delivering seamless, stress-free, and legally compliant notarizations on your schedule. Whether you need an urgent power of attorney, an affidavit notarized at the hospital, or a travel consent document, I am here to help.
            </p>

            {/* Quick Contact Info Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-lg shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Call or Text</span>
                  <a href="tel:4078640625" className="text-sm font-bold text-white hover:text-[#C5A059] transition">407-864-0625</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-lg shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Email Directly</span>
                  <a href="mailto:notareezsigning@gmail.com" className="text-sm font-bold text-white hover:text-[#C5A059] transition break-all">notareezsigning@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-lg shrink-0">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Local Service Area</span>
                  <span className="text-sm font-bold text-[#C5A059]">Serving Central Florida</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-lg shrink-0">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Availability</span>
                  <span className="text-sm font-bold text-white">Same-Day & After-Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map/Area Vector Graphics Section - 5 Cols */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#2D2D2D] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl"></div>
            
            <h3 className="text-lg font-serif text-[#C5A059] font-bold mb-1 uppercase tracking-wider text-center">We Come To You!</h3>
            <p className="text-[11px] text-gray-400 text-center mb-6">Wherever you need us, we'll be there.</p>

            <div className="space-y-4">
              
              <div className="flex items-center gap-3 p-3 bg-[#1A1A1A]/40 border border-[#2D2D2D] rounded-xl hover:border-[#C5A059]/20 transition">
                <span className="p-2 bg-[#C5A059]/10 text-[#C5A059] rounded-lg"><Home className="w-4 h-4" /></span>
                <div>
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Home</h4>
                  <p className="text-[10px] text-gray-400">In the comfort of your living room or kitchen table.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#1A1A1A]/40 border border-[#2D2D2D] rounded-xl hover:border-[#C5A059]/20 transition">
                <span className="p-2 bg-[#C5A059]/10 text-[#C5A059] rounded-lg"><Building className="w-4 h-4" /></span>
                <div>
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Corporate Office</h4>
                  <p className="text-[10px] text-gray-400">At your conference table or work desk during business hours.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#1A1A1A]/40 border border-[#2D2D2D] rounded-xl hover:border-[#C5A059]/20 transition">
                <span className="p-2 bg-[#C5A059]/10 text-[#C5A059] rounded-lg"><Activity className="w-4 h-4" /></span>
                <div>
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Hospital Rooms</h4>
                  <p className="text-[10px] text-gray-400">At the patient bedside with careful, professional handling.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#1A1A1A]/40 border border-[#2D2D2D] rounded-xl hover:border-[#C5A059]/20 transition">
                <span className="p-2 bg-[#C5A059]/10 text-[#C5A059] rounded-lg"><Users className="w-4 h-4" /></span>
                <div>
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Nursing Homes</h4>
                  <p className="text-[10px] text-gray-400">Treating seniors with patience, respect, and clear guidance.</p>
                </div>
              </div>

            </div>

            {/* Custom Florida Mini Map Graphic Container */}
            <div className="mt-6 pt-5 border-t border-[#2D2D2D] flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 text-xs text-[#C5A059] font-serif italic">
                <span>📍 Proudly Serving Central Florida</span>
              </div>
              <p className="text-[10px] text-gray-500 text-center">
                Orlando, Kissimmee, Sanford, Winter Park, and surrounding areas.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
