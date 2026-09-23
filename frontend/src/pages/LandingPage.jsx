import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Plane, Users, UserCircle, KeyRound, LogIn, BookOpen, MapPin, Compass, Calendar, X, AlertCircle, ChevronLeft, ChevronRight, Globe, TrendingUp, Info, Utensils, IndianRupee, Search, Eye, EyeOff, Star, Phone, Mail } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';
import axios from 'axios';
import Header from '../components/IncredibleIndia/Header';
import Footer from '../components/IncredibleIndia/Footer';
import Flipbook from '../components/IncredibleIndia/Flipbook';
import Captcha from '../components/Captcha';

import { indiaTourismData } from '../data/indiaTourismData';

const exchangeRates = { 
  USD: 95, 
  EUR: 111, 
  GBP: 129, 
  JPY: 0.61, 
  CNY: 14, 
  AED: 26, 
  SAR: 25, 
  KWD: 280, 
  BHD: 252, 
  OMR: 244, 
  CAD: 70, 
  AUD: 68, 
  SGD: 74, 
  CHF: 121, 
  RUB: 1.1, 
  PKR: 0.34, 
  BDT: 0.78, 
  NPR: 0.63, 
  LKR: 0.31, 
  THB: 2.6, 
  MYR: 24, 
  ZAR: 5
};

// --- SUB-COMPONENTS ---

const MinistryView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 px-8 max-w-6xl mx-auto">
    <div className="flex items-center space-x-4 mb-12 border-b pb-6">
      <div className="p-4 bg-orange-100 rounded-2xl"><Info className="text-orange-600 w-10 h-10" /></div>
      <div>
        <h2 className="text-4xl font-serif font-bold text-gray-900">Ministry of Tourism Overview</h2>
        <p className="text-gray-500 uppercase tracking-widest text-sm mt-1">Government of India</p>
      </div>
    </div>
    
    <div className="space-y-12 text-gray-700">
      <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
        <p className="text-xl leading-relaxed mb-8">
          The **Ministry of Tourism** is the nodal agency for the formulation of national policies and programs and for the co-ordination of activities of various Central Government Agencies, State Governments/UTs and the Private Sector for the development and promotion of tourism in the country. The Ministry is headed by the **Union Minister for Tourism** and Ministers of State.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest mb-3">Administrative Leadership</h4>
            <p className="text-lg">The administrative head of the Ministry is the **Secretary (Tourism)**. The office of the **Director General of Tourism** provides executive directions for the implementation of various policies and programs.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest mb-3">Field Formation</h4>
            <p className="text-lg text-sm">Directorate General of Tourism has **20 offices** within the country and one sub-ordinate office/project: **Indian Institute of Skiing and Mountaineering (IISM)/ Gulmarg Winter Sports Project**.</p>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center"><Shield className="w-6 h-6 mr-3 text-blue-600" /> Institutions & PSUs</h3>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50/50">
              <h5 className="font-bold">India Tourism Development Corporation Limited (ITDC)</h5>
              <p className="text-sm text-gray-600">The Ministry's dedicated public sector undertaking.</p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50/50">
              <h5 className="font-bold">Autonomous Institutions</h5>
              <ul className="text-sm text-gray-600 mt-2 list-disc ml-4 space-y-1">
                <li>IITTM & National Institute of Water Sports (NIWS)</li>
                <li>NCHMCT and the Institutes of Hotel Management.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center"><Users className="w-6 h-6 mr-3 text-orange-500" /> Role & Functions</h3>
          <p className="text-sm leading-relaxed">Playing a crucial role in coordinating efforts of the State Governments, catalyzing private investment, and strengthening promotional efforts.</p>
          <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider">
            <div className="p-3 bg-slate-100 rounded-lg">Development Policies</div>
            <div className="p-3 bg-slate-100 rounded-lg">Incentives</div>
            <div className="p-3 bg-slate-100 rounded-lg">Manpower Development</div>
            <div className="p-3 bg-slate-100 rounded-lg">External Assistance</div>
            <div className="p-3 bg-slate-100 rounded-lg">Publicity & Marketing</div>
            <div className="p-3 bg-slate-100 rounded-lg">Investment Facilitation</div>
          </div>
        </section>
      </div>
    </div>
  </motion.div>
);

