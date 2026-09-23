import React from 'react';
import { Search, Youtube, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="w-full bg-white font-sans">
      {/* 1. Top Utility Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center py-1 px-4 text-[11px] font-medium text-gray-700">
          <div className="flex items-center space-x-2">
            <span className="font-bold">भारत सरकार</span>
            <span className="text-gray-300">|</span>
            <span>GOVERNMENT OF INDIA</span>
          </div>
          <div className="flex items-center divide-x divide-gray-300">
            <button className="px-3 hover:text-blue-600 uppercase font-semibold">Skip to main content</button>
            <div className="px-3 flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 cursor-pointer hover:text-blue-600" />
            </div>
            <div className="px-3 flex items-center space-x-1 cursor-pointer hover:text-blue-600">
              <span className="text-sm font-bold">T</span><span className="text-xs">T</span>
            </div>
            <div className="px-3 flex items-center space-x-2">
              <Facebook className="w-3 h-3 cursor-pointer hover:text-blue-600" />
              <Twitter className="w-3 h-3 cursor-pointer hover:text-blue-400" />
              <Youtube className="w-3 h-3 cursor-pointer hover:text-red-600" />
            </div>
            <button className="px-3 text-blue-700 font-bold hover:underline">हिन्दी</button>
          </div>
        </div>
      </div>

      {/* 2. Main Branding Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto py-6 px-4 flex justify-between items-center">
          {/* Left: New Ministry Logo (Emblem + Text) */}
          <div className="flex flex-col items-center">
            <img 
              src="/images/saarth_logo.jpg?v=3" 
              alt="SAARTH Initiative" 
              className="h-24 w-auto object-contain hover:scale-105 transition-transform cursor-pointer rounded-xl shadow-sm border border-gray-100"
            />
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-2">Under Ministry of Tourism</p>
          </div>
          
          {/* Right: Partner Logos */}
          <div className="flex items-center space-x-10">
            <img 
              src="/images/logo3.jpg" 
              alt="Utsav" 
              className="h-16 w-auto object-contain transition-all hover:scale-110"
            />
            <img 
              src="/images/logo1.jpg" 
              alt="Swachh Bharat Yellow" 
              className="h-14 w-auto object-contain transition-all hover:scale-110"
            />
            <img 
              src="/images/logo2.jpg" 
              alt="Incredible India" 
              className="h-12 w-auto object-contain transition-all hover:scale-110"
            />
            <img 
              src="/images/logo4.png" 
              alt="Swachh Bharat Glasses" 
              className="h-16 w-auto object-contain transition-all hover:scale-110"
            />
          </div>
        </div>
      </div>

      {/* 3. Navigation Menu */}
      <nav className="bg-[#002B5B] text-white shadow-xl">
        <div className="max-w-[1400px] mx-auto flex overflow-x-auto whitespace-nowrap scrollbar-hide md:justify-center">
          {[
            'Home', 
            'Ministry', 
            'Places to Visit', 
            'Experiences', 
            'Trade', 
            'Reports', 
            'Contact Us'
          ].map((item, index) => (
            <button 
              key={index}
              onClick={() => onTabChange(item)}
              className={`px-8 py-5 text-[14px] font-bold transition-all border-r border-white/5 last:border-0 uppercase tracking-widest ${
                activeTab === item ? 'bg-orange-600' : 'hover:bg-white/10'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
