import React, { useState } from 'react';
import { ContactInquiry } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle, Smartphone, Award, ExternalLink } from 'lucide-react';
import ContactQRCode from './ContactQRCode';

interface ContactSectionProps {
  onInquiryCreated: (inq: ContactInquiry) => void;
}

export default function ContactSection({ onInquiryCreated }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') return;

    const newInquiry: ContactInquiry = {
      id: 'INQ-' + Math.floor(100000 + Math.random() * 900000),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    onInquiryCreated(newInquiry);
    setSubmitted(true);

    // Reset fields after some time
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact-section" className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-gray-200 border-t border-[#2D2D2D]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block mb-2">Connect With Georgina</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white">
            Let's Get It <span className="text-[#C5A059] italic font-normal">Done!</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059]/40 mx-auto mt-4"></div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Contact Details & QR card - 5 Cols */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-[#121212] border border-[#2D2D2D] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-3xl"></div>
            
            <div className="space-y-6">
              <div>
                <span className="text-[#C5A059] text-[10px] font-mono uppercase tracking-widest block">NotarEez Signing Services</span>
                <h3 className="text-xl font-serif text-white font-bold mt-1">Quick Contact</h3>
                <p className="text-xs text-gray-400 mt-1">We are ready to answer your questions or consult on your custom travel needs.</p>
              </div>

              {/* Detail Items */}
              <div className="space-y-4">
                
                <a href="tel:4078640625" className="flex items-center gap-4 p-3 rounded-xl bg-[#C5A059]/5 border border-[#C5A059]/10 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10 transition group">
                  <span className="p-2.5 bg-[#C5A059]/10 text-[#C5A059] rounded-lg group-hover:scale-105 transition">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Call or Text</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#E5C079]">407-864-0625</span>
                  </div>
                </a>

                <a href="mailto:notareezsigning@gmail.com" className="flex items-center gap-4 p-3 rounded-xl bg-[#C5A059]/5 border border-[#C5A059]/10 hover:border-[#C5A059]/20 hover:bg-[#C5A059]/10 transition group">
                  <span className="p-2.5 bg-[#C5A059]/10 text-[#C5A059] rounded-lg group-hover:scale-105 transition">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Email Address</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#E5C079] break-all">notareezsigning@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#C5A059]/5 border border-[#C5A059]/10">
                  <span className="p-2.5 bg-[#C5A059]/10 text-[#C5A059] rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Serving Areas</span>
                    <span className="text-sm font-bold text-[#C5A059]">Orlando & Central Florida</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Virtual Contact Card / QR Simulation matching last screenshot */}
            <div className="mt-8 pt-6 border-t border-[#2D2D2D] flex justify-center">
              <ContactQRCode />
            </div>

          </div>

          {/* Contact Form card - 7 Cols */}
          <div className="lg:col-span-7 bg-[#121212] p-8 rounded-3xl border border-[#2D2D2D] shadow-2xl backdrop-blur-sm">
            <h3 className="text-xl font-serif text-white font-bold mb-4">Send an Inquiry</h3>
            <p className="text-xs text-gray-400 mb-6">
              Have a special document or travel request? Submit this direct form and Georgina will follow up immediately with a quote.
            </p>

            {submitted ? (
              <div className="p-10 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-center space-y-3 py-16">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059] text-[#C5A059] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-white text-lg">Inquiry Received Successfully</h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto">
                  Thank you for contacting NotarEez! Your inquiry has been logged, and Georgina Aubain will reach out to you within an hour.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="janedoe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    placeholder="(407) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Your Message</label>
                  <textarea 
                    rows={5}
                    required
                    placeholder="Hello! I need an acknowledgment signed for an estate deed at my office tomorrow at 2:00 PM. Please advise on travel fees."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#2D2D2D] rounded-lg p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C5A059] resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#E5C079] via-[#C5A059] to-[#9E7D3B] hover:from-[#C5A059] hover:to-[#7E612B] text-black font-serif font-bold rounded-lg text-xs shadow-md tracking-wider uppercase transition flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    Submit Inquiry <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            )}

            <div className="mt-6 p-3 bg-[#C5A059]/5 rounded-xl border border-[#2D2D2D] text-[10px] text-[#C5A059]/80 text-center">
              📜 Florida Notary Public services follow exact statutes to safeguard all parties against fraudulent transactions.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