const PlacesToVisitView = ({ onSelectState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = indiaTourismData.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold text-gray-900 leading-tight">Explore the Beauty of India</h2>
        <p className="text-gray-500 mt-4 text-xl">All 28 States & 8 Union Territories with Expert Guides</p>
        <div className="max-w-xl mx-auto mt-10 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search State, UT, or Landmark..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-16 py-6 bg-white border-2 border-slate-100 rounded-3xl shadow-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none font-medium text-lg transition-all"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredData.map((state, i) => (
          <motion.div key={i} whileHover={{ y: -12 }} onClick={() => onSelectState(state)} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-50 flex flex-col h-full group cursor-pointer">
            <div className="h-72 overflow-hidden relative">
              <img src={state.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={state.name} />
              <div className="absolute top-6 left-6 bg-orange-600 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter shadow-lg">{state.type}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-4xl font-serif font-bold leading-none mb-2">{state.name}</h3>
                <div className="flex items-center text-orange-400 text-xs font-bold uppercase tracking-widest">
                  <MapPin className="w-3 h-3 mr-1" /> India's Heritage
                </div>
              </div>
            </div>
            <div className="p-10 flex-grow flex flex-col">
              <p className="text-gray-500 text-base mb-8 leading-relaxed line-clamp-3">{state.description}</p>
              <button 
                onClick={() => onSelectState(state)}
                className="mt-auto w-full py-5 bg-[#002B5B] text-white font-bold rounded-2xl hover:bg-orange-600 transition-all uppercase tracking-widest shadow-xl group-hover:shadow-orange-200"
              >
                View State Guide →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const StateDetailModal = ({ state, onClose }) => (
  <AnimatePresence>
    {state && (
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-10 bg-slate-900/40 backdrop-blur-3xl overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 100 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.9, y: 100 }} 
          className="bg-white w-full max-w-7xl rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative my-auto"
        >
          <button onClick={onClose} className="absolute top-10 right-10 z-[600] p-4 bg-white/20 backdrop-blur-md hover:bg-orange-600 text-white rounded-full transition-all border border-white/30 shadow-2xl">
            <X className="w-8 h-8" />
          </button>

          <div className="relative h-[60vh] md:h-[70vh]">
            <img src={state.img} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>
            <div className="absolute bottom-20 left-10 md:left-20 max-w-3xl">
              <span className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-xl">{state.type}</span>
              <h2 className="text-7xl md:text-9xl font-serif font-bold text-gray-900 mt-6 drop-shadow-2xl">{state.name}</h2>
              <p className="text-2xl md:text-3xl font-medium text-gray-700 mt-6 leading-tight italic">"{state.description}"</p>
            </div>
          </div>

          <div className="p-10 md:p-20 space-y-32">
            {/* Locations Section */}
            <div>
              <div className="flex items-end justify-between mb-16 border-b-4 border-blue-50 pb-8">
                <div>
                  <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm mb-2">Destinations</p>
                  <h3 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">5 Must-Visit Locations</h3>
                </div>
                <Compass className="w-20 h-20 text-blue-100 hidden md:block" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {state.locations && state.locations.map((loc, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group">
                    <div className="h-80 rounded-[3rem] overflow-hidden shadow-2xl relative mb-6">
                      <img src={loc.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={loc.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h4 className="text-2xl font-bold text-white mb-1">{loc.name}</h4>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed px-2">{loc.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Food Section */}
            {state.foods && state.foods.length > 0 && (
              <div className="bg-orange-50/50 p-10 md:p-20 rounded-[5rem] border-2 border-orange-100">
                <div className="flex items-end justify-between mb-16 border-b-4 border-orange-200 pb-8">
                  <div>
                    <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-sm mb-2">Culinary Delights</p>
                    <h3 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">Famous Local Foods</h3>
                  </div>
                  <Utensils className="w-20 h-20 text-orange-200 hidden md:block" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {state.foods.map((food, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-[3.5rem] shadow-xl border border-orange-100">
                      <div className="h-64 rounded-[2.5rem] overflow-hidden mb-8 shadow-inner">
                        <img src={food.img} className="w-full h-full object-cover" alt={food.name} />
                      </div>
                      <h4 className="text-3xl font-serif font-bold text-gray-900 mb-4">{food.name}</h4>
                      <p className="text-gray-600 text-lg leading-snug">{food.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center py-10">
              <button onClick={onClose} className="px-20 py-6 bg-[#002B5B] text-white rounded-full font-black text-xl uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all">Close Explorer</button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ExperiencesView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 px-8 max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Tourist Experiences & Impact</h2>
      <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <div className="bg-blue-50 p-8 rounded-3xl text-center shadow-sm">
        <h4 className="text-4xl font-bold text-blue-700 mb-2">9.2M</h4>
        <p className="text-blue-900 font-semibold uppercase tracking-widest text-xs">Foreign Tourists (2023)</p>
      </div>
      <div className="bg-orange-50 p-8 rounded-3xl text-center shadow-sm">
        <h4 className="text-4xl font-bold text-orange-700 mb-2">1.7B</h4>
        <p className="text-orange-900 font-semibold uppercase tracking-widest text-xs">Domestic Visits (2023)</p>
      </div>
      <div className="bg-green-50 p-8 rounded-3xl text-center shadow-sm">
        <h4 className="text-4xl font-bold text-green-700 mb-2">4.8/5</h4>
        <p className="text-green-900 font-semibold uppercase tracking-widest text-xs">Average Satisfaction</p>
      </div>
    </div>
    
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 flex items-center"><TrendingUp className="mr-3 text-orange-500" /> Growth Trends</h3>
      <p className="text-gray-600 text-lg leading-relaxed">India has seen a **15.2% year-on-year growth** in foreign tourist arrivals in 2024. The "Incredible India" campaign's digital push has significantly improved the experience for first-time visitors.</p>
    </div>
  </motion.div>
);

const ContactUsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 px-8 max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Contact Us</h2>
      <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
      <p className="text-gray-500 uppercase tracking-widest text-sm mt-4">Get in touch with the SAARTH Team</p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <div className="bg-white p-8 rounded-[2rem] text-center shadow-xl border border-gray-100 flex flex-col items-center hover:border-blue-200 transition-all">
        <div className="p-4 bg-blue-50 rounded-2xl mb-6"><MapPin className="w-8 h-8 text-blue-600" /></div>
        <h4 className="text-lg font-black text-[#002B5B] uppercase tracking-wider mb-2">Address</h4>
        <p className="text-gray-600 font-bold text-lg">Transport Bhawan, Sansad Marg, New Delhi</p>
      </div>
      <div className="bg-white p-8 rounded-[2rem] text-center shadow-xl border border-gray-100 flex flex-col items-center hover:border-green-200 transition-all">
        <div className="p-4 bg-green-50 rounded-2xl mb-6"><Phone className="w-8 h-8 text-green-600" /></div>
        <h4 className="text-lg font-black text-[#002B5B] uppercase tracking-wider mb-2">Phone</h4>
        <p className="text-gray-600 font-bold text-xl">+91-11-23711252</p>
      </div>
      <div className="bg-white p-8 rounded-[2rem] text-center shadow-xl border border-gray-100 flex flex-col items-center hover:border-red-200 transition-all">
        <div className="p-4 bg-red-50 rounded-2xl mb-6"><Mail className="w-8 h-8 text-red-600" /></div>
        <h4 className="text-lg font-black text-[#002B5B] uppercase tracking-wider mb-2">Email</h4>
        <p className="text-gray-600 font-bold text-lg break-all">saarthindia5@gmail.com</p>
      </div>
    </div>
  </motion.div>
);

const TradeView = () => {
  const [amount, setAmount] = useState(1);
  const [currency, setCurrency] = useState('USD');
  const [isInverted, setIsInverted] = useState(false);
  
  const rate = exchangeRates[currency];
  const result = isInverted 
    ? (amount / rate).toFixed(2)
    : (amount * rate).toFixed(2);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 px-4 flex justify-center items-center bg-slate-50 min-h-[60vh]">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-4xl border border-gray-100 grid md:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center space-x-4 mb-10">
            <div className="p-3 bg-blue-100 rounded-xl"><IndianRupee className="text-blue-700 w-8 h-8" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 leading-tight">Rupees Calculator</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Real-time Exchange Rates</p>
            </div>
          </div>
          
          <div className="space-y-6 text-gray-900">
            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase mb-3">Select Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl font-bold text-gray-900 outline-none focus:border-blue-500 transition-all">
                {Object.keys(exchangeRates).map(curr => <option key={curr} value={curr}>{curr}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase mb-3">
                {isInverted ? 'Amount in INR' : `Amount in ${currency}`}
              </label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl font-bold text-gray-900 outline-none focus:border-blue-500 transition-all" />
            </div>

            <button 
              onClick={() => setIsInverted(!isInverted)}
              className="flex items-center justify-center space-x-2 text-blue-600 font-bold hover:text-blue-800 transition-colors"
            >
              <Compass className="w-4 h-4" /> 
              <span>Swap Direction</span>
            </button>
          </div>
        </div>

        <div className="bg-[#002B5B] text-white p-10 rounded-[2.5rem] flex flex-col justify-between">
          <div>
            <p className="text-blue-300 font-bold uppercase tracking-widest text-xs mb-2">Equivalent Amount</p>
            <div className="text-5xl font-black tracking-tight">
              {isInverted ? `${result} ${currency}` : `₹${result}`}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 mt-6">
            <p className="text-blue-300 text-sm font-medium mb-1">Exchange Rate</p>
            <p className="text-xl font-bold">1 {currency} = ₹{rate}</p>
            <p className="text-xs text-blue-200 mt-2 opacity-70">Rates are indicative and for reference only.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ReportsView = () => {
  const [rating, setRating] = useState(4.8);
  const [count, setCount] = useState(2534);

  useEffect(() => {
    const savedRating = localStorage.getItem('saarth_rating');
    const savedCount = localStorage.getItem('saarth_count');
    if (savedRating) setRating(parseFloat(savedRating));
    if (savedCount) setCount(parseInt(savedCount));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 px-8 max-w-6xl mx-auto">
      <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Tourism Reports 2026</h2>
      
      {/* Live Rating Stats Card */}
      <div className="bg-gradient-to-r from-[#002B5B] to-[#00428a] p-8 rounded-[2rem] text-white mb-12 flex flex-col md:flex-row justify-between items-center shadow-2xl border border-white/10">
         <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
              <Star className="w-10 h-10 text-orange-400 fill-current" />
            </div>
            <div>
              <p className="text-5xl font-black text-white">{rating.toFixed(1)}</p>
              <p className="text-[10px] uppercase font-black text-orange-400 tracking-widest mt-1">Platform Rating</p>
            </div>
         </div>
         <div className="text-center md:text-right">
            <p className="text-3xl font-black text-white">{count}</p>
            <p className="text-[10px] uppercase font-black text-blue-300 tracking-widest mt-1">Verified Reviews</p>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-gray-800">Top 5 Visited Monuments</h3>
        {[
          { name: "Taj Mahal", count: "6.26M", img: "/images/taj_mahal.jpg" },
          { name: "Sun Temple", count: "3.57M", img: "/images/sun_temple.jpg" },
          { name: "Qutub Minar", count: "3.20M", img: "/images/qutab_minar.jpg" },
          { name: "Red Fort", count: "2.88M", img: "/images/red_fort.jpg" },
          { name: "Bibi Ka Maqbara", count: "2.00M", img: "/images/bibi_ka_maqbara.jpg" }
        ].map((item, i) => (
          <div key={i} className="flex items-center space-x-6 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all">
            <div className="text-3xl font-bold text-slate-200">0{i+1}</div>
            <img src={item.img} className="w-16 h-16 rounded-xl object-cover shadow" />
            <div className="flex-grow font-bold text-gray-800">{item.name}</div>
            <div className="text-blue-600 font-bold">{item.count}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#002B5B] rounded-[3rem] p-10 text-white">
        <Globe className="w-12 h-12 text-orange-500 mb-6" />
        <h3 className="text-3xl font-serif font-bold mb-4">Regional Insights</h3>
        <p className="text-gray-300 leading-relaxed">Domestic travel is booming with **1.7 Billion visits** in 2023. Tamil Nadu and Uttar Pradesh lead in foreign tourist arrivals due to spiritual and heritage significance.</p>
      </div>
    </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

export default function LandingPage() {
  const navigate = useNavigate();
  const [touristId, setTouristId] = useState('');
  const [password, setPassword] = useState('');
  const [showTouristPass, setShowTouristPass] = useState(false);
  const [showDeptPass, setShowDeptPass] = useState(false);
  const [error, setError] = useState('');
  const [selectedExp, setSelectedExp] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loginModal, setLoginModal] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [isTouristCaptchaVerified, setIsTouristCaptchaVerified] = useState(false);
  const [isDeptCaptchaVerified, setIsDeptCaptchaVerified] = useState(false);

  const heroImages = [
    "/images/namaste_new.jpg", "/images/slide10.jpg", "/images/slide11.jpg", "/images/slide12.jpg", "/images/slide13.jpg", "/images/slide5.jpg", "/images/slide6.jpg", "/images/slide7.jpg", "/images/slide8.jpg", "/images/slide9.jpg", "/images/somnath.png", "/images/kaziranga.png",
  ];

  useEffect(() => {
    if (activeTab === 'Home') {
      const timer = setInterval(() => paginate(1), 7000);
      return () => clearInterval(timer);
    }
  }, [heroIndex, activeTab]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setHeroIndex((prev) => (prev + newDirection + heroImages.length) % heroImages.length);
  };

  const handleTouristLogin = async (e) => {
    e.preventDefault();
    if (!isTouristCaptchaVerified) {
      setError('Please verify the captcha');
      return;
    }
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { username: touristId, password, type: 'TOURIST' }, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/tourist/dashboard');
    } catch (err) { 
      setError(err.response?.data?.error || 'Tourist Login failed. Please check your ID and Password.');
    }
  };

  const handleDeptLogin = async (e, type) => {
    e.preventDefault();
    if (!isDeptCaptchaVerified) {
      setError('Please verify the captcha');
      return;
    }
    setError('');
    const username = e.target.username.value;
    const pwd = e.target.password.value;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password: pwd, type }, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (type === 'AIRPORT') navigate('/airport/register');
      else if (type === 'POLICE' || type === 'ADMIN') navigate('/admin/dashboard');
    } catch (err) { 
      setError(err.response?.data?.error || `${type} Login failed. Use official email & password.`);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden relative">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'Home' ? (
        <>
          <section className="relative h-[90vh] overflow-hidden bg-black">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div key={heroIndex} custom={direction} initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: direction < 0 ? '100%' : '-100%', opacity: 0 }} transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }} className="absolute inset-0">
                <img src={heroImages[heroIndex]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
              </motion.div>
            </AnimatePresence>
            {heroIndex === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-10">
                <div className="text-white max-w-4xl">
                  <h2 className="text-3xl font-light tracking-widest uppercase mb-4 text-orange-400">Welcome to</h2>
                  <h1 className="text-8xl font-serif font-bold mb-2">SAARTH</h1>
                  <p className="text-xs font-black text-orange-400 uppercase tracking-[0.4em] mb-10">under the ministry of tourism</p>
                  <p className="text-2xl font-light mb-10 text-gray-200">Safe, Seamless, and Incredible Experiences for every traveler.</p>
                  <div className="flex space-x-6 justify-center">
                    <a href="#portals" className="px-10 py-4 bg-orange-600 text-white font-bold rounded-full uppercase tracking-widest shadow-xl">Access Portals</a>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => paginate(-1)} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 text-white"><ChevronLeft className="w-8 h-8" /></button>
            <button onClick={() => paginate(1)} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 text-white"><ChevronRight className="w-8 h-8" /></button>
          </section>

          <section id="portals" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border-2 border-slate-100">
                  <div className="absolute top-0 right-0 p-4 bg-orange-50 rounded-bl-3xl">
                    <UserCircle className="text-orange-500 w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold mb-8 text-gray-900">Tourist Access</h3>
                  {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold flex items-center"><AlertCircle className="mr-2 w-5 h-5" /> {error}</div>}
                  <form onSubmit={handleTouristLogin} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Registered Tourist ID</label>
                      <input type="text" value={touristId} onChange={(e) => setTouristId(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 outline-none text-gray-900 focus:border-orange-500 transition-all font-bold" placeholder="e.g. TID12345" />
                    </div>
                    <div className="relative">
                      <input 
                        type={showTouristPass ? "text" : "password"} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 outline-none text-gray-900 focus:border-orange-500 transition-all font-bold pr-16" 
                        placeholder="••••••••" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowTouristPass(!showTouristPass)}
                        className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showTouristPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    <Captcha onVerify={setIsTouristCaptchaVerified} />
                    
                    <button type="submit" disabled={!isTouristCaptchaVerified} className={`w-full bg-[#002B5B] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-orange-600 transition-all uppercase tracking-widest text-lg ${!isTouristCaptchaVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>Secure Sign In</button>
                  </form>
                  <div className="mt-8 pt-8 border-t text-center">
                    <p className="text-gray-400 text-sm mb-4">Don't have a Tourist ID?</p>
                    <button onClick={() => navigate('/register')} className="text-orange-600 font-black text-lg hover:underline">Register as Indian National →</button>
                  </div>
                </div>
                <div className="space-y-4">
                  {[ { title: 'Airport Authority', icon: Plane, type: 'AIRPORT' }, { title: 'Police & Security', icon: Shield, type: 'POLICE' }, { title: 'Ministry Admin', icon: Users, type: 'ADMIN' } ].map((item, i) => (
                    <div key={i} onClick={() => setLoginModal(item.type)} className="bg-white p-6 rounded-2xl shadow-md border flex items-center cursor-pointer hover:bg-slate-50 transition-all">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-xl mr-6"><item.icon className="w-8 h-8" /></div>
                      <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <Flipbook />
        </>
      ) : (
        <div className="min-h-screen">
          {activeTab === 'Ministry' && <MinistryView />}
          {activeTab === 'Places to Visit' && <PlacesToVisitView onSelectState={setSelectedState} />}
          {activeTab === 'Experiences' && <ExperiencesView />}
          {activeTab === 'Trade' && <TradeView />}
          {activeTab === 'Reports' && <ReportsView />}
          {activeTab === 'Contact Us' && <ContactUsView />}
          <div className="py-10 text-center"><button onClick={() => setActiveTab('Home')} className="px-10 py-4 bg-[#002B5B] text-white rounded-full font-bold uppercase tracking-widest shadow-xl">Back to Home</button></div>
        </div>
      )}

      <StateDetailModal state={selectedState} onClose={() => setSelectedState(null)} />
      
      {/* Bottom Rating Display */}
      <div className="bg-white border-t border-gray-100 py-10">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-4 md:mb-0">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Satisfaction</p>
               <div className="flex items-center mt-1 justify-center md:justify-start">
                  <span className="text-4xl font-black text-[#002B5B] mr-3">{localStorage.getItem('saarth_rating') || '4.8'}</span>
                  <div className="flex text-orange-400">
                     {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 fill-current" />
                     ))}
                  </div>
               </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Reviews</p>
               <p className="text-2xl font-black text-[#002B5B] mt-1">{localStorage.getItem('saarth_count') || '2534'}</p>
            </div>
         </div>
      </div>

      <Footer />

      {/* LOGIN MODAL */}
      <AnimatePresence>{loginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setLoginModal(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            <div className="bg-[#002B5B] p-10 text-white text-center relative">
              <h3 className="text-3xl font-serif font-bold uppercase tracking-widest">{loginModal} Portal</h3>
              <p className="text-blue-300 mt-2 font-bold opacity-70">Official Authorized Access Only</p>
              <button onClick={() => setLoginModal(null)} className="absolute top-8 right-8 bg-white/10 p-2 rounded-full hover:bg-red-500 transition-all"><X /></button>
            </div>
            <div className="p-10">
              {error && <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold flex items-center"><AlertCircle className="mr-2 w-5 h-5" /> {error}</div>}
              <form onSubmit={(e) => handleDeptLogin(e, loginModal)} className="space-y-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Government Email / Username</label>
                  <input name="username" type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 text-gray-900 font-bold outline-none focus:border-blue-500" required />
                </div>
                <div className="relative">
                  <input 
                    name="password" 
                    type={showDeptPass ? "text" : "password"} 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 text-gray-900 font-bold outline-none focus:border-blue-500 pr-16" 
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowDeptPass(!showDeptPass)}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showDeptPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl text-xs text-blue-700 font-bold leading-relaxed">
                  Tip: Use the official credentials provided by your department administrator.
                </div>
                
                <Captcha onVerify={setIsDeptCaptchaVerified} />
                
                <button type="submit" disabled={!isDeptCaptchaVerified} className={`w-full bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-[#002B5B] transition-all uppercase tracking-widest text-lg ${!isDeptCaptchaVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>Grant Access</button>
              </form>
            </div>
          </motion.div>
        </div>
      )}</AnimatePresence>

      {/* EXPERIENCE MODAL (REUSED) */}
      <AnimatePresence>{selectedExp && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-4xl p-8 rounded-3xl relative">
            <button onClick={() => setSelectedExp(null)} className="absolute top-6 right-6"><X /></button>
            <h2 className="text-3xl font-bold mb-8">{selectedExp.title}</h2>
            <div className="grid grid-cols-2 gap-8">{selectedExp.locations.map((loc, i) => (
              <div key={i}><img src={loc.img} className="w-full h-48 object-cover rounded-2xl" /><h4 className="font-bold mt-4">{loc.name}</h4><p>{loc.desc}</p></div>
            ))}</div>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </div>
  );
}
