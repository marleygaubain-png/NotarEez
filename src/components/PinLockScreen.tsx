import React, { useState, useEffect } from 'react';
import { Shield, Delete, CornerDownLeft, Lock, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

interface PinLockScreenProps {
  onSuccess: () => void;
  onBackToSite: () => void;
  correctPin: string;
}

export default function PinLockScreen({ onSuccess, onBackToSite, correctPin }: PinLockScreenProps) {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [errorFlash, setErrorFlash] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  useEffect(() => {
    if (enteredPin.length === 4) {
      if (enteredPin === correctPin) {
        // Success!
        setTimeout(() => {
          onSuccess();
        }, 150);
      } else {
        // Incorrect PIN
        setShake(true);
        setErrorFlash(true);
        // Play audio beep/vibrate or feedback
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        setTimeout(() => {
          setShake(false);
          setErrorFlash(false);
          setEnteredPin('');
        }, 600);
      }
    }
  }, [enteredPin, correctPin, onSuccess]);

  const handleNumberClick = (num: string) => {
    if (enteredPin.length < 4 && !errorFlash) {
      setEnteredPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (enteredPin.length > 0 && !errorFlash) {
      setEnteredPin(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!errorFlash) {
      setEnteredPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Visual Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-sm bg-[#0D0D0D] border border-[#2D2D2D] rounded-3xl p-8 shadow-2xl shadow-black relative z-10 flex flex-col items-center">
        
        {/* Back Button to Customer Site */}
        <button
          type="button"
          onClick={onBackToSite}
          className="absolute top-6 left-6 text-xs text-gray-500 hover:text-[#C5A059] transition flex items-center gap-1.5 font-medium group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Client Site
        </button>

        {/* Lock / Crest Icon */}
        <div className="mt-4 mb-5 relative">
          <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-lg animate-pulse"></div>
          <div className="w-16 h-16 rounded-full border border-[#C5A059] bg-[#0A0A0A] flex items-center justify-center relative z-10">
            <Shield className="w-7 h-7 text-[#C5A059]" />
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center space-y-1.5 mb-8">
          <h2 className="text-xl font-serif text-white font-black tracking-wide">
            Notar<span className="text-[#C5A059]">Eez</span> Owner Lock
          </h2>
          <p className="text-xs text-gray-400 max-w-[240px] mx-auto">
            Please enter your 4-digit PIN to access administrative business controls.
          </p>
        </div>

        {/* PIN Bubble Indicators */}
        <div 
          className={`flex gap-5 mb-10 transition-transform ${
            shake ? 'animate-shake' : ''
          }`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = enteredPin.length > index;
            return (
              <div
                key={index}
                className={`w-4.5 h-4.5 rounded-full border transition-all duration-150 ${
                  errorFlash
                    ? 'bg-red-500/20 border-red-500 scale-105'
                    : isFilled
                      ? 'bg-[#C5A059] border-[#C5A059] scale-110 shadow-sm shadow-[#C5A059]/50'
                      : 'bg-[#121212] border-[#2D2D2D]'
                }`}
              />
            );
          })}
        </div>

        {/* Keypad Numeric Grid */}
        <div className="grid grid-cols-3 gap-4.5 w-full max-w-[270px] mb-8">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-full border border-[#2D2D2D]/60 bg-[#121212]/40 hover:bg-[#C5A059]/10 hover:border-[#C5A059]/30 text-white font-serif font-black text-xl transition-all cursor-pointer flex items-center justify-center select-none active:scale-95"
            >
              {num}
            </button>
          ))}
          
          {/* Keypad Specials */}
          <button
            type="button"
            onClick={handleClear}
            className="w-16 h-16 rounded-full text-gray-500 hover:text-white transition-colors text-[11px] uppercase tracking-wider font-semibold font-mono cursor-pointer flex items-center justify-center select-none"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleNumberClick('0')}
            className="w-16 h-16 rounded-full border border-[#2D2D2D]/60 bg-[#121212]/40 hover:bg-[#C5A059]/10 hover:border-[#C5A059]/30 text-white font-serif font-black text-xl transition-all cursor-pointer flex items-center justify-center select-none active:scale-95"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-16 h-16 rounded-full text-gray-500 hover:text-[#C5A059] transition-colors cursor-pointer flex items-center justify-center select-none"
            title="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Security Warning & Hint */}
        <div className="w-full text-center space-y-1">
          <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1 font-mono">
            <Lock className="w-3 h-3 text-gray-500 shrink-0" />
            Secure Session • End-to-End Local
          </p>
          <div className="inline-block px-3 py-1 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-full text-[10px] text-[#C5A059]/80 font-mono">
            Default PIN: <span className="font-bold underline">{correctPin}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
