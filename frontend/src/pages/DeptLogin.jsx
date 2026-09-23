import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, Shield, UserCircle, KeyRound, ArrowLeft, LogIn, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import Captcha from '../components/Captcha';

export default function DeptLogin({ type }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const isAirport = type === 'AIRPORT';
  const title = isAirport ? 'Airport Authority Portal' : 'Police Department Portal';
  const Icon = isAirport ? Plane : Shield;
  const primaryColor = isAirport ? '#002B5B' : '#8B0000'; // Dark blue for airport, dark red for police

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      setError('Please verify the captcha');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password,
        type
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] text-gray-800 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#002B5B] z-0"></div>
      
      <div className="absolute top-6 left-8 z-50 group cursor-pointer rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 bg-white/5 backdrop-blur-sm p-3 transition-all duration-500 hover:border-orange-500/50 flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img src="/images/saarth_logo.jpg?v=3" alt="SAARTH" className="h-24 object-contain rounded-2xl hover:scale-105 transition-all duration-500 relative z-10" />
        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-2 relative z-10">Under Ministry of Tourism</p>
      </div>
      <div className="absolute top-0 right-0 p-8 z-10 hidden md:block opacity-30">
        <div className="flex flex-col items-center">
          <img src="/images/saarth_logo.jpg?v=3" alt="SAARTH" className="h-12 object-contain rounded-lg" />
          <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mt-1">Under Ministry of Tourism</p>
        </div>
      </div>

      <div className="z-10 w-full max-w-md p-6">
        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Tourism Portal
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[2rem] shadow-2xl relative border border-gray-100"
        >
          <div className="text-center mb-10">
            <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Icon className="w-12 h-12" style={{ color: primaryColor }} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
            <p className="text-gray-500 mt-3 text-sm font-medium">
              Official Government Access Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Official Email ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-12 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Captcha onVerify={setIsCaptchaVerified} />

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center mt-6 transition-all ${!isCaptchaVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: primaryColor }}
              disabled={!isCaptchaVerified}
            >
              <LogIn className="w-5 h-5 mr-3" />
              Authorize & Enter
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-center space-x-4">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter text-center">
               National Tourism Security Protocol<br/>SAARTH Initiative
             </p>
          </div>
        </motion.div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 text-gray-400 text-xs font-medium z-10">
        © 2026 Indian Tourism Guard System. All rights reserved.
      </div>
    </div>
  );
}
