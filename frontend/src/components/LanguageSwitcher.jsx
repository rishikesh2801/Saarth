import React, { useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'zh-CN', name: '中文 (Chinese)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'ar', name: 'العربية (Arabic)' }
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode) => {
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    } else {
      // Sometimes it takes a moment for the widget to inject
      setTimeout(() => {
        const retryElement = document.querySelector('.goog-te-combo');
        if (retryElement) {
           retryElement.value = langCode;
           retryElement.dispatchEvent(new Event('change'));
        }
      }, 500);
    }
    setIsOpen(false);
  };

  return (
    <div className="absolute top-6 right-6 z-[9999]">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-white/90 backdrop-blur-md border border-gray-200 px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all text-gray-800 font-bold"
        >
          <Globe className="w-5 h-5 text-blue-600" />
          <span className="text-sm uppercase tracking-widest">Translate</span>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-3 right-0 w-72 bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="p-5 bg-gray-50 border-b border-gray-100 sticky top-0 z-10 flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Language</p>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-800">✕</button>
            </div>
            <div className="p-2 grid grid-cols-1 gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="text-left px-4 py-3 rounded-2xl hover:bg-blue-50 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
