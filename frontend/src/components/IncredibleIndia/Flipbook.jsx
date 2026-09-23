import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export default function Flipbook() {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    {
      title: "Somnath Temple, Gujarat",
      image: "/images/somnath.png",
      description: "One of the most sacred pilgrimage sites for Hindus, the Somnath temple is the first among the twelve Jyotirlinga shrines of Shiva."
    },
    {
      title: "Dawki River, Meghalaya",
      image: "/images/dawki.png",
      description: "Known for its crystal clear water, the Umngot river in Dawki is a hidden gem in the Northeast of India."
    },
    {
      title: "Kaziranga Wildlife",
      image: "/images/kaziranga.png",
      description: "Home to two-thirds of the world's great one-horned rhinoceroses, Kaziranga is a World Heritage Site."
    },
    {
      title: "Statue of Unity",
      image: "/images/statue_of_unity.png",
      description: "The world's tallest statue, standing at 182 meters, depicting Indian statesman and independence activist Sardar Vallabhbhai Patel."
    }
  ];

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <div className="w-full bg-[#f8f9fa] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <BookOpen className="mr-3 text-orange-500" />
              Tourism Flipbook
            </h2>
            <p className="text-gray-500 mt-2">Explore the beauty of India through our digital magazine</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={prevPage}
              className="p-3 bg-white border border-gray-200 rounded-full text-black hover:bg-orange-500 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft />
            </button>
            <button 
              onClick={nextPage}
              className="p-3 bg-white border border-gray-200 rounded-full text-black hover:bg-orange-500 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="relative h-[600px] perspective-1000 flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full flex bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-100 origin-center"
            >
              {/* Left Page (Image) */}
              <div className="w-1/2 h-full relative">
                <img 
                  src={pages[currentPage].image} 
                  alt={pages[currentPage].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              </div>

              {/* Right Page (Content) */}
              <div className="w-1/2 h-full p-12 flex flex-col justify-center bg-white border-l border-gray-100 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-orange-50/20 to-transparent pointer-events-none"></div>
                <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-4">Discovery</span>
                <h3 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                  {pages[currentPage].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {pages[currentPage].description}
                </p>
                <button className="px-8 py-3 bg-[#002B5B] text-white rounded-md hover:bg-orange-600 transition-all w-fit shadow-lg">
                  Explore More
                </button>
                <div className="mt-12 text-gray-300 text-sm font-mono italic">
                  Page {currentPage + 1} of {pages.length}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center mt-12 space-x-4">
          {pages.map((page, idx) => (
            <div 
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-24 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${currentPage === idx ? 'border-orange-500 scale-110 shadow-lg' : 'border-transparent grayscale opacity-60'}`}
            >
              <img src={page.image} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
