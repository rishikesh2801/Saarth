import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Plane, Activity, AlertTriangle, Users, FileText, Search, LogOut, FilePlus, MapPin, Map, UserX, AlertCircle, CheckCircle, Navigation, Copy, User, CloudRain, Wind, ShieldAlert, ArrowRight, Database } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh"
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tourists, setTourists] = useState([]);
  const [incomingTourists, setIncomingTourists] = useState([]);
  const [stats, setStats] = useState({ total: 0, sosCount: 0 });
  const [loading, setLoading] = useState(true);
  
  // Police Modals/Search States
  const [searchLoc, setSearchLoc] = useState('');
  const [searchId, setSearchId] = useState('');
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [navTourist, setNavTourist] = useState(null);
  const [firModal, setFirModal] = useState(false);
  const [fineModal, setFineModal] = useState(false);
  const [firDetails, setFirDetails] = useState('');
  const [fineAmount, setFineAmount] = useState('');

  // Emergency Modal & Navigation
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [mapPopupUrl, setMapPopupUrl] = useState(null);

  // State Filtering
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [fetchedDistricts, setFetchedDistricts] = useState([]);
  
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedState === 'All India') {
        setFetchedDistricts([]);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/districts?state=${selectedState}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFetchedDistricts(res.data);
      } catch (err) {
        console.error("Failed to fetch districts", err);
      }
    };
    
    fetchDistricts();
  }, [selectedState]);
  
  const INDIAN_STATES = [
    'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const STATE_DISTRICTS = {
    'Goa': ['North Goa', 'South Goa'],
    'Delhi': ['New Delhi', 'South Delhi', 'North Delhi', 'West Delhi'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra'],
  };

  // Alert Creation States
  const [alertForm, setAlertForm] = useState({ title: '', description: '', location: '', severity: 'WARNING', type: 'DISASTER', scope: 'DISTRICT' });
  const [showAlertForm, setShowAlertForm] = useState(false);

  // Location Expansion Modal
  const [showLocModal, setShowLocModal] = useState(false);
  const [showStateListModal, setShowStateListModal] = useState(false);
  const [searchNameInLoc, setSearchNameInLoc] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const STATE_COORDS = {
    'Andhra Pradesh': [15.9129, 79.7400], 'Arunachal Pradesh': [28.2180, 94.7278], 'Assam': [26.2006, 92.9376], 'Bihar': [25.0961, 85.3131], 'Chhattisgarh': [21.2787, 81.8661], 'Goa': [15.2993, 74.1240], 'Gujarat': [22.2587, 71.1924], 'Haryana': [29.0588, 76.0856], 'Himachal Pradesh': [31.1048, 77.1734], 'Jharkhand': [23.6102, 85.2799], 'Karnataka': [15.3173, 75.7139], 'Kerala': [10.8505, 76.2711], 'Madhya Pradesh': [22.9734, 78.6569], 'Maharashtra': [19.7515, 75.7139], 'Manipur': [24.6637, 93.9063], 'Meghalaya': [25.4670, 91.3662], 'Mizoram': [23.1645, 92.9376], 'Nagaland': [26.1584, 94.5624], 'Odisha': [20.9517, 85.0985], 'Punjab': [31.1471, 75.3412], 'Rajasthan': [27.0238, 74.2179], 'Sikkim': [27.5330, 88.5122], 'Tamil Nadu': [11.1271, 78.6569], 'Telangana': [18.1124, 79.0193], 'Tripura': [23.9408, 91.9882], 'Uttar Pradesh': [26.8467, 80.9462], 'Uttarakhand': [30.0668, 79.0193], 'West Bengal': [22.9868, 87.8550], 'Andaman and Nicobar': [11.7401, 92.6586], 'Chandigarh': [30.7333, 76.7794], 'Dadra and Nagar Haveli and Daman and Diu': [20.1809, 73.0169], 'Delhi': [28.6139, 77.2090], 'Jammu and Kashmir': [33.7782, 76.5762], 'Ladakh': [34.1526, 77.5771], 'Lakshadweep': [10.5667, 72.6417], 'Puducherry': [11.9416, 79.8083], 'All India': [22.5937, 78.9629]
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const u = JSON.parse(localStorage.getItem('user'));
    if (!token || !u || (u.role !== 'POLICE' && u.role !== 'AIRPORT')) {
      navigate('/');
      return;
    }
    setUser(u);
    if (u.state) setSelectedState(u.state);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchData(selectedState, selectedDistrict);
    const interval = setInterval(() => fetchData(selectedState, selectedDistrict), 3000);
    return () => clearInterval(interval);
  }, [selectedState, selectedDistrict, user]);

  const fetchData = async (state, district) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      let statsUrl = `${API_BASE_URL}/api/admin/stats?state=${state}`;
      let touristsUrl = `${API_BASE_URL}/api/admin/tourists?state=${state}`;
      
      if (district && district !== 'All Districts') {
        statsUrl += `&district=${district}`;
        touristsUrl += `&district=${district}`;
      }

      // Fetch stats (Fast count)
      const statsRes = await axios.get(statsUrl, { headers });
      setStats(statsRes.data);

      // Fetch tourists (Limited for performance)
      const touristsRes = await axios.get(touristsUrl, { headers });
      setTourists(touristsRes.data);
      
      let incomingUrl = `${API_BASE_URL}/api/admin/incoming?state=${state}`;
      if (district && district !== 'All Districts') {
        incomingUrl += `&district=${district}`;
      }
      const incomingRes = await axios.get(incomingUrl, { headers });
      setIncomingTourists(incomingRes.data);
    } catch (err) {
      console.error(err);
      if (err.response) {
        console.error('Response Error:', err.response.data);
      }
      // Only alert once to avoid spamming
      if (!window.hasAlertedError) {
        alert(`CRITICAL: Dashboard could not connect to database. \n\nReason: ${err.message}\n\nPlease ensure your backend is running on port 5005.`);
        window.hasAlertedError = true;
      }
    } finally {
      setLoading(false);
    }
  };

  const isAirport = user?.role === 'AIRPORT';
  const themeColor = isAirport ? '#002B5B' : '#8B0000';

  const handleAction = async (type) => {
    try {
      const token = localStorage.getItem('token');
      if (type === 'FIR') {
        const res = await axios.post(`${API_BASE_URL}/api/admin/efir`, 
          { touristId: selectedTourist.username, details: firDetails },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Success! Case ID: ${res.data.caseId}`);
        setFirModal(false); setFirDetails('');
      } else if (type === 'FINE') {
        await axios.post(`${API_BASE_URL}/api/admin/fine`, 
          { touristId: selectedTourist.username, amount: fineAmount, reason: 'Suspicious/Off-Route Activity' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Fine issued successfully');
        setFineModal(false); setFineAmount('');
      }
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handlePayFine = async (touristId, fineId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/admin/pay-fine`, 
        { touristId, fineId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Fine marked as paid and cleared!');
      if (searchedTouristInfo && searchedTouristInfo.username === touristId) {
         setSearchedTouristInfo(res.data.user);
      }
      fetchData();
    } catch (err) {
      toast.error('Failed to clear fine');
    }
  };

  const handleResolveSOS = async (touristId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/admin/resolve-sos`, 
        { touristId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('SOS marked as Resolved!');
      fetchData(); // This will refresh the tourists and naturally remove them from sosTourists
    } catch (err) {
      toast.error('Failed to resolve SOS');
    }
  };

  const handlePostAlert = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/admin/alerts`, alertForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Global Alert Published');
      setAlertForm({ title: '', description: '', location: '', severity: 'WARNING', type: 'DISASTER', scope: 'DISTRICT' });
      setShowAlertForm(false);
    } catch (err) {
      alert('Failed to post alert');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const copyTouristId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTourists = tourists; // Now filtered by backend

  const totalTourists = stats.total || tourists.length;
  const sosTourists = tourists.filter(t => t.panicActive === true);

  const previousSosCount = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3');
      audioRef.current.loop = true;
    }

    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          window.removeEventListener('click', unlockAudio);
        }).catch(e => console.log('Unlock failed', e));
      }
    };
    window.addEventListener('click', unlockAudio);

    if (sosTourists.length > 0) {
      if (sosTourists.length > previousSosCount.current) {
         audioRef.current.play().catch(e => console.log('Audio autoplay blocked by browser', e));
      }
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    previousSosCount.current = sosTourists.length;

    return () => {
       window.removeEventListener('click', unlockAudio);
       if (audioRef.current) {
          audioRef.current.pause();
       }
    };
  }, [sosTourists.length]);

  const filteredByLoc = useMemo(() => {
    if (!searchLoc) return [];
    return filteredTourists.filter(t => 
      t.origin?.toLowerCase().includes(searchLoc.toLowerCase()) || 
      t.destination?.toLowerCase().includes(searchLoc.toLowerCase()) ||
      t.travelDetails?.toLowerCase().includes(searchLoc.toLowerCase())
    );
  }, [searchLoc, filteredTourists]);

  const touristsInLocByName = useMemo(() => {
    if (!searchNameInLoc) return filteredByLoc;
    return filteredByLoc.filter(t => t.name.toLowerCase().includes(searchNameInLoc.toLowerCase()));
  }, [searchNameInLoc, filteredByLoc]);

  const [searchedTouristInfo, setSearchedTouristInfo] = useState(null);
  
  useEffect(() => {
    const searchTourist = async () => {
      if (!searchId) {
        setSearchedTouristInfo(null);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/search?id=${searchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchedTouristInfo(res.data);
      } catch (err) {
        console.error("Search failed", err);
        setSearchedTouristInfo(null);
      }
    };
    
    const timeoutId = setTimeout(searchTourist, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchId]);

  const densitySpots = useMemo(() => {
    if (!filteredTourists.length) return [];
    const spots = {};
    filteredTourists.forEach(t => {
      if(t.lastLocation) {
        const lat = t.lastLocation.lat.toFixed(1);
        const lng = t.lastLocation.lng.toFixed(1);
        const key = `${lat},${lng}`;
        if (!spots[key]) spots[key] = { lat: t.lastLocation.lat, lng: t.lastLocation.lng, count: 0 };
        spots[key].count += 1;
      }
    });
    return Object.values(spots);
  }, [filteredTourists]);

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-gray-800 flex flex-col font-sans relative">
      <header className="bg-white border-b border-gray-200 p-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-4">
           <div className="relative group cursor-pointer mr-2 rounded-2xl overflow-hidden shadow-md border border-gray-100 p-2 transition-all duration-500 hover:border-orange-500/50 flex flex-col items-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <img src="/images/saarth_logo.jpg?v=3" alt="SAARTH Logo" className="h-20 object-contain rounded-xl hover:scale-105 transition-all duration-500 relative z-10" />
             <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mt-1.5 relative z-10">Under Ministry of Tourism</p>
           </div>
           <div className="h-8 w-px bg-gray-200"></div>
           <div>
             <h1 className="text-xl font-black tracking-tight uppercase leading-none flex items-center" style={{ color: themeColor }}>
               {isAirport ? <Plane className="w-5 h-5 mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
               {isAirport ? 'Airport Authority Grid' : 'Police Command Center'}
             </h1>
             <p className="text-[10px] text-orange-500 font-bold tracking-widest mt-1">SAARTH Security Initiative</p>
           </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end mr-4">
            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{user?.username}</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{user?.role} ACCESS</span>
              {user?.district && (
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-px bg-gray-200"></div>
                  <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                    {user.district} District
                  </span>
                </div>
              )}
              {user?.state === 'All India' ? (
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-px bg-gray-200"></div>
                  <select 
                    value={selectedState} 
                    onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict('All Districts'); }}
                    className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100 transition-all outline-none"
                  >
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  
                   {/* District Dropdown */}
                  {selectedState !== 'All India' && (
                    <>
                      <div className="h-3 w-px bg-gray-200 ml-3"></div>
                      <select 
                        value={selectedDistrict} 
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100 transition-all outline-none ml-3"
                      >
                        <option value="All Districts">All Districts</option>
                        {(fetchedDistricts.length > 0 ? fetchedDistricts : (STATE_DISTRICTS[selectedState] || ['District-1', 'District-2', 'District-3'])).map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </>
                  )}
                </div>
              ) : user?.state && (
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-px bg-gray-200"></div>
                  <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest bg-orange-50 px-3 py-0.5 rounded-full border border-orange-100">
                    {user.state}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors text-gray-600 shadow-sm">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {isAirport && (
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#002B5B]"></div>
              <Users className="absolute -top-4 -right-4 w-24 h-24 text-blue-500/5 group-hover:scale-110 transition-transform" />
              <h2 className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Active Tourists</h2>
              <p className="text-6xl font-black text-[#002B5B]">{totalTourists}</p>
            </div>
            
            <div 
              onClick={() => navigate('/airport/register')}
              className="bg-[#002B5B] p-8 rounded-[2rem] shadow-xl shadow-blue-900/20 border border-blue-800 relative overflow-hidden flex flex-col justify-center cursor-pointer group hover:bg-orange-600 transition-all"
            >
              <FilePlus className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
              <h2 className="text-white font-black text-2xl leading-tight">International<br/>Registration</h2>
              <div className="mt-4 flex items-center text-white/70 text-xs font-bold uppercase tracking-widest">
                Register New Arrival <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
               <Database className="absolute -top-4 -right-4 w-24 h-24 text-orange-500/5" />
               <h2 className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Data Integrity</h2>
               <p className="text-lg font-black text-gray-900 uppercase">Operational</p>
               <p className="text-xs text-green-500 font-bold mt-2 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> All Systems Green</p>
            </div>
          </div>

          <div className="bg-white shadow-2xl shadow-gray-200/50 rounded-[2rem] overflow-hidden border border-gray-100">
             <div className="p-8 border-b border-gray-100 flex justify-between items-center">
               <h2 className="text-xl font-black text-[#002B5B] flex items-center uppercase tracking-tight">
                 <div className="p-2 bg-blue-50 rounded-lg mr-3"><Activity className="w-5 h-5 text-blue-600" /></div>
                 Registration Log
               </h2>
               <div className="flex items-center space-x-2 text-xs text-gray-400 font-bold bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                 <Search className="w-3 h-3" />
                 <span>Real-time Sync Active</span>
               </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead><tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="p-6">Tourist Details</th>
                    <th className="p-6">Identity Credentials</th>
                    <th className="p-6">Planned Itinerary</th>
                    <th className="p-6">System Status</th>
                 </tr></thead>
                 <tbody className="divide-y divide-gray-50">
                   {tourists.slice(0, 100).map(t => (
                     <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-6">
                          <div className="font-black text-gray-900">{t.name}</div>
                          <div className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">{t.origin}</div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="font-mono text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">ID: {t.username}</div>
                            <button onClick={() => copyTouristId(t.username)} className="text-gray-400 hover:text-blue-600 transition-colors">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-[10px] text-gray-900 font-black uppercase tracking-widest">PASS: {t.originalPassword}</div>
                            <button onClick={() => copyTouristId(t.originalPassword)} className="text-gray-400 hover:text-orange-600 transition-colors">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="text-xs font-bold text-gray-700">{t.origin} <span className="text-orange-500 mx-2">→</span> {t.destination}</div>
                        </td>
                        <td className="p-6">
                          <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">Verified</span>
                        </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {!isAirport && (
        <div className="flex-1 p-8 w-full grid grid-cols-1 xl:grid-cols-12 gap-8 z-10 max-w-[1600px] mx-auto">
          {/* Left Column: Intelligence */}
          <div className="xl:col-span-3 flex flex-col gap-8">
            <div 
              onClick={() => setShowStateListModal(true)}
              className="bg-white p-8 rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-200/20 cursor-pointer hover:border-red-400 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
              <h2 className="text-[10px] font-black text-red-500 mb-8 uppercase tracking-widest flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2" /> Live Surveillance
              </h2>
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-6 mb-6">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Tracking</p>
                <div className="flex flex-col items-end">
                  <p className="text-5xl font-black text-gray-900">{stats.total || tourists.length}</p>
                  <p className="text-[10px] text-red-500 font-black uppercase mt-1">Click to view list</p>
                </div>
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setShowEmergencyModal(true); }}
                className="flex items-baseline justify-between text-red-600 cursor-pointer hover:scale-105 transition-transform"
              >
                <p className="text-[10px] font-black uppercase tracking-widest">Active SOS</p>
                <p className="text-4xl font-black animate-pulse">{sosTourists.length}</p>
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center mt-6 group-hover:translate-x-2 transition-transform inline-flex items-center">Open State Intelligence Grid <ArrowRight className="ml-2 w-3 h-3" /></p>
            </div>
            
            {/* Incoming Traffic Card */}
            <div 
              onClick={() => setShowIncomingModal(true)}
              className="bg-white p-8 rounded-[2.5rem] border border-green-100 shadow-xl shadow-green-200/20 cursor-pointer hover:border-green-400 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
              <h2 className="text-[10px] font-black text-green-500 mb-8 uppercase tracking-widest flex items-center relative z-10">
                <Navigation className="w-4 h-4 mr-2" /> Incoming Traffic
              </h2>
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-6 mb-6 relative z-10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">En Route to {user?.district || user?.state}</p>
                <div className="flex flex-col items-end">
                  <p className="text-5xl font-black text-gray-900">{incomingTourists.length}</p>
                  <p className="text-[10px] text-green-500 font-black uppercase mt-1">Click to view list</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center group-hover:translate-x-2 transition-transform inline-flex items-center relative z-10">View Incoming Tourists <ArrowRight className="ml-2 w-3 h-3" /></p>
            </div>

            <div 
              onClick={() => setShowAlertForm(true)}
              className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-200/20 cursor-pointer hover:border-blue-400 transition-all group"
            >
               <h2 className="text-[10px] font-black text-blue-500 mb-4 uppercase tracking-widest flex items-center">
                 <CloudRain className="w-4 h-4 mr-2" /> Global Alerts
               </h2>
               <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">Broadcast critical security or weather warnings to all registered devices.</p>
               <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-colors">Issue Official Alert</button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex-1">
              <h2 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest flex items-center"><Search className="w-4 h-4 mr-2"/> Deep Search Intelligence</h2>
              <input 
                type="text" value={searchId} onChange={e => setSearchId(e.target.value)} 
                placeholder="Enter Tourist ID..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-mono text-sm mb-6 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
              />
              {searchedTouristInfo && (
                <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="bg-[#f0f4f8] p-6 rounded-3xl border border-blue-100 mt-4 overflow-y-auto max-h-[400px] custom-scrollbar">
                  <div className="flex items-center space-x-3 mb-4 border-b border-blue-200 pb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                      {searchedTouristInfo.profilePic ? (
                        <img src={searchedTouristInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900">{searchedTouristInfo.name}</h3>
                      <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">{searchedTouristInfo.origin}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center"><Activity className="w-3 h-3 mr-1"/> Last Seen & Location</p>
                    <p className="text-xs font-bold text-gray-800">
                      {new Date(searchedTouristInfo.updatedAt).toLocaleString()}
                    </p>
                    <p className="text-xs font-bold text-gray-600 mt-1">Location: {searchedTouristInfo.destination || searchedTouristInfo.state || 'Unknown'}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 flex items-center"><Navigation className="w-3 h-3 mr-1"/> Active Trip / Route</p>
                    {(searchedTouristInfo.activeTrips && searchedTouristInfo.activeTrips.length > 0) ? (
                      <div className="space-y-2">
                        {searchedTouristInfo.activeTrips.map((trip, idx) => (
                           <div key={idx} className="bg-white p-3 rounded-xl border border-blue-50">
                              <p className="text-xs font-black text-[#002B5B]">{trip.placeName}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Added: {new Date(trip.date).toLocaleDateString()}</p>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg">No active trips added.</p>
                    )}
                  </div>

                  {searchedTouristInfo.routePlan && searchedTouristInfo.routePlan.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 flex items-center"><MapPin className="w-3 h-3 mr-1"/> Saved Itinerary</p>
                      <div className="space-y-1">
                        {searchedTouristInfo.routePlan.map((rp, idx) => (
                           <p key={idx} className="text-xs font-bold text-gray-700 bg-white p-2 rounded-lg border border-gray-100 flex items-center">
                             <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span> {rp.location}
                           </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchedTouristInfo.fines && searchedTouristInfo.fines.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1 text-orange-500"/> Active Fines</p>
                      <div className="space-y-2">
                        {searchedTouristInfo.fines.map((fine, idx) => (
                           <div key={idx} className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex justify-between items-center">
                              <div>
                                <p className="text-xs font-black text-orange-700">₹{fine.amount}</p>
                                <p className="text-[9px] text-orange-600 font-bold uppercase tracking-widest mt-1">{fine.reason}</p>
                              </div>
                              <button onClick={() => handlePayFine(searchedTouristInfo.username, fine._id)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors shadow-md">Mark Paid</button>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-6">
                    <button onClick={() => { setSelectedTourist(searchedTouristInfo); setFirModal(true); }} className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">E-FIR</button>
                    <button onClick={() => { setSelectedTourist(searchedTouristInfo); setFineModal(true); }} className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Fine</button>
                    <button onClick={() => { setNavTourist(searchedTouristInfo); }} className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Track</button>
                  </div>
                </motion.div>
              )}
              {!searchedTouristInfo && searchId && <p className="text-[10px] text-gray-400 font-bold uppercase text-center mt-4">No records found</p>}
            </div>
          </div>

          {/* Right Column: Tactical Map */}
          <div className="xl:col-span-9 flex flex-col gap-8">
            <div className="bg-white p-3 rounded-full border border-gray-100 shadow-lg flex items-center px-8 relative z-20">
              <Search className="w-5 h-5 text-gray-400 mr-4" />
              <input 
                type="text" value={searchLoc} onChange={e => setSearchLoc(e.target.value)} 
                placeholder="Scan Specific Location (e.g. 'Goa', 'Taj Mahal')..." 
                className="bg-transparent border-none outline-none text-gray-800 w-full font-medium" 
              />
              {searchLoc && (
                <button 
                  onClick={() => setShowLocModal(true)} 
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-xs font-black text-white shadow-lg shadow-orange-200 transition-all ml-4"
                >
                  {filteredByLoc.length} Contacts Found
                </button>
              )}
            </div>

            <div className="bg-white border-8 border-white rounded-[3.5rem] overflow-hidden flex-1 min-h-[650px] relative shadow-2xl shadow-gray-200/80">
              <div className="absolute top-6 left-6 z-[1000] flex flex-col space-y-3">
                <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Tactical Scan Overlay Active</span>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-[10px] font-bold text-gray-500"><div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div> High Density</div>
                    <div className="flex items-center text-[10px] font-bold text-gray-500"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div> Moderate Density</div>
                  </div>
                </div>
              </div>
              <MapContainer 
                center={STATE_COORDS[selectedState] || [22.5937, 78.9629]} 
                zoom={selectedState === 'All India' ? 5 : 8} 
                style={{ height: '100%', width: '100%' }}
                key={selectedState}
                maxBounds={[[6.7, 68.1], [37.5, 97.4]]} // Constrain to India
                minZoom={4}
              >
                <TileLayer 
                  url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
                  subdomains={['mt0','mt1','mt2','mt3']}
                  attribution='&copy; Google Maps'
                />
                {densitySpots.map((spot, idx) => {
                   const count = spot.count * 100; // Adjusted for 25k users
                   return <Circle key={idx} center={[spot.lat, spot.lng]} pathOptions={{ color: spot.count > 500 ? '#ef4444' : '#f59e0b', fillOpacity: 0.3, weight: 1 }} radius={20000 + (Math.sqrt(spot.count) * 2000)} />
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {/* Incoming Traffic Modal */}
      <AnimatePresence>
        {showIncomingModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#002B5B]/30 backdrop-blur-xl">
             <motion.div initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} exit={{opacity:0, y:50}} className="bg-white border border-gray-100 p-10 rounded-[3rem] w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl custom-scrollbar">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-4xl font-black text-gray-900 flex items-center tracking-tighter uppercase leading-none"><Navigation className="w-10 h-10 mr-4 text-green-600" /> Incoming Traffic</h2>
                   <button onClick={() => setShowIncomingModal(false)} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">✕</button>
                </div>
                {incomingTourists.length === 0 ? (
                   <div className="bg-gray-50 border border-gray-100 p-10 rounded-[2rem] text-center">
                     <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No incoming tourists to {user?.district || user?.state}</p>
                   </div>
                ) : (
                   <div className="space-y-4">
                      {incomingTourists.map((t, idx) => (
                         <div key={idx} className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:border-green-200 transition-colors">
                           <div className="flex items-center space-x-6">
                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                               {t.profilePic ? <img src={t.profilePic} className="w-full h-full object-cover"/> : <User className="w-8 h-8 text-gray-400" />}
                             </div>
                             <div>
                               <h3 className="text-xl font-black text-gray-900">{t.name} <span className="text-sm text-gray-400 font-medium">({t.username})</span></h3>
                               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Origin: <span className="text-gray-700">{t.origin}</span></p>
                               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Current Dist: <span className="text-red-500">{t.district || t.state || 'Unknown'}</span></p>
                               <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1 bg-green-50 px-2 py-1 inline-block rounded-md">Destination: {t.destination}</p>
                             </div>
                           </div>
                           <button onClick={() => { setSearchId(t.username); setShowIncomingModal(false); }} className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors flex items-center">
                             <Search className="w-4 h-4 mr-2"/> Track
                           </button>
                         </div>
                      ))}
                   </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency Grid Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#002B5B]/30 backdrop-blur-xl">
             <motion.div initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} exit={{opacity:0, y:50}} className="bg-white border border-gray-100 p-10 rounded-[3rem] w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-4xl font-black text-gray-900 flex items-center tracking-tighter uppercase leading-none"><ShieldAlert className="w-10 h-10 mr-4 text-red-600" /> Crisis Grid</h2>
                   <button onClick={() => setShowEmergencyModal(false)} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">✕</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {sosTourists.map(t => (
                      <div key={t._id} className="bg-red-50 border border-red-100 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center relative group">
                         <div className="mb-6 md:mb-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden mb-2">
                                {t.profilePic ? (
                                  <img src={t.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-5 h-5 text-gray-600" />
                                )}
                              </div>
                              <h4 className="text-2xl font-black text-gray-900 tracking-tight">{t.name}</h4>
                              <span className="text-xs font-mono bg-white px-3 py-1 rounded-full border border-red-200 text-red-600 font-bold">{t.username}</span>
                            </div>
                            <p className="text-xs text-red-700 font-black uppercase tracking-widest flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> REASON: {t.panicReason || 'UNDEFINED EMERGENCY'}</p>
                            <div className="mt-4 flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest"><MapPin className="w-3 h-3 mr-2" /> Lat: {t.lastLocation?.lat?.toFixed(4)}, Lng: {t.lastLocation?.lng?.toFixed(4)}</div>
                         </div>
                         <div className="flex flex-col space-y-2">
                           <button 
                             onClick={() => setMapPopupUrl(`https://maps.google.com/maps?q=${t.lastLocation?.lat},${t.lastLocation?.lng}&z=15&output=embed`)} 
                             className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center shadow-lg shadow-red-200 transition-all active:scale-95"
                           >
                              <Navigation className="w-4 h-4 mr-2" /> Show Map
                           </button>
                           <button 
                             onClick={() => handleResolveSOS(t.username)} 
                             className="bg-white border border-red-200 hover:bg-red-50 text-red-600 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center shadow-sm transition-all active:scale-95 justify-center"
                           >
                              <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                           </button>
                         </div>
                      </div>
                    ))}
                   {sosTourists.length === 0 && (
                     <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-gray-100 border-dashed">
                        <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No Active Emergency Signals</p>
                     </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Map Popup Modal */}
      <AnimatePresence>
        {mapPopupUrl && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
             <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-white p-6 rounded-[2rem] w-full max-w-4xl shadow-2xl relative">
                <button onClick={() => setMapPopupUrl(null)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10">✕</button>
                <div className="w-full h-[600px] rounded-xl overflow-hidden">
                   <iframe src={mapPopupUrl} width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Publication Modal */}
      <AnimatePresence>
        {showAlertForm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#002B5B]/30 backdrop-blur-xl">
             <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-white border border-gray-100 p-10 rounded-[3rem] w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                <h2 className="text-2xl font-black text-[#002B5B] mb-2 uppercase tracking-tighter flex items-center"><Wind className="w-8 h-8 mr-3 text-blue-500"/> Global Broadcast</h2>
                <p className="text-gray-500 text-sm mb-8 font-medium">This alert will be pushed to all tourist devices immediately.</p>
                <form onSubmit={handlePostAlert} className="space-y-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alert Title</label>
                     <input required type="text" placeholder="e.g. Cyclone Alert - Odisha Coast" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" value={alertForm.title} onChange={e => setAlertForm({...alertForm, title: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location Scope</label>
                     <input required type="text" placeholder="e.g. Coastal Regions, Pan-India" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" value={alertForm.location} onChange={e => setAlertForm({...alertForm, location: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Broadcast Scope</label>
                     <select 
                       className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-black uppercase tracking-widest text-xs focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
                       value={alertForm.scope || 'DISTRICT'} 
                       onChange={e => setAlertForm({...alertForm, scope: e.target.value})}
                     >
                        <option value="DISTRICT">Current District Only</option>
                        <option value="STATE">Entire State</option>
                        <option value="NATIONAL">National (All India)</option>
                     </select>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Severity Level</label>
                     <select className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-black uppercase tracking-widest text-xs focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" value={alertForm.severity} onChange={e => setAlertForm({...alertForm, severity: e.target.value})}>
                        <option value="INFO">Information (Blue)</option>
                        <option value="WARNING">Warning (Orange)</option>
                        <option value="CRITICAL">Critical (Red)</option>
                     </select>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message Content</label>
                     <textarea required placeholder="Detailed instructions for tourists..." className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl h-32 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none" value={alertForm.description} onChange={e => setAlertForm({...alertForm, description: e.target.value})} />
                   </div>
                   <div className="flex gap-4 pt-6">
                      <button type="button" onClick={() => setShowAlertForm(false)} className="flex-1 py-4 border border-gray-100 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:text-gray-600 transition-all">Cancel</button>
                      <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-200 transition-all">Broadcast Now</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Area Scan Modal */}
      <AnimatePresence>
        {showLocModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#002B5B]/30 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-gray-100 p-10 rounded-[3rem] w-full max-w-4xl flex flex-col max-h-[85vh] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 flex items-center tracking-tighter uppercase leading-none">
                    <MapPin className="w-10 h-10 text-orange-500 mr-4" /> Area Intelligence
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 ml-14">Target Scope: {searchLoc}</p>
                </div>
                <button onClick={() => setShowLocModal(false)} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">✕</button>
              </div>
              <div className="relative mb-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input type="text" value={searchNameInLoc} onChange={e => setSearchNameInLoc(e.target.value)} placeholder="Filter intelligence by name..." className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-16 py-5 text-gray-900 font-medium focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all shadow-inner" />
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {touristsInLocByName.map(t => (
                  <div key={t._id} className="bg-white border border-gray-100 p-6 rounded-[2rem] flex items-center justify-between hover:border-orange-200 transition-colors shadow-sm group">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mr-6 border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all"><User className="w-7 h-7 text-gray-300 group-hover:text-orange-500" /></div>
                      <div>
                        <h4 className="font-black text-gray-900 tracking-tight">{t.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold font-mono tracking-widest uppercase">{t.username}</p>
                      </div>
                    </div>
                    <button onClick={() => copyTouristId(t.username)} className="bg-gray-50 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-200 transition-all active:scale-95 shadow-sm">
                      {copiedId === t.username ? 'Copied to Clipboard' : 'Copy Track ID'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* State Intelligence Modal */}
      <AnimatePresence>
        {showStateListModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-gray-100 p-10 rounded-[3rem] w-full max-w-5xl flex flex-col max-h-[85vh] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 flex items-center tracking-tighter uppercase leading-none">
                    <Database className="w-10 h-10 text-blue-600 mr-4" /> State Intelligence Grid
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 ml-14">Sector: {selectedState} | Active Count: {totalTourists}</p>
                </div>
                <button onClick={() => setShowStateListModal(false)} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-gray-400 font-black uppercase tracking-widest border-b border-gray-100">
                      <th className="pb-4 pl-4">Tourist Identity</th>
                      <th className="pb-4">System ID</th>
                      <th className="pb-4">Location Hub</th>
                      <th className="pb-4 text-right pr-4">Tactical Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTourists.map(t => (
                      <tr key={t._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-6 pl-4">
                          <div className="font-black text-gray-900 tracking-tight">{t.name}</div>
                          <div className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">{t.origin}</div>
                        </td>
                        <td className="py-6">
                          <span className="font-mono text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 font-bold">{t.username}</span>
                        </td>
                        <td className="py-6">
                           <div className="flex items-center text-[10px] font-black text-gray-900 uppercase">
                             <MapPin className="w-3 h-3 mr-2 text-orange-500" />
                             {t.destination} {/* Full Word Format Location */}
                           </div>
                        </td>
                        <td className="py-6 text-right pr-4">
                          <button 
                            onClick={() => { setNavTourist(t); setShowStateListModal(false); }}
                            className="bg-[#002B5B] text-white px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-blue-900/10 text-[10px] font-black uppercase tracking-widest flex items-center ml-auto"
                          >
                            <Navigation className="w-3 h-3 mr-2" /> Get Direction
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIR Modal */}
      <AnimatePresence>
        {firModal && selectedTourist && (
          <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center">
                  <ShieldAlert className="w-6 h-6 text-red-600 mr-2" /> Issue E-FIR
                </h2>
                <button onClick={() => setFirModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Issuing E-FIR against <span className="font-bold text-gray-900">{selectedTourist.name}</span></p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">FIR Reason / Details</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Enter the detailed reason for FIR..."
                    rows={4}
                    id="firReason"
                  />
                </div>
                <button 
                  onClick={() => {
                    const reason = document.getElementById('firReason').value;
                    if (!reason) return alert('Please enter a reason');
                    
                    // Save to localStorage for notification
                    const notifications = JSON.parse(localStorage.getItem(`notifications_${selectedTourist.username}`) || '[]');
                    notifications.push({
                      type: 'FIR',
                      title: '🚨 E-FIR Issued Against You',
                      message: reason,
                      date: new Date().toISOString(),
                      read: false
                    });
                    localStorage.setItem(`notifications_${selectedTourist.username}`, JSON.stringify(notifications));
                    
                    alert('E-FIR Issued Successfully!');
                    setFirModal(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                >
                  File E-FIR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fine Modal */}
      <AnimatePresence>
        {fineModal && selectedTourist && (
          <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center">
                  <AlertCircle className="w-6 h-6 text-orange-500 mr-2" /> Apply Fine
                </h2>
                <button onClick={() => setFineModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Applying fine to <span className="font-bold text-gray-900">{selectedTourist.name}</span></p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Fine Amount (INR)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Enter amount..."
                    id="fineAmount"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Fine Reason</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Enter the reason for fine..."
                    rows={3}
                    id="fineReason"
                  />
                </div>
                <button 
                  onClick={async () => {
                    const amount = document.getElementById('fineAmount').value;
                    const reason = document.getElementById('fineReason').value;
                    if (!amount || !reason) return alert('Please enter amount and reason');
                    
                    try {
                      const token = localStorage.getItem('token');
                      await axios.post(`${API_BASE_URL}/api/admin/fine`, 
                        { touristId: selectedTourist.username, amount: Number(amount), reason },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      
                      // Save to localStorage for fallback notification
                      const notifications = JSON.parse(localStorage.getItem(`notifications_${selectedTourist.username}`) || '[]');
                      notifications.push({
                        type: 'FINE',
                        title: '💰 Fine Applied',
                        message: `Amount: ₹${amount}\nReason: ${reason}`,
                        date: new Date().toISOString(),
                        read: false
                      });
                      localStorage.setItem(`notifications_${selectedTourist.username}`, JSON.stringify(notifications));
                      
                      alert('Fine Applied Successfully!');
                      setFineModal(false);
                    } catch (err) {
                      alert('Action failed: ' + (err.response?.data?.error || err.message));
                    }
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20"
                >
                  Apply Fine
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-Screen Response Modal (Same Tab) */}
      <AnimatePresence>
        {navTourist && (
          <div className="fixed inset-0 z-[4000] bg-white flex flex-col">
            <header className="bg-white border-b border-gray-100 p-6 px-10 flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-6">
                <button onClick={() => setNavTourist(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-all text-gray-900">
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </button>
                <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">Response Intercept Grid</h2>
                   <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mt-2 flex items-center">
                     <ShieldAlert className="w-4 h-4 mr-2" /> Target: {navTourist.name} ({navTourist.username})
                   </p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                 <div className="text-right">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Sector Hub</p>
                    <p className="font-bold text-gray-900">{navTourist.destination}</p>
                 </div>
                 <button onClick={() => setNavTourist(null)} className="bg-[#002B5B] text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-lg">Back to Dashboard</button>
              </div>
            </header>

            {(() => {
              const pLat = (navTourist.lastLocation?.lat || 20) + 0.015;
              const pLng = (navTourist.lastLocation?.lng || 77) - 0.015;
              const tLat = navTourist.lastLocation?.lat || 20;
              const tLng = navTourist.lastLocation?.lng || 77;
              
              // Simple distance approximation for tactical feel
              const dist = (Math.sqrt(Math.pow(pLat - tLat, 2) + Math.pow(pLng - tLng, 2)) * 111.32).toFixed(2);

              return (
                <div className="flex-1 relative">
                  <MapContainer center={[tLat, tLng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer 
                      url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
                      subdomains={['mt0','mt1','mt2','mt3']}
                      attribution='&copy; Google Maps'
                    />
                    <Marker position={[tLat, tLng]}>
                      <Popup><span className="font-black text-red-600">TARGET ACQUIRED: {navTourist.name}</span></Popup>
                    </Marker>
                    <Marker 
                      position={[pLat, pLng]}
                      icon={L.divIcon({ className: 'bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-lg shadow-blue-500' })}
                    >
                      <Popup><span className="font-black text-blue-600">POLICE UNIT 01</span></Popup>
                    </Marker>
                    <Polyline 
                      positions={[[pLat, pLng], [tLat, tLng]]}
                      pathOptions={{ color: '#2563eb', weight: 4, dashArray: '10, 10', opacity: 0.8 }}
                    />
                    
                    {/* Render Tourist's Active Trips (Historical/Planned Route) */}
                    {navTourist.activeTrips && navTourist.activeTrips.length > 0 && (
                      <>
                        {navTourist.activeTrips.map((trip, idx) => {
                          if (!trip.location || !trip.location.lat) return null;
                          return (
                            <CircleMarker 
                              key={idx}
                              center={[trip.location.lat, trip.location.lng]}
                              radius={6}
                              pathOptions={{ fillColor: '#f97316', fillOpacity: 1, color: '#ffffff', weight: 2 }}
                            >
                              <Popup>
                                <div className="text-xs">
                                  <p className="font-black text-[#002B5B] uppercase mb-1">{trip.placeName}</p>
                                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Added: {new Date(trip.date).toLocaleDateString()}</p>
                                </div>
                              </Popup>
                            </CircleMarker>
                          );
                        })}
                        <Polyline 
                          positions={[
                            ...navTourist.activeTrips.filter(t => t.location?.lat).map(t => [t.location.lat, t.location.lng]),
                            [tLat, tLng]
                          ]}
                          pathOptions={{ color: '#f97316', weight: 3, opacity: 0.7 }}
                        />
                      </>
                    )}
                  </MapContainer>
                  
                  <div className="absolute bottom-10 left-10 z-[1000] bg-white/95 backdrop-blur p-6 rounded-[2rem] border border-gray-100 shadow-2xl flex items-center space-x-6">
                     <div className="p-4 bg-blue-50 rounded-2xl"><Navigation className="w-8 h-8 text-blue-600" /></div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tactical Routing Active</p>
                        <p className="text-lg font-black text-gray-900 uppercase">Estimated Intercept: {dist} KM</p>
                        <div className="flex space-x-4 mt-1">
                           <span className="text-[10px] text-gray-500 font-bold uppercase">Lat: {tLat.toFixed(4)}</span>
                           <span className="text-[10px] text-gray-500 font-bold uppercase">Lng: {tLng.toFixed(4)}</span>
                        </div>
                     </div>
                     {!isAirport && (
                       <div className="flex space-x-3 border-l border-gray-100 pl-6 ml-6">
                          <button 
                            onClick={() => { setSelectedTourist(navTourist); setFirModal(true); }}
                            className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg"
                          >
                            Issue E-FIR
                          </button>
                          <button 
                            onClick={() => { setSelectedTourist(navTourist); setFineModal(true); }}
                            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-lg"
                          >
                            Apply Fine
                          </button>
                       </div>
                     )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
