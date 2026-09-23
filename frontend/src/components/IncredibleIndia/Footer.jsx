import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    {
      title: 'The Ministry',
      links: ['About Us', 'Who\'s Who', 'Organisational Chart', 'Our Functions', 'Divisions', 'Vacancies']
    },
    {
      title: 'Quick Links',
      links: ['Incredible India', 'NIDHI 2.0', 'SAATHI', 'IITFC', 'Swadesh Darshan', 'PRASHAD']
    },
    {
      title: 'Policies',
      links: ['National Tourism Policy', 'Visa Policy', 'Investment Policy', 'Sustainable Tourism', 'Niche Tourism']
    },
    {
      title: 'Resources',
      links: ['Reports & Publications', 'Tourist Statistics', 'Market Research', 'Tenders', 'RTI', 'E-Citizen']
    }
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 pb-2 border-b border-white/10">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Social Bar */}
        <div className="border-t border-white/10 pt-12 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-400">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Transport Bhawan, Sansad Marg, New Delhi</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Phone className="w-5 h-5 text-green-500" />
              <span className="text-sm">+91-11-23711252</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Mail className="w-5 h-5 text-red-500" />
              <span className="text-sm">saarthindia5@gmail.com</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-400">Follow Us</h4>
            <div className="flex space-x-6">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <div key={i} className="p-3 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end justify-center">
            <div className="flex flex-col items-center">
              <img 
                src="/images/saarth_logo.jpg?v=3" 
                alt="SAARTH" 
                className="h-28 object-contain rounded-xl mb-2"
              />
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1">Under the Ministry of Tourism</p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
          <p>© 2026 Saarth under the Ministry of Tourism, Government of India. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Copyright Policy</a>
            <a href="#" className="hover:text-white">Hyperlinking Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
