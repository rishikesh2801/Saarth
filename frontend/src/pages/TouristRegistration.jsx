import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, Fingerprint, MapPin, Phone, Mail, User, ArrowLeft, Copy, CheckCircle, LogIn, PlaneTakeoff, PlaneLanding, Building2, Globe } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import Captcha from '../components/Captcha';
import toast from 'react-hot-toast';
import { indiaStatesDistricts } from '../data/indiaStatesDistricts';

export default function TouristRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', aadhaar: '', phone: '', email: '', travelDetails: '', 
    currentState: '', currentDistrict: '', 
    destinationState: '', destinationDistrict: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

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
    if (!isOtpSent) {
      toast.error('Please send and verify OTP first');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register-tourist`, { ...formData, otp });
      setResult(res.data);
      toast.success('Identity Grid Created Successfully!');
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

  const handleAutoLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username: result.touristId,
        password: result.password,
        type: 'TOURIST'
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/tourist/dashboard');
    } catch (err) {
      alert('Auto-login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-gray-800 py-12 px-4 relative overflow-hidden flex items-center justify-center font-sans">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[#002B5B] z-0"></div>
      <div className="absolute top-8 right-12 hidden lg:block opacity-20">
        <div className="flex flex-col items-center">
          <img src="/images/saarth_logo.jpg?v=3" alt="SAARTH" className="h-16 object-contain rounded-xl" />
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-2">Under the Ministry of Tourism</p>
        </div>
      </div>
      
      <div className="absolute top-6 left-8 z-50 group cursor-pointer rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 bg-white/5 backdrop-blur-sm p-3 transition-all duration-500 hover:border-orange-500/50 flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img src="/images/saarth_logo.jpg?v=3" alt="SAARTH" className="h-24 object-contain rounded-2xl hover:scale-105 transition-all duration-500 relative z-10" />
        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-2 relative z-10">Under Ministry of Tourism</p>
      </div>

      <div className="z-10 w-full max-w-4xl mt-36">
        <Link to="/" className="inline-flex items-center text-white font-black uppercase text-[10px] tracking-widest hover:text-white mb-8 transition-all group bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10 hover:border-white/20 shadow-lg backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform text-orange-500" /> Back to Tourism Portal
        </Link>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-10 md:p-16 rounded-[3rem] text-center shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
              
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
              >
                <ShieldCheck className="w-14 h-14 text-orange-500" />
              </motion.div>
              
              <h2 className="text-4xl font-black text-[#002B5B] mb-2 tracking-tight">Identity Secured!</h2>
              <p className="text-gray-500 mb-12 text-lg font-medium">Welcome to India, {result.name}. Your digital tourist ID is ready.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* ID Card */}
                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative group hover:border-orange-200 transition-all shadow-sm">
                  <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-[0.2em] font-black">Digital Tourist ID</p>
                  <p className="text-3xl font-mono font-black text-[#002B5B] tracking-tighter">{result.touristId}</p>
                  <button onClick={copyId} className="absolute top-6 right-6 p-2 bg-white rounded-xl shadow-sm hover:text-orange-500 transition-colors">
                    {copiedId ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Pass Card */}
                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative group hover:border-orange-200 transition-all shadow-sm">
                  <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-[0.2em] font-black">System Password</p>
                  <p className="text-3xl font-mono font-black text-orange-500 tracking-tighter">{result.password}</p>
                  <button onClick={copyPass} className="absolute top-6 right-6 p-2 bg-white rounded-xl shadow-sm hover:text-orange-500 transition-colors">
                    {copiedPass ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleAutoLogin}
                className="w-full md:w-auto mx-auto px-12 py-5 bg-[#002B5B] hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl transition-all flex justify-center items-center text-lg uppercase tracking-widest"
              >
                <LogIn className="w-6 h-6 mr-3" />
                Enter Dashboard
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-100 relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>

              <div className="flex items-center mb-12">
                <div className="bg-orange-50 p-5 rounded-[1.5rem] mr-6 shadow-sm border border-orange-100">
                  <UserPlus className="w-10 h-10 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-[#002B5B] tracking-tight leading-none uppercase">Tourist Registration</h1>
                  <p className="text-gray-400 mt-2 font-medium tracking-wide">Government of India Digital Identity Grid</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute top-4 left-5 w-5 h-5 text-gray-300" />
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium"
                        
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Aadhaar / ID Card Number</label>
                    <div className="relative">
                      <Fingerprint className="absolute top-4 left-5 w-5 h-5 text-gray-300" />
                      <input type="text" required pattern="\d{12}" value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium"
                        
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute top-4 left-5 w-5 h-5 text-gray-300" />
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium"
                        
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Email Address</label>
                    <div className="relative flex space-x-2">
                      <div className="relative flex-1">
                        <Mail className="absolute top-4 left-5 w-5 h-5 text-gray-300" />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium"
                          
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleSendOtp}
                        className="bg-[#002B5B] hover:bg-orange-600 text-white font-black text-xs uppercase px-4 rounded-2xl transition-all"
                      >
                        {isOtpSent ? 'Resend' : 'Send'}
                      </button>
                    </div>
                  </div>

                  {isOtpSent && (
                    <div className="space-y-2">
                      <label className="text-[10px] text-orange-500 uppercase tracking-[0.2em] font-black ml-1">Enter OTP</label>
                      <input type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                        className="w-full bg-white border border-orange-500 rounded-2xl px-6 py-4 text-orange-600 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-black text-center text-lg tracking-widest"
                        
                        maxLength="6"
                      />
                    </div>
                  )}

                  {/* Travel Routing */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Current State</label>
                    <div className="relative">
                      <Globe className="absolute top-4 left-5 w-5 h-5 text-gray-300" />
                      <select required value={formData.currentState} onChange={e => setFormData({...formData, currentState: e.target.value, currentDistrict: ''})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium appearance-none"
                      >
                        <option value="">Select State</option>
                        {indiaStatesDistricts.states.map((s, idx) => (
                          <option key={idx} value={s.state}>{s.state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Current District</label>
                    <div className="relative">
                      <MapPin className="absolute top-4 left-5 w-5 h-5 text-gray-300" />
                      <select required value={formData.currentDistrict} onChange={e => setFormData({...formData, currentDistrict: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium appearance-none"
                        disabled={!formData.currentState}
                      >
                        <option value="">Select District</option>
                        {indiaStatesDistricts.states.find(s => s.state === formData.currentState)?.districts.map((d, idx) => (
                          <option key={idx} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Destination State</label>
                    <div className="relative">
                      <PlaneTakeoff className="absolute top-4 left-5 w-5 h-5 text-gray-300" />
                      <select required value={formData.destinationState} onChange={e => setFormData({...formData, destinationState: e.target.value, destinationDistrict: ''})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium appearance-none"
                      >
                        <option value="">Select State</option>
                        {indiaStatesDistricts.states.map((s, idx) => (
                          <option key={idx} value={s.state}>{s.state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Destination District</label>
                    <div className="relative">
                      <PlaneLanding className="absolute top-4 left-5 w-5 h-5 text-gray-300" />
                      <select required value={formData.destinationDistrict} onChange={e => setFormData({...formData, destinationDistrict: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-14 pr-4 py-4 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium appearance-none"
                        disabled={!formData.destinationState}
                      >
                        <option value="">Select District</option>
                        {indiaStatesDistricts.states.find(s => s.state === formData.destinationState)?.districts.map((d, idx) => (
                          <option key={idx} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black ml-1">Planned Itinerary / Places to Visit</label>
                  <div className="relative">
                    <MapPin className="absolute top-5 left-5 w-5 h-5 text-gray-300" />
                    <textarea required rows="4" value={formData.travelDetails} onChange={e => setFormData({...formData, travelDetails: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] pl-14 pr-6 py-5 text-gray-800 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium resize-none shadow-inner"
                      placeholder="List the cities and monuments you plan to visit in India..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                   <Building2 className="w-5 h-5 text-blue-600" />
                   <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Your data will be securely synced with the National Tourist Database.</p>
                </div>

                <div className="mt-6">
                  <Captcha onVerify={setIsCaptchaVerified} />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading || !isCaptchaVerified}
                  className={`w-full mt-10 bg-[#002B5B] hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center text-lg uppercase tracking-widest ${(loading || !isCaptchaVerified) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-4"></div> Encrypting Data...</>
                  ) : (
                    <><ShieldCheck className="w-6 h-6 mr-3" /> Issue My Digital Tourist ID</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50">
        <img src="/images/saarth_logo.jpg?v=3" alt="SAARTH" className="h-24 object-contain rounded-lg mb-2" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#002B5B]">Under the Ministry of Tourism</span>
      </div>
    </div>
  );
}
