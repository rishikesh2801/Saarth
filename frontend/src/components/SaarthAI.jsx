import React, { useState } from 'react';
import { MessageCircle, Send, X, Bot, Globe, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SaarthAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('LANG'); // LANG, CHAT
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const appKnowledge = {
    airport: "The Airport Portal is where authorities register international tourists using their passport, verify their details, and set their visa duration.",
    tourist: "The Tourist Dashboard allows tourists to plan their trips, view local weather, track their safety score, and use the SOS button in case of emergencies.",
    police: "The Police Dashboard helps authorities monitor incoming tourists, track active visitors in their district, issue fines for violations, and handle SOS alerts.",
    sos: "The SOS feature sends an immediate alert to the local district police with the tourist's live location and the reason for the emergency.",
    fine: "Police can issue fines for suspicious or off-route activities. Tourists can view their fines in their dashboard, and police can mark them as paid.",
    language: "You can change the website language using the Translate button at the top right of the screen.",
    hospital: "You can find nearby hospitals in your current district directly from the Tourist Dashboard using the Emergency Hospital feature.",
    registration: "National tourists can register using their Aadhaar, while International tourists use their Passport. We use dependent dropdowns for states and districts to ensure accurate location tracking."
  };

  const handleLanguageSelect = (langCode) => {
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    }

    setMessages([
      { sender: 'bot', text: `Language updated. How can I help you today with the Tourist Guard system?` }
    ]);
    setStep('CHAT');
  };

  const handleTopicSelect = (topicKey) => {
    const response = appKnowledge[topicKey];
    setMessages([...messages, 
      { sender: 'user', text: `Tell me about ${topicKey}` },
      { sender: 'bot', text: response }
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate bot response based on knowledge
    setTimeout(() => {
      let response = "I'm sorry, I didn't quite understand that. You can ask me about the Airport Portal, Tourist Dashboard, Police Dashboard, SOS, Fines, Hospitals, or Registration!";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('airport')) response = appKnowledge.airport;
      else if (lowerInput.includes('tourist')) response = appKnowledge.tourist;
      else if (lowerInput.includes('police') || lowerInput.includes('admin')) response = appKnowledge.police;
      else if (lowerInput.includes('sos') || lowerInput.includes('emergency')) response = appKnowledge.sos;
      else if (lowerInput.includes('fine') || lowerInput.includes('penalty')) response = appKnowledge.fine;
      else if (lowerInput.includes('language') || lowerInput.includes('translate')) response = appKnowledge.language;
      else if (lowerInput.includes('hospital') || lowerInput.includes('medical')) response = appKnowledge.hospital;
      else if (lowerInput.includes('register') || lowerInput.includes('dropdown') || lowerInput.includes('state') || lowerInput.includes('district')) response = appKnowledge.registration;

      setMessages([...newMessages, { sender: 'bot', text: response }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chatbot Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#002B5B] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all overflow-hidden border-2 border-white"
      >
        {/* User requested to use their image. Instructing to put it in public/saarth_ai.png */}
        <img 
          src="/saarth_ai.png" 
          alt="Saarth AI" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image not found
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div class="text-white text-xs font-black">SAARTH</div>';
          }}
        />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-96 bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#002B5B] p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {step === 'CHAT' && (
                  <button onClick={() => setStep('LANG')} className="text-white/70 hover:text-white mr-1" title="Back to Language Selection">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">SAARTHiiii</h3>
                  <p className="text-[10px] text-blue-200 font-bold uppercase">Online Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gray-50 custom-scrollbar">
              {step === 'LANG' ? (
                <div className="text-center space-y-4 py-4">
                  <Globe className="w-10 h-10 text-blue-500 mx-auto" />
                  <p className="text-sm font-bold text-black">Please select your preferred language / भाषा चुनिए</p>
                  <select 
                    onChange={(e) => handleLanguageSelect(e.target.value)}
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-black font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Language</option>
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="ur">اردो (Urdu)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="or">ଓଡ଼ିଆ (Odia)</option>
                    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                    <option value="ml">മലയാളം (Malayalam)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                    <option value="de">Deutsch (German)</option>
                    <option value="zh-CN">中文 (Chinese)</option>
                    <option value="ja">日本語 (Japanese)</option>
                    <option value="ru">Русский (Russian)</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                </div>
              ) : (
                <>
                  {/* Quick Help Topics */}
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Quick Help Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(appKnowledge).map((key) => (
                        <button 
                          key={key} 
                          onClick={() => handleTopicSelect(key)}
                          className="bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 px-3 py-1.5 rounded-lg text-xs text-black font-bold capitalize transition-colors"
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input */}
            {step === 'CHAT' && (
              <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Ask me anything about the portal..." 
                  className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaarthAI;
