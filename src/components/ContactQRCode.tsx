import React from 'react';
import qrCodeImage from '../assets/images/contact_qrcode_exact_1785623808709.jpg';

export default function ContactQRCode() {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-[#121212] border border-[#2D2D2D] rounded-3xl max-w-sm mx-auto shadow-2xl relative group overflow-hidden">
      {/* Golden accent border flare */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E5C079] via-[#C5A059] to-[#9E7D3B] rounded-t-3xl"></div>
      
      <div className="w-full relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-[1.02] border border-[#2D2D2D]">
        <img 
          src={qrCodeImage}
          alt="Georgina Aubain QR Code Contact Card"
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-1 mt-4">
        <h4 className="text-xs font-serif font-bold text-white tracking-wide">Georgina Aubain, Notary Public</h4>
        <p className="text-[10px] text-[#C5A059] font-semibold uppercase tracking-wider">Central Florida Mobile Services</p>
        <p className="text-[10px] text-gray-400 font-mono">📞 407-864-0625</p>
      </div>

      <a
        href="mailto:notareezsigning@gmail.com?subject=Save%20Notary%20Contact"
        className="mt-4 px-4 py-2 bg-[#C5A059]/10 border border-[#C5A059]/30 hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all text-[10px] font-bold font-mono uppercase tracking-wider rounded-lg w-full text-center cursor-pointer"
      >
        Email Contact Details
      </a>
    </div>
  );
}
