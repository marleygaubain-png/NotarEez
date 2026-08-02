import React, { useState } from 'react';
import { Shield, Lock, User, ArrowLeft, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

interface OwnerLoginScreenProps {
  onSuccess: () => void;
  onBackToSite: () => void;
  storedUsername?: string;
  storedPassword?: string;
}

export default function OwnerLoginScreen({ 
  onSuccess, 
  onBackToSite, 
  storedUsername = 'GMarieA', 
  storedPassword = '2406Talon' 
}: OwnerLoginScreenProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const cleanInputUser = username.trim();
      const cleanExpectedUser = storedUsername.trim();

      const userMatches = cleanInputUser.toLowerCase() === cleanExpectedUser.toLowerCase();
      const passMatches = password === storedPassword;

      if (userMatches && passMatches) {
        onSuccess();
      } else {
        setErrorMessage('Invalid username or password. Access denied.');
        setIsSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Visual Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#2D2D2D] rounded-3xl p-8 shadow-2xl shadow-black relative z-10">
        
        {/* Back Button to Customer Site */}
        <button
          type="button"
          onClick={onBackToSite}
          className="text-xs text-gray-500 hover:text-[#C5A059] transition flex items-center gap-1.5 font-medium group cursor-pointer mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Client Website
        </button>

        {/* Lock / Crest Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-lg animate-pulse"></div>
            <div className="w-16 h-16 rounded-full border border-[#C5A059] bg-[#0A0A0A] flex items-center justify-center relative z-10">
              <Shield className="w-8 h-8 text-[#C5A059]" />
            </div>
          </div>
          <h2 className="text-2xl font-serif text-white font-black tracking-wide text-center">
            Owner <span className="text-[#C5A059] italic font-normal">Portal</span>
          </h2>
          <p className="text-xs text-gray-400 text-center mt-1">
            NotarEez Administrative Sign-In for Georgina
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <User className="w-4 h-4 text-[#C5A059]" />
              </div>
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 pl-10 pr-4 bg-[#141414] border border-[#2D2D2D] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] rounded-xl text-sm text-white outline-none transition-all placeholder:text-gray-600 font-medium"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4 text-[#C5A059]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-10 bg-[#141414] border border-[#2D2D2D] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] rounded-xl text-sm text-white outline-none transition-all placeholder:text-gray-600 font-medium"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#d1ab63] hover:to-[#ebd08f] text-black font-bold rounded-xl text-sm tracking-wide shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin font-bold">↻</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Sign In to Owner Portal
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#2D2D2D] text-center">
          <p className="text-[11px] text-gray-500">
            Protected administrative access for NotarEez Mobile Signing Services.
          </p>
        </div>

      </div>
    </div>
  );
}
