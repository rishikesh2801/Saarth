import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Captcha({ onVerify }) {
  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);

  const generateText = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; // Removed similar looking chars
    let text = '';
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Premium gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(15, 23, 42, ${Math.random() * 0.15})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // Noise dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(15, 23, 42, ${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Text
    ctx.font = 'bold 28px monospace'; // Using monospace for captcha
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < text.length; i++) {
      const x = 25 + i * 25;
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      
      // Color variation for each character
      const colors = ['#0f172a', '#1e293b', '#334155', '#475569'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };

  const refresh = () => {
    const text = generateText();
    setCaptchaText(text);
    setUserInput('');
    setIsValid(false);
    onVerify(false);
    setTimeout(() => drawCaptcha(text), 0); // Ensure canvas is ready
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setUserInput(val);
    const valid = val === captchaText;
    setIsValid(valid);
    onVerify(valid);
  };

  return (
    <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-gray-400 uppercase tracking-widest font-black ml-1">Human Verification</label>
        {isValid && (
          <span className="text-green-500 text-xs font-bold flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1" /> Verified
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            width={160} 
            height={50} 
            className="rounded-xl border border-gray-200 shadow-sm"
          />
          <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-black/5"></div>
        </div>
        
        <motion.button 
          type="button" 
          onClick={refresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          title="Refresh Captcha"
        >
          <RefreshCw className="w-5 h-5 text-gray-500 hover:text-orange-500 transition-colors" />
        </motion.button>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Type the characters above"
          className={`w-full bg-white border ${isValid ? 'border-green-500 focus:ring-green-500/20' : 'border-gray-200 focus:ring-orange-500/20'} rounded-xl px-5 py-3 text-gray-800 focus:ring-4 focus:border-orange-500 outline-none transition-all font-medium text-sm`}
          maxLength={5}
        />
      </div>
    </div>
  );
}
