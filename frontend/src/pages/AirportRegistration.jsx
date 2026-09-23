import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, FileSignature, MapPin, Phone, Mail, User, ArrowLeft, Copy, CheckCircle, LogIn, PlaneTakeoff, PlaneLanding, Globe, ChevronDown, Check } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import Captcha from '../components/Captcha';
import toast from 'react-hot-toast';

const COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
  { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'Russia', code: '+7', flag: '🇷🇺' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
];

const STATE_DATA = [
  { name: "Andhra Pradesh", code: "AP", districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Anantapur", "Chittoor", "Kadapa", "Kakinada", "Eluru"], airports: ["VTZ", "VGA"] },
  { name: "Arunachal Pradesh", code: "AR", districts: ["Itanagar", "Tawang", "Ziro", "Pasighat", "Along"], airports: ["IXI"] },
  { name: "Assam", code: "AS", districts: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon", "Tinsukia"], airports: ["GAU", "DIB"] },
  { name: "Bihar", code: "BR", districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Nalanda", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Munger"], airports: ["PAT", "GAY"] },
  { name: "Chhattisgarh", code: "CG", districts: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"], airports: ["RPR"] },
  { name: "Goa", code: "GA", districts: ["North Goa", "South Goa"], airports: ["GOI", "GOX"] },
  { name: "Gujarat", code: "GJ", districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Gandhidham"], airports: ["AMD", "BDQ"] },
  { name: "Haryana", code: "HR", districts: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak"], airports: [] },
  { name: "Himachal Pradesh", code: "HP", districts: ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi"], airports: ["DHM"] },
  { name: "Jharkhand", code: "JH", districts: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"], airports: ["IXR"] },
  { name: "Karnataka", code: "KA", districts: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Kalaburagi", "Ballari", "Vijayapura"], airports: ["BLR", "IXE"] },
  { name: "Kerala", code: "KL", districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha"], airports: ["TRV", "COK", "CCJ"] },
  { name: "Madhya Pradesh", code: "MP", districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Ratlam", "Rewa"], airports: ["BHO", "IDR"] },
  { name: "Maharashtra", code: "MH", districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai", "Kolhapur", "Akola"], airports: ["BOM", "PNQ", "NAG"] },
  { name: "Manipur", code: "MN", districts: ["Imphal"], airports: ["IMF"] },
  { name: "Meghalaya", code: "ML", districts: ["Shillong", "Tura"], airports: ["SHL"] },
  { name: "Mizoram", code: "MZ", districts: ["Aizawl"], airports: ["AJL"] },
  { name: "Nagaland", code: "NL", districts: ["Kohima", "Dimapur"], airports: ["DMU"] },
  { name: "Odisha", code: "OR", districts: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"], airports: ["BBI"] },
  { name: "Punjab", code: "PB", districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"], airports: ["ATQ"] },
  { name: "Rajasthan", code: "RJ", districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Pali"], airports: ["JAI", "JDH", "UDR"] },
  { name: "Sikkim", code: "SK", districts: ["Gangtok"], airports: ["PYG"] },
  { name: "Tamil Nadu", code: "TN", districts: ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tiruppur", "Erode", "Vellore"], airports: ["MAA", "CJB", "IXM", "TRZ"] },
  { name: "Telangana", code: "TG", districts: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"], airports: ["HYD"] },
  { name: "Tripura", code: "TR", districts: ["Agartala"], airports: ["IXA"] },
  { name: "Uttar Pradesh", code: "UP", districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Noida", "Ghaziabad", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Jhansi"], airports: ["LKO", "VNS"] },
  { name: "Uttarakhand", code: "UK", districts: ["Dehradun", "Haridwar", "Haldwani", "Roorkee"], airports: ["DED"] },
  { name: "West Bengal", code: "WB", districts: ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah", "Darjeeling"], airports: ["CCU", "IXB"] },
  { name: "Andaman and Nicobar", code: "AN", districts: ["Port Blair"], airports: ["IXZ"] },
  { name: "Delhi", code: "DL", districts: ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"], airports: ["DEL"] },
  { name: "Jammu and Kashmir", code: "JK", districts: ["Srinagar", "Jammu", "Anantnag", "Baramulla"], airports: ["SXR", "IXJ"] },
  { name: "Ladakh", code: "LA", districts: ["Leh", "Kargil"], airports: ["IXL"] }
];

export default function AirportRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', passport: '', phoneCode: '+1', phone: '', email: '', travelDetails: '', originCountry: '', originState: '', destinationState: '', destinationDistrict: '', visaDuration: 30
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('airport_history') || '[]');
  });

  const [isStateFixed, setIsStateFixed] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      if (u && u.role === 'AIRPORT' && u.state) {
        setFormData(prev => ({
          ...prev,
          destinationState: u.state
        }));
        setIsStateFixed(true);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }, []);

  const selectedCountry = COUNTRIES.find(c => c.code === formData.phoneCode) || COUNTRIES[0];

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter email first');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/auth/send-otp`, { email: formData.email });
      setIsOtpSent(true);
      toast.success('OTP sent to email');
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      toast.error('Please verify the captcha');
      return;
    }
    setLoading(true);
    const u = JSON.parse(localStorage.getItem('user'));
    const payload = {
      ...formData,
      aadhaar: `PASSPORT-${formData.passport}`,
      phone: `${formData.phoneCode} ${formData.phone}`,
      origin: `${formData.originState}, ${formData.originCountry}`,
      destination: `${formData.destinationDistrict}, ${formData.destinationState}`,
      state: formData.destinationState,
      district: formData.destinationDistrict,
      visaDuration: formData.visaDuration,
      createdBy: 'AIRPORT_AUTHORITY',
      otp
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register-tourist`, payload);
      setResult(res.data);
      toast.success('Identity Grid Created Successfully!');
      
      // Update History
      const newHistory = [{
        name: formData.name,
        passport: formData.passport,
        id: res.data.touristId,
        date: new Date().toISOString()
      }, ...history];
      setHistory(newHistory);
      localStorage.setItem('airport_history', JSON.stringify(newHistory));
    } catch (err) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(result.touristId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyPass = () => {
    navigator.clipboard.writeText(result.password);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 py-12 px-4 relative overflow-hidden flex items-center justify-center font-sans">
      <div className="absolute top-0 left-0 w-full h-[450px] bg-[#002B5B] z-0"></div>
      
      <div className="z-10 w-full max-w-5xl">
        <Link to="/admin/dashboard" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-all group bg-white/10 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10 font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Authority Grid
        </Link>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-12 md:p-20 rounded-[3.5rem] text-center shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
              
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
              >
                <ShieldCheck className="w-14 h-14 text-orange-500" />
              </motion.div>
              
              <h2 className="text-5xl font-black text-[#002B5B] mb-2 tracking-tighter uppercase leading-none">Entry Authorized</h2>
              <p className="text-gray-500 mb-12 text-lg font-medium">International Identity generated for {result.name}.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 relative group hover:border-orange-200 transition-all shadow-sm">
                  <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-[0.2em] font-black">Digital Grid ID</p>
                  <p className="text-4xl font-mono font-black text-[#002B5B] tracking-wider">{result.touristId}</p>
                  <button onClick={copyId} className="absolute top-8 right-8 p-3 bg-white rounded-2xl shadow-sm hover:text-orange-500 transition-colors">
                    {copiedId ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
                
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 relative group hover:border-orange-200 transition-all shadow-sm">
                  <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-[0.2em] font-black">Secure Access Key</p>
                  <p className="text-4xl font-mono font-black text-orange-500 tracking-wider">{result.password}</p>
                  <button onClick={copyPass} className="absolute top-8 right-8 p-3 bg-white rounded-2xl shadow-sm hover:text-orange-500 transition-colors">
                    {copiedPass ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 text-blue-700 p-6 rounded-[2rem] text-sm text-left flex items-start mb-12">
                <div className="bg-blue-600 p-2 rounded-lg mr-4 mt-1"><Check className="w-4 h-4 text-white" /></div>
                <div>
                  <p className="font-black uppercase tracking-widest text-[10px] mb-1">Instruction Protocol</p>
                  <p className="font-medium">Hand these credentials to the tourist. Ensure they activate tracking upon exiting the terminal area.</p>
                </div>
              </div>

              <button 
                onClick={() => setResult(null)} 
                className="px-12 py-5 bg-[#002B5B] hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-sm"
              >
                Register Next Arrival
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl border border-gray-100 relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>

              <div className="flex items-center mb-12 border-b border-gray-50 pb-10">
                <div className="bg-orange-50 p-6 rounded-[2rem] mr-8 shadow-sm border border-orange-100">
                  <Globe className="w-10 h-10 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-[#002B5B] uppercase leading-none">Arrival Terminal</h1>
                  <p className="text-gray-400 mt-2 font-black uppercase tracking-widest text-[10px]">Airport Authority of India • Secure Identity Grid</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* Personal Info */}
                <div>
                  <h3 className="text-[#002B5B] font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center bg-gray-50 px-6 py-2 rounded-full w-fit"><User className="w-4 h-4 mr-3 text-orange-500"/> Personal Identifiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Full Legal Name</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium"
                        
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Passport Number</label>
                      <input type="text" required value={formData.passport} onChange={e => setFormData({...formData, passport: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-black uppercase tracking-widest"
                        
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-[#002B5B] font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center bg-gray-50 px-6 py-2 rounded-full w-fit"><Phone className="w-4 h-4 mr-3 text-orange-500"/> Contact Channel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2 relative">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">International Phone</label>
                      <div className="flex relative">
                        <button 
                          type="button" 
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="bg-white border border-gray-200 rounded-l-2xl px-5 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 outline-none flex items-center justify-between min-w-[120px] hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <span className="mr-2 font-bold">{selectedCountry.flag} {selectedCountry.code}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        
                        {showDropdown && (
                          <div className="absolute top-[110%] left-0 w-72 max-h-72 overflow-y-auto bg-white border border-gray-100 rounded-3xl shadow-2xl z-[100] custom-scrollbar p-2">
                            {COUNTRIES.map(c => (
                              <div 
                                key={c.name}
                                onClick={() => { setFormData({...formData, phoneCode: c.code}); setShowDropdown(false); }}
                                className="px-5 py-4 hover:bg-orange-50 cursor-pointer flex items-center transition-all rounded-2xl group"
                              >
                                <span className="text-2xl mr-4">{c.flag}</span>
                                <span className="font-black text-[#002B5B] w-14 text-sm group-hover:text-orange-600 transition-colors">{c.code}</span>
                                <span className="text-xs text-gray-500 font-bold truncate">{c.name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 border-l-0 rounded-r-2xl px-6 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium"
                          
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Verified Email</label>
                      <div className="flex space-x-2">
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium"
                          
                        />
                        <button 
                          type="button" 
                          onClick={handleSendOtp}
                          disabled={isOtpSent || !formData.email}
                          className={`px-6 py-5 bg-[#002B5B] text-white font-bold rounded-2xl hover:bg-orange-600 transition-all uppercase tracking-widest text-xs ${isOtpSent || !formData.email ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isOtpSent ? 'Sent' : 'Send OTP'}
                        </button>
                      </div>
                    </div>
                    
                    {isOtpSent && (
                      <div className="space-y-2 mt-4">
                        <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Enter OTP</label>
                        <input type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-black text-center tracking-widest text-lg"
                          
                          maxLength={6}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Routing */}
                <div>
                  <h3 className="text-[#002B5B] font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center bg-gray-50 px-6 py-2 rounded-full w-fit"><PlaneLanding className="w-4 h-4 mr-3 text-orange-500"/> Visa Routing & Validity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Origin Country</label>
                      <input type="text" required value={formData.originCountry} onChange={e => setFormData({...formData, originCountry: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium"
                        
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Origin City</label>
                      <input type="text" required value={formData.originState} onChange={e => setFormData({...formData, originState: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium"
                        
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Destination State</label>
                      <select 
                        required 
                        value={formData.destinationState} 
                        onChange={e => setFormData({...formData, destinationState: e.target.value, destinationDistrict: ''})}
                        className={`w-full border rounded-2xl px-6 py-5 text-[#002B5B] focus:ring-4 focus:ring-orange-500 outline-none transition-all font-black uppercase tracking-wider text-sm shadow-inner ${isStateFixed ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'bg-orange-50 border-orange-200'}`}
                        disabled={isStateFixed}
                      >
                        <option value="">Select State</option>
                        {STATE_DATA.map(s => (
                          <option key={s.code} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Destination District</label>
                      <select 
                        required 
                        value={formData.destinationDistrict} 
                        onChange={e => setFormData({...formData, destinationDistrict: e.target.value})}
                        className="w-full bg-orange-50 border border-orange-200 rounded-2xl px-6 py-5 text-[#002B5B] focus:ring-4 focus:ring-orange-500 outline-none transition-all font-black uppercase tracking-wider text-sm shadow-inner"
                        disabled={!formData.destinationState}
                      >
                        <option value="">Select District</option>
                        {formData.destinationState && (STATE_DATA.find(s => s.name === formData.destinationState)?.districts || []).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-orange-500 uppercase tracking-widest font-black ml-1">Visa Duration (Days)</label>
                      <input type="number" required value={formData.visaDuration || 30} onChange={e => setFormData({...formData, visaDuration: parseInt(e.target.value)})}
                        className="w-full bg-white border border-orange-500/30 rounded-2xl px-6 py-5 text-orange-600 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all font-black text-center"
                        
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-6 border-t border-gray-50">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Authority Entry Notes</label>
                  <textarea required rows="4" value={formData.travelDetails} onChange={e => setFormData({...formData, travelDetails: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[2.5rem] px-8 py-6 text-gray-800 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium resize-none shadow-inner"
                    
                  ></textarea>
                </div>

                <div className="mt-6">
                  <Captcha onVerify={setIsCaptchaVerified} />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading || !isCaptchaVerified}
                  className={`w-full mt-12 bg-[#002B5B] hover:bg-orange-600 text-white font-black uppercase tracking-[0.2em] py-6 rounded-3xl shadow-2xl shadow-blue-900/10 transition-all flex justify-center items-center text-lg ${(loading || !isCaptchaVerified) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4"></div> Encrypting Identity...</>
                  ) : (
                    <><FileSignature className="w-7 h-7 mr-4" /> Authorize Entry & Issue ID</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Registrations History */}
        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl shadow-blue-900/5 w-full max-w-4xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[#002B5B] uppercase tracking-tighter flex items-center">
                <FileSignature className="w-6 h-6 text-orange-500 mr-2" /> Recent Registrations
              </h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{history.length} Records</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tourist Name</th>
                    <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Passport</th>
                    <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Generated ID</th>
                    <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-gray-900">{item.name}</td>
                      <td className="py-4 text-sm text-gray-600 font-mono">{item.passport}</td>
                      <td className="py-4 text-sm text-orange-600 font-black font-mono">{item.id}</td>
                      <td className="py-4 text-xs text-gray-500 font-bold">{new Date(item.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
