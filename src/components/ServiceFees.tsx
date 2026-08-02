import React, { useState } from 'react';
import { NOTARY_SERVICES, TRAVEL_BRACKETS } from '../types';
import { Scale, Milestone, DollarSign, Calculator, Info, ShieldAlert, Sparkles } from 'lucide-react';

interface ServiceFeesProps {
  onBookClick?: () => void;
}

export default function ServiceFees({ onBookClick }: ServiceFeesProps) {
  const [selectedService, setSelectedService] = useState(NOTARY_SERVICES[0].id);
  const [quantity, setQuantity] = useState(1);
  const [selectedDistance, setSelectedDistance] = useState('under_10');
  const [customMiles, setCustomMiles] = useState(45);

  // Fee calculation logic
  const serviceObj = NOTARY_SERVICES.find(s => s.id === selectedService) || NOTARY_SERVICES[0];
  const notaryFee = serviceObj.fee * quantity;
  
  let travelFee = 0;
  const bracket = TRAVEL_BRACKETS.find(b => b.id === selectedDistance) || TRAVEL_BRACKETS[0];
  if (bracket.id === 'over_40') {
    const extraMiles = Math.max(0, customMiles - 40);
    travelFee = 60 + extraMiles * 1.0;
  } else {
    travelFee = bracket.fee;
  }

  const totalFee = notaryFee + travelFee;

  return (
    <section id="fees-section" className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-gray-200 border-t border-[#2D2D2D]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs tracking-wider uppercase mb-4">
            <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
            Florida Statute Aligned
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-3">
            Official Notary <span className="text-[#C5A059] font-normal italic">Fee List</span>
          </h2>
          <p className="text-[#C5A059]/80 font-serif italic text-lg mb-4">
            Florida Maximum Fees (Chapter 117, Florida Statutes)
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base">
            NotarEez Signing Services charges standard statutory rates for notarization, with transparent, flat-rate, and negotiable mobile travel convenience fees.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Official Fees Table - 7 Cols */}
          <div className="lg:col-span-7 bg-[#121212] rounded-2xl border border-[#2D2D2D] shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-[#C5A059]/15 to-transparent p-6 border-b border-[#2D2D2D] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-serif font-bold text-white tracking-wide uppercase">Notarial Service</h3>
                <p className="text-xs text-[#C5A059]/70">Per notarial act or ceremony</p>
              </div>
              <Sparkles className="w-5 h-5 text-[#C5A059]/60 animate-pulse" />
            </div>

            <div className="divide-y divide-[#2D2D2D]">
              {NOTARY_SERVICES.map((srv) => (
                <div key={srv.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-[#1A1A1A] transition duration-300">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                      <h4 className="font-serif font-semibold text-white tracking-wide">{srv.name}</h4>
                    </div>
                    <p className="text-xs text-gray-400 pl-4">{srv.description}</p>
                  </div>
                  <div className="flex items-center sm:justify-end shrink-0 pl-4 sm:pl-0">
                    <span className="px-4 py-2 bg-[#C5A059]/10 rounded-lg border border-[#C5A059]/20 text-[#C5A059] font-mono font-bold text-lg">
                      ${srv.fee}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0D0D0D] p-4 border-t border-[#2D2D2D] text-xs text-gray-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>
                Fees list represent the legal maximum notarial act charge in the State of Florida. Mobile travel and convenience fees are charged in addition to these rates.
              </span>
            </div>
          </div>

          {/* Travel and Calculator Panel - 5 Cols */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Travel Fees List */}
            <div className="bg-[#121212] rounded-2xl border border-[#2D2D2D] p-6 shadow-2xl backdrop-blur-sm relative">
              <div className="absolute top-4 right-4 text-[#C5A059]/20">
                <Milestone className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">
                Mobile <span className="text-[#C5A059] italic font-normal">Travel Fee</span>
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Based on round-trip distance from starting point in <span className="text-[#C5A059] font-semibold">Eagle Lake, FL (subject to change)</span>. Travel fees are <span className="text-[#C5A059] font-semibold">negotiable and will be agreed upon prior to finalized booking</span>, depending on where Georgina is at that moment in time.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {TRAVEL_BRACKETS.map((bracket) => (
                  <div 
                    key={bracket.id}
                    className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2D2D2D] flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-xs text-gray-400">{bracket.milesRange}</span>
                    <span className="text-lg font-mono font-bold text-[#C5A059]">
                      {bracket.id === 'over_40' ? '$60 + $1.00/mi' : `$${bracket.fee}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl text-xs text-[#C5A059] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0"></span>
                <span>Same-Day & After-Hours Appointments Available.</span>
              </div>
            </div>

            {/* Quick Fee Estimate Widget */}
            <div className="bg-[#121212] rounded-2xl border border-[#C5A059]/30 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-lg font-serif text-white font-semibold">Instant Fee Estimator</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                
                {/* Service Selection */}
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5 font-medium uppercase tracking-wider">Select Notary Act</label>
                  <select 
                    value={selectedService} 
                    onChange={(e) => {
                      setSelectedService(e.target.value);
                    }}
                    className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    {NOTARY_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} (${s.fee})</option>
                    ))}
                  </select>
                </div>

                {/* Quantity and Service Info Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5 font-medium uppercase tracking-wider">Quantity (Acts)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="50" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5 font-medium uppercase tracking-wider">Service Format</label>
                    <div className="w-full py-2 px-3 rounded-lg border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5">
                      <Milestone className="w-3.5 h-3.5" /> Mobile In-Person
                    </div>
                  </div>
                </div>

                {/* Distance Selector */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5 font-medium uppercase tracking-wider">Travel Distance Bracket</label>
                    <select 
                      value={selectedDistance} 
                      onChange={(e) => setSelectedDistance(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                    >
                      {TRAVEL_BRACKETS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.milesRange} ({b.id === 'over_40' ? 'Starts at $60' : `$${b.fee}`})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedDistance === 'over_40' && (
                    <div className="animate-fadeIn">
                      <label className="block text-gray-400 text-xs mb-1 font-medium">Estimated Distance (Miles)</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" 
                          min="41" 
                          max="120" 
                          value={customMiles}
                          onChange={(e) => setCustomMiles(parseInt(e.target.value))}
                          className="w-full accent-[#C5A059] bg-[#2D2D2D] rounded-lg h-2 cursor-pointer"
                        />
                        <span className="text-[#C5A059] font-mono font-bold text-sm shrink-0">{customMiles} mi</span>
                      </div>
                      <p className="text-[10px] text-[#C5A059]/70 mt-1">
                        $60 base for first 40 miles + $1.00 per additional mile.
                      </p>
                    </div>
                  )}
                </div>

                {/* Fee Output Summary */}
                <div className="mt-6 pt-4 border-t border-[#2D2D2D] space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Notary Act Fee ({quantity}x):</span>
                    <span className="font-mono">${notaryFee}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Mobile Travel Fee:</span>
                    <span className="font-mono">${travelFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-white pt-2 border-t border-dashed border-[#C5A059]/20">
                    <span className="text-sm font-serif font-bold">Estimated Total:</span>
                    <div className="text-right">
                      <span className="text-xl font-mono font-bold text-[#C5A059]">
                        ${totalFee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Travel Fee Communication disclaimer */}
                <div className="p-3 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg text-xs text-gray-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#C5A059] font-semibold">
                    <Info className="w-3.5 h-3.5" />
                    <span>Travel Fee & Communication</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Travel fees are <span className="text-[#C5A059] font-semibold">negotiable and agreed upon prior to finalized booking</span> based on a starting point of Eagle Lake, FL (which is subject to change depending on Georgina's location at that moment in time). You will receive a follow-up communication via <span className="text-white font-semibold">text message</span> about the travel fee if it applies.
                  </p>
                </div>

                {/* CTA to Booking */}
                <button 
                  type="button"
                  onClick={() => {
                    if (onBookClick) {
                      onBookClick();
                    } else {
                      window.location.hash = '#booking-section';
                    }
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#E5C079] via-[#C5A059] to-[#9E7D3B] hover:from-[#C5A059] hover:to-[#7E612B] text-black font-serif font-semibold rounded-lg text-sm shadow-md shadow-[#C5A059]/10 transition-all active:scale-[0.98] mt-4"
                >
                  Book This Service Now
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
