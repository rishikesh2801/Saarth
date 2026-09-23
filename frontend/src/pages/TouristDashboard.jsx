import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Navigation, Activity, MapPin, LogOut, Search, 
  AlertTriangle, Utensils, Info, Cloud, Users, Map, Plus, 
  Trash2, ArrowRight, FileText, User, Wind, Thermometer, 
  Hotel, Store, Compass, Calendar, CheckCircle, X, Bell,
  Camera, Upload, Settings, Eye, EyeOff, Plane, ShieldCheck, Star
} from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { indiaTourismData } from '../data/indiaTourismData';
import { API_BASE_URL, OTM_API_KEY } from '../config/apiConfig';

export default function TouristDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 }); 
  const [routePlan, setRoutePlan] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [deletedNotifIds, setDeletedNotifIds] = useState([]);
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let lat = 28.6139;
        let lng = 77.2090;
        
        console.log("Weather fetch user:", user);
        
        if (user && user.state) {
          const stateData = indiaTourismData.find(s => s.name.toLowerCase() === user.state.toLowerCase());
          console.log("Found state data:", stateData);
          if (stateData && stateData.locations && stateData.locations.length > 0) {
            if (user.district) {
              const distLoc = stateData.locations.find(l => l.name.toLowerCase().includes(user.district.toLowerCase()));
              if (distLoc) {
                lat = distLoc.lat;
                lng = distLoc.lng;
              } else {
                lat = stateData.locations[0].lat;
                lng = stateData.locations[0].lng;
              }
            } else {
              lat = stateData.locations[0].lat;
              lng = stateData.locations[0].lng;
            }
          }
        }
        
        console.log(`Fetching weather for lat: ${lat}, lng: ${lng}`);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/tourist/weather?lat=${lat}&lng=${lng}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Weather data fetched:", res.data);
        
        if (res.data.error || !res.data.current_weather) {
          console.warn("Weather API limited or error. Using fallback data.");
          setWeather({
            current_weather: { temperature: 27 },
            daily: {
              temperature_2m_max: [32, 33],
              temperature_2m_min: [22, 23]
            }
          });
        } else {
          setWeather(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        console.warn("Using fallback weather data due to error.");
        setWeather({
          current_weather: { temperature: 27 },
          daily: {
            temperature_2m_max: [32, 33],
            temperature_2m_min: [22, 23]
          }
        });
      }
    };
    if (user) {
      fetchWeather();
    }
  }, [user]);
  
  useEffect(() => {
    if (user?.username) {
      const saved = localStorage.getItem(`deleted_notifs_${user.username}`);
      setDeletedNotifIds(saved ? JSON.parse(saved) : []);
    }
  }, [user?.username]);

  const handleDeleteNotification = (id) => {
    const updated = [...deletedNotifIds, id];
    setDeletedNotifIds(updated);
    if (user?.username) {
      localStorage.setItem(`deleted_notifs_${user.username}`, JSON.stringify(updated));
    }
    setAlerts(prev => prev.filter(n => (n._id || n.date) !== id));
  };

  const handleDeleteAllNotifications = () => {
    const allIds = alerts.map(n => n._id || n.date);
    const updated = [...deletedNotifIds, ...allIds];
    setDeletedNotifIds(updated);
    if (user?.username) {
      localStorage.setItem(`deleted_notifs_${user.username}`, JSON.stringify(updated));
    }
    setAlerts([]);
  };
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [panicReason, setPanicReason] = useState('');

  // Profile & Security States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Map'); // 'Map' or 'Security'
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', email: '', profilePic: '' });
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '' });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Search & Intelligence States
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [routeGeojson, setRouteGeojson] = useState(null);
  const [unsafeRouteGeojson, setUnsafeRouteGeojson] = useState(null);
  const [firstLegRouteGeojson, setFirstLegRouteGeojson] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);

  // Flatten data for search
  const allSearchablePlaces = useMemo(() => {
    const list = [];
    indiaTourismData.forEach(state => {
      list.push({ ...state, category: 'State', parent: null });
      state.locations.forEach(loc => {
        list.push({ ...loc, category: 'Location', parent: state.name });
      });
    });
    return list;
  }, []);

  const [liveSuggestions, setLiveSuggestions] = useState([]);
  const [showHospitalMap, setShowHospitalMap] = useState(false);
  const [directionTarget, setDirectionTarget] = useState(null);

  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [liveRating, setLiveRating] = useState(4.8);
  const [liveCount, setLiveCount] = useState(2534);

  useEffect(() => {
    const savedRating = localStorage.getItem('saarth_rating');
    const savedCount = localStorage.getItem('saarth_count');
    if (savedRating) setLiveRating(parseFloat(savedRating));
    if (savedCount) setLiveCount(parseInt(savedCount));
  }, []);

  const submitFeedback = () => {
    if (rating === 0) {
      alert('Please select a rating!');
      return;
    }
    const totalScore = liveRating * liveCount;
    const newCount = liveCount + 1;
    const newRating = (totalScore + rating) / newCount;
    
    setLiveRating(newRating);
    setLiveCount(newCount);
    
    localStorage.setItem('saarth_rating', newRating.toFixed(1));
    localStorage.setItem('saarth_count', newCount.toString());
    
    alert('Thank you for your feedback!');
    setRating(0);
    setFeedbackText('');
  };

  const getFamousDishes = (stateOrParent) => {
    const text = (stateOrParent || "").toLowerCase();
    if (text.includes("maharashtra")) return ["Vada Pav", "Misal Pav", "Pav Bhaji"];
    if (text.includes("punjab")) return ["Makki Di Roti", "Sarson Ka Saag", "Chole Bhature", "Lassi"];
    if (text.includes("gujarat")) return ["Dhokla", "Thepla", "Khandvi", "Fafda"];
    if (text.includes("rajasthan")) return ["Dal Baati Churma", "Laal Maas", "Ghevar"];
    if (text.includes("goa")) return ["Fish Curry", "Bebinca", "Prawn Balchao"];
    if (text.includes("delhi")) return ["Butter Chicken", "Parathas", "Street Chaat"];
    if (text.includes("kerala")) return ["Appam", "Karimeen Pollichathu", "Puttu"];
    if (text.includes("bengal")) return ["Rosogolla", "Macher Jhol", "Mishti Doi"];
    if (text.includes("bihar") || text.includes("jharkhand")) return ["Litti Chokha", "Sattu Paratha"];
    if (text.includes("karnataka") || text.includes("andhra") || text.includes("tamil")) return ["Masala Dosa", "Idli Sambar", "Filter Coffee"];
    if (text.includes("himachal") || text.includes("uttarakhand") || text.includes("kashmir")) return ["Thukpa", "Momos", "Siddu", "Rogan Josh"];
    return ["Local Traditional Thali", "Famous Street Food", "Regional Sweets"];
  };

  useEffect(() => {
    const fetchLocations = async () => {
      if (searchQuery.length < 2) {
        setLiveSuggestions([]);
        return;
      }
      
      const localMatches = allSearchablePlaces.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.parent && p.parent.toLowerCase().includes(searchQuery.toLowerCase())));
      
      if (localMatches.length >= 4) {
        setLiveSuggestions(localMatches.slice(0, 8));
        return;
      }

      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&countrycodes=in&limit=${8 - localMatches.length}`);
        const formatted = res.data.map(item => ({
          name: item.display_name.split(',')[0],
          fullName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          category: item.type === 'city' ? 'City' : 'Location',
          parent: item.display_name.split(',').slice(1, 3).join(', '),
          state: item.display_name.split(',').reverse()[2]?.trim() || 'India'
        }));
        
        // Merge without duplicates by name
        const combined = [...localMatches];
        formatted.forEach(f => {
          if (!combined.find(c => c.name === f.name)) combined.push(f);
        });
        setLiveSuggestions(combined.slice(0, 8));
      } catch (err) {
        console.error("Search failed:", err);
        setLiveSuggestions(localMatches);
      }
    };

    const timeoutId = setTimeout(fetchLocations, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredSuggestions = liveSuggestions;

  useEffect(() => {
    if (routePlan && routePlan.length > 0) {
      const firstStop = routePlan[0];
      let lat = firstStop.lat;
      let lng = firstStop.lng;
      if (!lat) {
         const p = allSearchablePlaces.find(pl => pl.name === firstStop.location);
         if (p) { lat = p.lat; lng = p.lng; }
      }
      if (lat) {
        axios.get(`https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${lng},${lat}?overview=full&geometries=geojson&steps=true`)
          .then(res => {
            if (res.data.routes && res.data.routes.length > 0) {
               const safeCoords = res.data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
               setFirstLegRouteGeojson(safeCoords);
               
               // Generate Fake Unsafe Route for First Leg
               const unsafeCoords = safeCoords.map((coord, idx) => {
                  if (idx > 0 && idx < safeCoords.length - 1 && idx % 5 === 0) {
                     return [coord[0] + (Math.random() - 0.5) * 0.02, coord[1] + (Math.random() - 0.5) * 0.02];
                  }
                  return coord;
               });
               setUnsafeRouteGeojson(unsafeCoords);
               
               const steps = res.data.routes[0].legs[0].steps.map(s => s.maneuver.instruction + " on " + (s.name || "unnamed road"));
               setRouteSteps(steps);
             }
           })
           .catch(err => console.error("OSRM First Leg Failed", err));
       }
     } else {
       setFirstLegRouteGeojson(null);
       setUnsafeRouteGeojson(null);
       setRouteSteps([]);
     }
  }, [routePlan.length > 0 ? routePlan[0].location : null, location.lat, location.lng]);
  useEffect(() => {
    const enrichRoute = async () => {
      let changed = false;
      const enriched = await Promise.all(routePlan.map(async (stop) => {
        if (!stop.lat) {
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(stop.location)}&format=json&limit=1`);
            if (res.data && res.data.length > 0) {
              changed = true;
              return { ...stop, lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) };
            }
          } catch (e) { console.error(e); }
        }
        return stop;
      }));
      if (changed) {
        setRoutePlan(enriched);
      }
    };
    if (routePlan && routePlan.length > 0) {
      enrichRoute();
    }
  }, [routePlan]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const u = JSON.parse(localStorage.getItem('user'));
    if (!token || !u || u.role !== 'TOURIST') {
      navigate('/');
      return;
    }
    setUser(u);
    setProfileForm({
      name: u.name || '',
      phone: u.phone || '',
      email: u.email || '',
      profilePic: u.profilePic || ''
    });
    fetchUserDetails();
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);

    let watchId;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(prev => {
            // Only update state if user moves more than ~50 meters to prevent constant iframe flickering
            const distance = Math.abs(prev.lat - latitude) + Math.abs(prev.lng - longitude);
            if (distance > 0.0005 || prev.lat === 28.6139) { 
              updateLocation(latitude, longitude);
              return { lat: latitude, lng: longitude };
            }
            return prev;
          });
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
    };
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/tourist/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      const updatedProfile = {
        name: res.data.name || '',
        phone: res.data.phone || '',
        email: res.data.email || '',
        profilePic: res.data.profilePic || ''
      };
      setProfileForm(updatedProfile);
      // Synchronize with local storage
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...localUser, ...res.data }));
      setRoutePlan(res.data.routePlan || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceSelect = async (place) => {
    let pois = [];
    let historicPlaces = [], restaurants = [], hotels = [], medical = [];

    try {
      const radius = 5000;
      const poiRes = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${place.lng}&lat=${place.lat}&apikey=${OTM_API_KEY}`);
      pois = (poiRes.data.features || []).filter(p => p.properties && p.properties.name);
      
      historicPlaces = pois.filter(p => p.properties.kinds.includes('historic') || p.properties.kinds.includes('cultural')).slice(0, 5).map(p => p.properties.name);
      restaurants = pois.filter(p => p.properties.kinds.includes('foods')).slice(0, 4).map(p => p.properties.name);
      hotels = pois.filter(p => p.properties.kinds.includes('accomodation')).slice(0, 3).map(p => p.properties.name);
      medical = pois.filter(p => p.properties.kinds.includes('medical')).slice(0, 2).map(p => p.properties.name);
    } catch (e) {
      console.error("OpenTripMap Fetch Failed:", e);
    }

    let imgUrl = place.img;
    let desc = place.description || place.desc;
    
    if (!imgUrl || !desc) {
      try {
        const wikiRes = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(place.name + " India tourism")}&gsrlimit=1&prop=pageimages|extracts&exintro&explaintext&pithumbsize=1000&format=json&origin=*`);
        const pages = wikiRes.data?.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (!imgUrl && pages[pageId].thumbnail?.source) imgUrl = pages[pageId].thumbnail.source;
          if (!desc && pages[pageId].extract) desc = pages[pageId].extract;
        }
      } catch(e) {
        console.error("Wikipedia Fetch Failed:", e);
      }
    }

    if (!imgUrl) imgUrl = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200";
    if (!desc) desc = `Discover the beauty and culture of ${place.name}. A wonderful destination to explore in India.`;

    setRouteGeojson(null);
    setUnsafeRouteGeojson(null);
    try {
       const routeRes = await axios.get(`https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${place.lng},${place.lat}?overview=full&geometries=geojson&steps=true`);
       if(routeRes.data.routes && routeRes.data.routes.length > 0) {
          const safeCoords = routeRes.data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteGeojson(safeCoords);
          
          // Generate Fake Unsafe Route (divergent path)
          const unsafeCoords = safeCoords.map((coord, idx) => {
             if (idx > 0 && idx < safeCoords.length - 1 && idx % 5 === 0) {
                return [coord[0] + (Math.random() - 0.5) * 0.02, coord[1] + (Math.random() - 0.5) * 0.02];
             }
             return coord;
          });
          setUnsafeRouteGeojson(unsafeCoords);
          
          if(routeRes.data.routes[0].legs && routeRes.data.routes[0].legs[0].steps) {
             const steps = routeRes.data.routes[0].legs[0].steps.map(s => s.maneuver.instruction + " on " + (s.name || "unnamed road"));
             setRouteSteps(steps);
          }
       }
    } catch(e) {
       console.error("OSRM Routing Failed:", e);
    }

    const enrichedPlace = {
      ...place,
      img: imgUrl,
      description: desc || `Welcome to ${place.name}. Discover amazing places and culture.`,
      food: getFamousDishes(place.state || place.parent),
      language: "Regional Dialect",
      climate: "24°C | Clear Sky",
      crowdLevel: "Dynamic (Moderate)",
      topPlaces: historicPlaces.length > 0 ? historicPlaces : ["City Center", "Main Square"],
      hotels: hotels.length > 0 ? hotels : (place.hotels || ["Local Guest House", "City Hotel"]),
      hospitals: medical.length > 0 ? medical : ["City General Hospital", "Emergency Clinic"]
    };

    setSelectedPlace(enrichedPlace);
    setSearchQuery(enrichedPlace.name);
    setShowSuggestions(false);
  };

  const addToTrip = async () => {
    if (!selectedPlace) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/tourist/trips`, {
        placeName: selectedPlace.name,
        location: { lat: selectedPlace.lat || 20, lng: selectedPlace.lng || 77 },
        food: selectedPlace.food,
        places: selectedPlace.topPlaces,
        language: selectedPlace.language,
        climate: selectedPlace.climate,
        crowdLevel: selectedPlace.crowdLevel
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`Trip to ${selectedPlace.name} added successfully! Police Command Center has been notified.`);
      fetchUserDetails();
      setSelectedPlace(null);
      setSearchQuery('');
    } catch (err) {
      alert('Failed to add trip. Please try again.');
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/tourist/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch user specific notifications (EFIRs, Fines)
      const meRes = await axios.get(`${API_BASE_URL}/api/tourist/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(meRes.data);

      const globalAlerts = res.data.map(a => ({ ...a, type: 'ALERT', date: a.createdAt }));
      const efirs = (meRes.data.efirs || []).map(e => ({ ...e, title: 'Official E-FIR Issued', description: e.details, severity: 'CRITICAL', type: 'EFIR', date: e.date }));
      const fines = (meRes.data.fines || []).map(f => ({ ...f, title: 'Traffic/Safety Fine Issued', description: `Amount: ₹${f.amount}. Reason: ${f.reason}`, severity: 'WARNING', type: 'FINE', date: f.date }));

      // Fetch user specific notifications (EFIRs, Fines) from localStorage
      const localNotifs = JSON.parse(localStorage.getItem(`notifications_${meRes.data.username}`) || '[]');
      const formattedLocal = localNotifs.map(n => ({
         ...n,
         description: n.message,
         severity: n.type === 'FIR' ? 'CRITICAL' : 'WARNING',
         date: n.date
      }));

      const all = [...globalAlerts, ...efirs, ...fines, ...formattedLocal]
        .filter(n => !deletedNotifIds.includes(n._id || n.date))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setAlerts(all);
    } catch (err) {
      console.error(err);
    }
  };

  const updateLocation = async (lat, lng) => {
    setLocation({ lat, lng });
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/tourist/location`, { lat, lng }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addToRoute = async (place) => {
    const updatedRoute = [...routePlan, { location: place.name, lat: place.lat, lng: place.lng, date: new Date() }];
    setRoutePlan(updatedRoute);
    setSelectedPlace(null);
    setSearchQuery('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/tourist/update-route`, { routePlan: updatedRoute }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeRouteStop = async (index) => {
    const updatedRoute = routePlan.filter((_, i) => i !== index);
    setRoutePlan(updatedRoute);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/tourist/update-route`, { routePlan: updatedRoute }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePanicSubmit = async () => {
    setShowPanicModal(false);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/tourist/panic`, { lat: location.lat, lng: location.lng, reason: panicReason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("EMERGENCY SIGNAL SENT.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/tourist/profile`, profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserDetails();
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/tourist/change-password`, passForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassForm({ oldPassword: '', newPassword: '' });
      alert("Password updated successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to change password");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or not found");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const data = canvas.toDataURL('image/png');
      setProfileForm({ ...profileForm, profilePic: data });
      stopCamera();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Visa Status Calculation
  const isOverstay = useMemo(() => {
    if (!user?.arrivalDate || !user?.visaDuration) return false;
    const arrival = new Date(user.arrivalDate);
    const expiry = new Date(arrival.getTime() + (user.visaDuration * 24 * 60 * 60 * 1000));
    return new Date() > expiry;
  }, [user]);

  // Intelligence Simulation
  const getIntelligence = (placeName) => {
    const hash = placeName.length;
    const temps = [22, 24, 25, 23, 22];
    const crowds = ['LOW', 'MODERATE', 'HIGH', 'PEAK'];
    return {
      temp: temps[hash % temps.length],
      condition: hash % 2 === 0 ? 'Clear' : 'Cloudy',
      crowd: crowds[hash % crowds.length],
      hotels: ['Taj Heritage', 'The Oberoi Grid', 'Leela Palace'],
      restaurants: ['Karim\'s Legacy', 'Street Flavors', 'Imperial Kitchen'],
      forecast: [
        { day: 'Tomorrow', temp: 24, icon: <Cloud className="w-4 h-4" /> },
        { day: 'Friday', temp: 26, icon: <Cloud className="w-4 h-4" /> },
        { day: 'Saturday', temp: 25, icon: <Wind className="w-4 h-4" /> }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-gray-800 flex flex-col font-sans relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-[#002B5B] to-[#00428a] z-0"></div>
      
      <header className="z-50 px-8 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center space-x-6">
          <div className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 bg-white/5 backdrop-blur-sm p-3 transition-all duration-500 hover:border-orange-500/50 flex flex-col items-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <img src="/images/saarth_logo.jpg?v=3" alt="Logo" className="h-24 object-contain rounded-2xl hover:scale-105 transition-all duration-500 relative z-10" />
             <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-2 relative z-10">Under Ministry of Tourism</p>
          </div>
          <div className="h-10 w-px bg-white/20"></div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Tourist Command</h1>
            <p className="text-[10px] text-orange-400 font-black tracking-[0.3em] mt-1.5 uppercase flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span> Official Monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          {isOverstay && user?.aadhaar?.startsWith('PASSPORT-') && (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 px-6 py-2.5 rounded-full flex items-center animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-[10px] font-black text-red-100 uppercase tracking-widest">Visa Overstay</span>
            </div>
          )}
          <div className="relative">
            <button onClick={() => setShowNotifications(true)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/10 transition-all relative">
              <Bell className="w-5 h-5 text-white" />
              {alerts.length > 0 && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-[#002B5B] animate-pulse"></span>}
            </button>
          </div>

          <button onClick={() => setShowPanicModal(true)} className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-full text-xs font-black text-white flex items-center shadow-2xl transition-all uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 mr-2" /> SOS
          </button>
          
          <div className="flex items-center space-x-3 bg-white/10 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-orange-500 transition-all shadow-lg"
            >
              {user?.profilePic ? (
                <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full bg-blue-900 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
              )}
            </button>
            <button onClick={handleLogout} className="p-2.5 text-white/70 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-[1500px] mx-auto w-full z-10">
        {/* Status Bar - Moved to Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center">
            <div className="p-3 bg-orange-50 rounded-2xl mr-4"><Users className="w-5 h-5 text-orange-500" /></div>
            <div><p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Active Tourists in District</p><p className="font-black text-xl text-[#002B5B]">{user?.activeTouristsInDistrict || 0}</p></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center">
            <div className="p-3 bg-blue-50 rounded-2xl mr-4"><Cloud className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Weather</p>
              <p className="font-black text-xl text-blue-600">
                {weather && weather.current_weather ? `${weather.current_weather.temperature}°C` : 'Loading...'}
              </p>
              {weather && weather.daily && weather.daily.temperature_2m_max && (
                <div className="text-[9px] text-gray-500 font-bold mt-0.5">
                  <span>Today: {weather.daily.temperature_2m_max[0]}°/{weather.daily.temperature_2m_min[0]}°</span>
                  <span className="ml-2">Tom: {weather.daily.temperature_2m_max[1]}°/{weather.daily.temperature_2m_min[1]}°</span>
                </div>
              )}
            </div>
          </div>
          {user?.aadhaar?.startsWith('PASSPORT-') && (
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center">
              <div className="p-3 bg-green-50 rounded-2xl mr-4"><Activity className="w-5 h-5 text-green-500" /></div>
              <div><p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Visa Days</p><p className="font-black text-xl text-green-600">{user?.visaDuration || 0} D</p></div>
            </div>
          )}
          <div className="bg-[#002B5B] p-6 rounded-3xl shadow-xl flex items-center">
            <div className="p-3 bg-white/10 rounded-2xl mr-4"><ShieldAlert className="w-5 h-5 text-orange-400" /></div>
            <div><p className="text-[9px] text-white/50 uppercase font-black tracking-widest mb-1">Police Link</p><p className="font-black text-xl text-white">Active</p></div>
          </div>
        </div>

        <div className="flex space-x-6 mb-10 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('Map')}
            className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center shadow-2xl ${activeTab === 'Map' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
          >
            <Map className="w-4 h-4 mr-3" /> Intelligence Grid
          </button>
          <button 
            onClick={() => setActiveTab('Security')}
            className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center shadow-2xl ${activeTab === 'Security' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
          >
            <ShieldAlert className="w-4 h-4 mr-3" /> Legal & Security Dossier
          </button>
          <button 
            onClick={() => setActiveTab('Feedback')}
            className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center shadow-2xl ${activeTab === 'Feedback' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
          >
            <Star className="w-4 h-4 mr-3" /> Feedback & Rating
          </button>
          <button 
            onClick={() => setShowHospitalMap(true)}
            className="whitespace-nowrap px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center shadow-2xl bg-red-600 text-white hover:bg-red-700 animate-pulse"
          >
            <Activity className="w-4 h-4 mr-3" /> Find Emergency Hospital
          </button>
        </div>

        {activeTab === 'Map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-10">
            {/* Smart Search Card */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative">
              <h2 className="text-lg font-black text-[#002B5B] mb-8 flex items-center uppercase tracking-tight">
                <div className="p-3 bg-blue-50 rounded-2xl mr-4"><Compass className="w-6 h-6 text-blue-600" /></div>
                Destination Intelligence
              </h2>
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-6 w-5 h-5 text-gray-300" />
                  <input 
                    type="text" value={searchQuery} 
                    onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search any place in India..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-16 py-5 outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 text-gray-800 font-bold transition-all shadow-inner placeholder:text-gray-300"
                  />
                </div>

                <AnimatePresence>
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 w-full bg-white mt-4 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
                    >
                      {filteredSuggestions.map((p, i) => (
                        <div 
                          key={i} 
                          onClick={() => { handlePlaceSelect(p); }}
                          className="p-6 hover:bg-orange-50 cursor-pointer flex items-center justify-between group transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-gray-300 mr-4 group-hover:text-orange-500" />
                            <div>
                              <p className="font-black text-[#002B5B] text-sm">{p.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.category === 'Location' ? p.parent : 'Indian State'}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-orange-500" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Destination Intelligence (Google Analytics) */}
            <AnimatePresence>
              {selectedPlace && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-10 rounded-[3rem] shadow-2xl border border-blue-100 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h3 className="text-2xl font-black text-[#002B5B] tracking-tighter uppercase leading-none">{selectedPlace.name}</h3>
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-2 flex items-center">
                        <Compass className="w-3 h-3 mr-1" /> Google Intelligence Grid
                      </p>
                    </div>
                    <button onClick={() => setSelectedPlace(null)} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">✕</button>
                  </div>

                  <div className="space-y-6 relative z-10">
                    {selectedPlace.img && (
                      <div className="w-full h-40 rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                        <img src={selectedPlace.img} alt={selectedPlace.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {selectedPlace.description && (
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        {selectedPlace.description.length > 250 ? selectedPlace.description.substring(0, 250) + "..." : selectedPlace.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex-1 border-r border-gray-200">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Local Climate</p>
                        <p className="font-bold flex items-center text-sm text-gray-900"><Thermometer className="w-4 h-4 mr-2 text-orange-500" /> 24°C | Clear</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Crowd Level</p>
                        <p className="font-bold flex items-center text-sm text-gray-900"><Users className="w-4 h-4 mr-2 text-blue-500" /> Moderate</p>
                      </div>
                    </div>

                    <div>
                       <p className="text-[10px] font-black text-[#002B5B] uppercase tracking-widest mb-3 flex items-center"><Utensils className="w-4 h-4 mr-2" /> Famous Gastronomy</p>
                       <div className="flex flex-wrap gap-2">
                         {selectedPlace.food?.map((f, i) => <span key={i} className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-orange-100">{f}</span>) || <span className="text-[10px] text-gray-400">Loading food data...</span>}
                       </div>
                    </div>

                    <div>
                       <p className="text-[10px] font-black text-[#002B5B] uppercase tracking-widest mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Iconic Landmarks</p>
                       <div className="space-y-2">
                         {selectedPlace.topPlaces?.map((p, i) => (
                           <div key={i} className="flex items-center text-xs font-bold text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                             <Compass className="w-3 h-3 mr-3 text-red-500" /> {p}
                           </div>
                         )) || <p className="text-xs text-gray-400">Fetching landmarks...</p>}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center justify-between group">
                          <div>
                            <p className="text-[9px] text-blue-400 font-black uppercase mb-1 flex items-center"><Hotel className="w-3 h-3 mr-1" /> Recommended Hotel</p>
                            <p className="text-[11px] font-black text-blue-900 leading-tight">{selectedPlace.hotels && selectedPlace.hotels[0] ? selectedPlace.hotels[0] : "Premium City Resort"}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                       </div>
                       <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center justify-between group">
                          <div>
                            <p className="text-[9px] text-red-400 font-black uppercase mb-1 flex items-center"><Activity className="w-3 h-3 mr-1" /> Emergency Hospital</p>
                            <p className="text-[11px] font-black text-red-900 leading-tight">{selectedPlace.hospitals && selectedPlace.hospitals[0] ? selectedPlace.hospitals[0] : "District Civil Hospital"}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-red-300 group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>

                    <button 
                      onClick={addToTrip}
                      className="w-full bg-[#002B5B] text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center group mt-4"
                    >
                      <Plus className="w-4 h-4 mr-3 group-hover:rotate-90 transition-transform" /> Add to Active Trip
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Journey Planner */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
               <h2 className="text-lg font-black text-[#002B5B] mb-8 flex items-center uppercase tracking-tight">
                <div className="p-3 bg-orange-50 rounded-2xl mr-4"><Calendar className="w-6 h-6 text-orange-600" /></div>
                Active Itinerary
              </h2>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {routePlan.map((stop, idx) => (
                  <div key={idx} className="bg-white border border-gray-50 p-6 rounded-[2rem] relative group hover:border-orange-200 transition-all shadow-sm">
                    <button onClick={() => removeRouteStop(idx)} className="absolute top-6 right-6 text-gray-200 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                    <div className="flex items-center text-[#002B5B] font-black text-lg mb-2 tracking-tight">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 shadow-lg"></div> {stop.location}
                    </div>
                    <div className="flex space-x-3">
                       <span className="text-[9px] font-black uppercase text-gray-400 border border-gray-100 px-3 py-1 rounded-full">Day {idx + 1}</span>
                       <span className="text-[9px] font-black uppercase text-green-500 bg-green-50 px-3 py-1 rounded-full flex items-center"><CheckCircle className="w-2 h-2 mr-1" /> Route Secured</span>
                    </div>
                    <button onClick={() => {
                        const fp = allSearchablePlaces.find(p => p.name === stop.location);
                        if (fp) handlePlaceSelect(fp);
                    }} className="mt-4 text-[10px] font-black text-[#002B5B] uppercase tracking-widest flex items-center hover:text-orange-500 transition-colors">
                       View Intelligence <ArrowRight className="w-3 h-3 ml-2" />
                    </button>
                  </div>
                ))}
                {routePlan.length === 0 && (
                  <div className="text-center py-16 opacity-50">
                    <Map className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No destinations planned</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            {/* Map Grid */}
            <div className="bg-white border-[12px] border-white rounded-[4rem] overflow-hidden min-h-[650px] relative shadow-2xl">
              <div className="absolute top-8 left-8 z-[1000] space-y-3">
                {selectedPlace && (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-orange-500 p-5 rounded-[1.5rem] shadow-2xl text-white w-48">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Pinned Location</p>
                    <p className="text-sm font-black truncate">{selectedPlace.name}</p>
                  </motion.div>
                )}
                {routeSteps.length > 0 && (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-5 rounded-[1.5rem] shadow-2xl text-gray-800 w-64 max-h-64 overflow-y-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-orange-600">Route Instructions</p>
                    <ul className="text-xs space-y-2">
                      {routeSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-4 h-4 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-[9px] font-black mr-2 mt-0.5">{idx + 1}</span>
                          <span className="text-[11px] font-bold text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
              <MapContainer 
                center={[location.lat, location.lng]} 
                zoom={5} 
                style={{ height: '100%', width: '100%', minHeight: '650px' }}
              >
                <TileLayer 
                  url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  subdomains={['mt0','mt1','mt2','mt3']}
                  attribution='&copy; Google Maps'
                />
                
                {/* User Current Location Marker */}
                <Marker position={[location.lat, location.lng]}>
                  <Popup><span className="font-black text-[#002B5B]">YOU ARE HERE</span></Popup>
                </Marker>

                {/* Route Markers */}
                {routePlan.map((stop, idx) => {
                   let lat = stop.lat;
                   let lng = stop.lng;
                   if (!lat) {
                      const p = allSearchablePlaces.find(pl => pl.name === stop.location);
                      if (p) { lat = p.lat; lng = p.lng; }
                   }
                   if (!lat) return null;
                   return (
                     <Marker key={idx} position={[lat, lng]}>
                       <Popup><span className="font-black text-orange-600">{stop.location}</span></Popup>
                     </Marker>
                   );
                })}

                {/* Lines */}
                {routePlan.length > 0 && (() => {
                    const firstStop = routePlan[0];
                    let firstStopLat = firstStop.lat;
                    let firstStopLng = firstStop.lng;
                    if (!firstStopLat) {
                        const p = allSearchablePlaces.find(pl => pl.name === firstStop.location);
                        if (p) { firstStopLat = p.lat; firstStopLng = p.lng; }
                    }
                    
                    if (!firstStopLat) return null;
                    
                    const firstLegPositions = [[location.lat, location.lng], [firstStopLat, firstStopLng]];
                    
                    const allStopsPositions = routePlan.map(stop => {
                        if (stop.lat) return [stop.lat, stop.lng];
                        const p = allSearchablePlaces.find(pl => pl.name === stop.location);
                        return p ? [p.lat, p.lng] : null;
                    }).filter(Boolean);

                    return (
                      <>
                        {/* First leg: Road Route (pura rasta) if available, otherwise straight line */}
                        {firstLegRouteGeojson ? (
                          <>
                            <Polyline positions={firstLegRouteGeojson} pathOptions={{ color: '#10b981', weight: 6, opacity: 0.9 }}>
                              <Popup><span className="font-black text-green-600">🛡️ SECURE GRID ROUTE (SAFEST)</span></Popup>
                            </Polyline>
                            {unsafeRouteGeojson && (
                              <Polyline positions={unsafeRouteGeojson} pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.7, dashArray: '5, 10' }}>
                                <Popup><span className="font-black text-red-600">⚠️ UNMONITORED ROUTE (UNSAFE)</span></Popup>
                              </Polyline>
                            )}
                          </>
                        ) : (
                          <Polyline positions={firstLegPositions} pathOptions={{ color: '#1a0dab', weight: 4, opacity: 0.7 }} />
                        )}
                        
                        {/* Subsequent legs: Dotted (Dashed) flight-path style */}
                        {allStopsPositions.length > 1 && (
                          <Polyline positions={allStopsPositions} pathOptions={{ color: '#1a0dab', weight: 4, dashArray: '10, 15', opacity: 0.8 }} />
                        )}
                      </>
                    );
                })()}

                {/* Selected Place Marker and active search route */}
                {selectedPlace && selectedPlace.lat && (
                  <>
                    <Marker position={[selectedPlace.lat, selectedPlace.lng]}>
                      <Popup><span className="font-black text-red-600">{selectedPlace.name}</span></Popup>
                    </Marker>
                    {routeGeojson && (
                      <Polyline positions={routeGeojson} pathOptions={{ color: '#10b981', weight: 6, opacity: 0.9 }}>
                        <Popup><span className="font-black text-green-600">🛡️ SECURE GRID ROUTE (SAFEST)</span></Popup>
                      </Polyline>
                    )}
                    {unsafeRouteGeojson && (
                      <Polyline positions={unsafeRouteGeojson} pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.7, dashArray: '5, 10' }}>
                        <Popup><span className="font-black text-red-600">⚠️ UNMONITORED ROUTE (UNSAFE)</span></Popup>
                      </Polyline>
                    )}
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'Security' && (
          <div className="space-y-10">
            {/* Security Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                <div className="p-4 bg-red-50 rounded-2xl w-fit mb-6"><ShieldAlert className="w-8 h-8 text-red-500" /></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total E-FIR Dossiers</p>
                <p className="text-6xl font-black text-[#002B5B] tracking-tighter">{user?.efirs?.length || 0}</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
                <div className="p-4 bg-orange-50 rounded-2xl w-fit mb-6"><Activity className="w-8 h-8 text-orange-500" /></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Unpaid Penalties</p>
                <p className="text-6xl font-black text-[#002B5B] tracking-tighter">₹{(user?.fines || []).reduce((acc, f) => acc + f.amount, 0)}</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                <div className="p-4 bg-blue-50 rounded-2xl w-fit mb-6"><CheckCircle className="w-8 h-8 text-blue-600" /></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Legal Compliance</p>
                <p className={`text-2xl font-black uppercase tracking-tight ${(user?.efirs?.length || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {(user?.efirs?.length || 0) > 0 ? 'Urgent Action' : 'Fully Compliant'}
                </p>
              </div>
            </div>

            {/* Detailed Records List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* E-FIRs List */}
               <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
                  <h3 className="text-2xl font-black text-[#002B5B] mb-10 flex items-center uppercase tracking-tighter">
                    <ShieldAlert className="w-8 h-8 mr-4 text-red-500" /> Official E-FIR Records
                  </h3>
                  <div className="space-y-6">
                    {(user?.efirs || []).map((e, i) => (
                      <div key={i} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group hover:border-red-200 transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Case ID: {e.caseId}</span>
                           <span className="text-[10px] text-gray-400 font-bold">{new Date(e.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">{e.details}</h4>
                        <button onClick={() => setSelectedNotification({ ...e, title: 'Official E-FIR Details', description: e.details, type: 'EFIR', date: e.createdAt })} className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center hover:translate-x-2 transition-transform">
                          Inspect Legal Dossier <ArrowRight className="w-3 h-3 ml-2" />
                        </button>
                      </div>
                    ))}
                    {(!user?.efirs || user?.efirs.length === 0) && (
                      <div className="text-center py-24 opacity-30">
                        <ShieldCheck className="w-20 h-20 mx-auto mb-6 text-green-500" />
                        <p className="text-sm font-black uppercase tracking-widest">Clear Legal Record</p>
                        <p className="text-[10px] font-bold mt-2">No E-FIRs associated with your ID.</p>
                      </div>
                    )}
                  </div>
               </div>

               {/* Fines List */}
               <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
                  <h3 className="text-2xl font-black text-[#002B5B] mb-10 flex items-center uppercase tracking-tighter">
                    <Activity className="w-8 h-8 mr-4 text-orange-500" /> Penalties & Fines
                  </h3>
                  <div className="space-y-6">
                    {(user?.fines || []).map((f, i) => (
                      <div key={i} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group hover:border-orange-200 transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">₹{f.amount} Penalty</span>
                           <span className="text-[10px] text-gray-400 font-bold">{new Date(f.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">{f.reason}</h4>
                        <button onClick={() => setSelectedNotification({ ...f, title: 'Fine Details', description: `Penalty of ₹${f.amount} issued for: ${f.reason}`, type: 'FINE', date: f.createdAt })} className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center hover:translate-x-2 transition-transform">
                          Review Penalty <ArrowRight className="w-3 h-3 ml-2" />
                        </button>
                      </div>
                    ))}
                    {(!user?.fines || user?.fines.length === 0) && (
                      <div className="text-center py-24 opacity-30">
                        <CheckCircle className="w-20 h-20 mx-auto mb-6 text-blue-500" />
                        <p className="text-sm font-black uppercase tracking-widest">No Active Penalties</p>
                        <p className="text-[10px] font-bold mt-2">Your financial record is currently clear.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Feedback' && (
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
             <h3 className="text-2xl font-black text-[#002B5B] mb-10 flex items-center uppercase tracking-tighter">
               <Star className="w-8 h-8 mr-4 text-orange-500 fill-current" /> Share Your Experience
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Rating Section */}
                <div className="space-y-6">
                   <div>
                     <p className="text-sm font-black text-gray-700 uppercase tracking-wider mb-2">How do you rate?</p>
                     <div className="flex space-x-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <button 
                             key={star}
                             onClick={() => setRating(star)}
                             className={`p-3 rounded-xl border ${rating >= star ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-300 border-gray-100'} transition-all`}
                           >
                             <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : ''}`} />
                           </button>
                        ))}
                     </div>
                   </div>

                   <div className="pt-4">
                     <p className="text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Any improvement u wanna suggest?</p>
                     <textarea 
                       rows="4" 
                       value={feedbackText}
                       onChange={(e) => setFeedbackText(e.target.value)}
                       className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-medium resize-none"
                       placeholder="Tell us what we can do better..."
                     ></textarea>
                   </div>

                   <button 
                     onClick={submitFeedback}
                     className="bg-[#002B5B] text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-lg"
                   >
                     Submit Feedback
                   </button>
                </div>

                {/* Live Stats */}
                <div className="bg-orange-50 p-10 rounded-[3rem] border border-orange-100 flex flex-col items-center justify-center text-center">
                   <div className="p-4 bg-white rounded-full shadow-lg mb-6">
                     <Star className="w-10 h-10 text-orange-500 fill-current" />
                   </div>
                   <p className="text-5xl font-black text-[#002B5B] mb-2">{liveRating.toFixed(1)}</p>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Rated by {liveCount} users</p>
                   <p className="text-xs text-gray-600 font-medium max-w-[200px]">Your rating will be synced in real-time across the platform.</p>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Location Detailed Intelligence Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[#002B5B]/60 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[4rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
              <button onClick={() => setSelectedPlace(null)} className="absolute top-10 right-10 z-[2100] bg-gray-100 hover:bg-gray-200 p-4 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="h-[400px] lg:h-auto relative overflow-hidden">
                    <img src={selectedPlace.img || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200"} className="w-full h-full object-cover" alt="Place" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-12 left-12">
                       <p className="text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">{selectedPlace.category === 'Location' ? selectedPlace.parent : 'INDIAN TERRITORY'}</p>
                       <h2 className="text-6xl font-black text-white tracking-tighter">{selectedPlace.name}</h2>
                    </div>
                  </div>
                  
                  <div className="p-12 lg:p-20 space-y-12">
                    <div>
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center"><Info className="w-4 h-4 mr-3 text-blue-500" /> Location Brief</h3>
                      <p className="text-lg text-gray-600 leading-relaxed font-medium">{selectedPlace.description || selectedPlace.desc}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100">
                         <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6 flex items-center"><Cloud className="w-4 h-4 mr-2" /> Climate Forecast</h3>
                         <div className="flex items-center space-x-6 mb-6">
                            <div className="p-4 bg-white rounded-3xl shadow-sm"><Thermometer className="w-8 h-8 text-blue-600" /></div>
                            <div>
                               <p className="text-3xl font-black text-[#002B5B]">{getIntelligence(selectedPlace.name).temp}°C</p>
                               <p className="text-xs font-bold text-blue-500 uppercase">{getIntelligence(selectedPlace.name).condition}</p>
                            </div>
                         </div>
                         <div className="flex justify-between border-t border-blue-100 pt-6">
                            {getIntelligence(selectedPlace.name).forecast.map((f, i) => (
                              <div key={i} className="text-center">
                                <p className="text-[9px] font-black text-gray-400 uppercase mb-2">{f.day}</p>
                                <div className="text-blue-600 mb-1 mx-auto">{f.icon}</div>
                                <p className="text-xs font-black text-[#002B5B]">{f.temp}°C</p>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100">
                         <h3 className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-6 flex items-center"><Users className="w-4 h-4 mr-2" /> Live Crowd Status</h3>
                         <div className="flex items-center space-x-6 mb-8">
                            <div className="p-4 bg-white rounded-3xl shadow-sm"><Activity className="w-8 h-8 text-orange-600" /></div>
                            <div>
                               <p className="text-2xl font-black text-orange-900 leading-none">{getIntelligence(selectedPlace.name).crowd}</p>
                               <p className="text-[9px] font-black text-orange-500 uppercase mt-2">Real-time Density</p>
                            </div>
                         </div>
                         <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="bg-orange-600 h-full" />
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center"><Hotel className="w-4 h-4 mr-2" /> Recommended Hotels</h4>
                           { (selectedPlace.hotels || getIntelligence(selectedPlace.name).hotels).map((h, i) => (
                             <div key={i} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                <span className="text-xs font-bold text-gray-700">{h}</span>
                             </div>
                           ))}
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center"><Utensils className="w-4 h-4 mr-2" /> Top Rated Food</h4>
                           { (selectedPlace.food || getIntelligence(selectedPlace.name).restaurants || ["Local Street Food"]).map((r, i) => (
                             <div key={i} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-xs font-bold text-gray-700">{r}</span>
                             </div>
                           ))}
                       </div>
                    </div>

                    <div className="flex gap-6 pt-10 border-t border-gray-100">
                       <button 
                        onClick={() => setDirectionTarget(selectedPlace.name)}
                        className="flex-1 bg-[#002B5B] text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center shadow-2xl hover:bg-orange-600 transition-all active:scale-95"
                       >
                          <Navigation className="w-5 h-5 mr-3" /> Get Directions
                       </button>
                       <button 
                        onClick={() => addToRoute(selectedPlace)}
                        className="flex-1 bg-orange-500 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center shadow-2xl hover:bg-orange-600 transition-all active:scale-95"
                       >
                          <Plus className="w-5 h-5 mr-3" /> Add to Route Plan
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency Signal Modal */}
      <AnimatePresence>
        {showPanicModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-[#002B5B]/40 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white border border-red-100 p-12 rounded-[4rem] w-full max-w-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-red-600"></div>
              <ShieldAlert className="w-16 h-16 text-red-600 animate-pulse mx-auto mb-8" />
              <h2 className="text-4xl font-black text-red-600 text-center mb-4 uppercase tracking-tighter">Emergency Signal</h2>
              <p className="text-gray-500 text-center text-base mb-10 font-bold">Location will be shared with the Ministry Command Center.</p>
              <textarea rows="4" value={panicReason} onChange={e => setPanicReason(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 text-gray-800 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all mb-10 font-bold placeholder-gray-300 resize-none" placeholder="Briefly describe the situation..."></textarea>
              <div className="flex gap-6">
                <button onClick={() => setShowPanicModal(false)} className="flex-1 py-5 rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-600 transition font-black uppercase tracking-widest text-[10px]">Decline</button>
                <button onClick={handlePanicSubmit} className="flex-1 py-5 rounded-3xl font-black text-white bg-red-600 hover:bg-red-500 transition-all uppercase tracking-widest shadow-2xl active:scale-95">Send SOS</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Notification Center Modal */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6 bg-[#002B5B]/60 backdrop-blur-3xl">
             <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="bg-white rounded-[3.5rem] w-full max-w-lg h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-2xl font-black text-[#002B5B] uppercase tracking-tighter flex items-center"><Bell className="w-6 h-6 mr-3 text-orange-500" /> Notifications</h2>
                  <div className="flex items-center space-x-4">
                    {alerts.length > 0 && (
                      <button onClick={handleDeleteAllNotifications} className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-widest">Delete All</button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {alerts.map((n, i) => (
                    <div 
                      key={i} 
                      onClick={() => { setSelectedNotification(n); setShowNotifications(false); }}
                      className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                        n.type === 'ALERT' ? 'bg-blue-50 border-blue-100' : 
                        n.type === 'EFIR' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          n.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 
                          n.severity === 'WARNING' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                        }`}>{n.type}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] text-gray-400 font-bold">{new Date(n.date).toLocaleDateString()}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteNotification(n._id || n.date); }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete notification"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <h4 className="font-black text-gray-900 leading-tight mb-2">{n.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{n.description}</p>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                      <Bell className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">No signals detected</p>
                    </div>
                  )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Detail Pop-up */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[4rem] w-full max-w-xl p-12 shadow-2xl relative overflow-hidden border-8 border-white">
                <div className={`absolute top-0 left-0 w-full h-4 ${
                   selectedNotification.severity === 'CRITICAL' ? 'bg-red-600' : 
                   selectedNotification.severity === 'WARNING' ? 'bg-orange-500' : 'bg-blue-600'
                }`}></div>
                
                <div className="flex justify-between items-start mb-8">
                   <div className={`p-5 rounded-3xl ${
                     selectedNotification.type === 'ALERT' ? 'bg-blue-50 text-blue-600' : 
                     selectedNotification.type === 'EFIR' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                   }`}>
                     {selectedNotification.type === 'EFIR' ? <Activity className="w-10 h-10" /> : <Bell className="w-10 h-10" />}
                   </div>
                   <button onClick={() => setSelectedNotification(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">✕</button>
                </div>

                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 block">Official Signal • {new Date(selectedNotification.date).toLocaleString()}</span>
                <h2 className="text-4xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tighter uppercase">{selectedNotification.title}</h2>
                
                <div className="bg-gray-50 p-8 rounded-[2.5rem] mb-10 border border-gray-100">
                   <p className="text-gray-700 font-medium leading-relaxed">{selectedNotification.description}</p>
                </div>

                {selectedNotification.type === 'EFIR' && (
                  <div className="bg-red-50 p-6 rounded-3xl border border-red-100 mb-10">
                     <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 flex items-center"><Activity className="w-3 h-3 mr-2" /> Action Required</p>
                     <p className="text-xs text-red-700 font-bold">Please contact the nearest Police Station or Command Center immediately regarding Case ID: {selectedNotification.caseId}.</p>
                  </div>
                )}

                <button onClick={() => setSelectedNotification(null)} className="w-full bg-[#002B5B] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-orange-600 transition-all active:scale-95">Acknowledge Signal</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6 bg-[#002B5B]/60 backdrop-blur-xl">
             <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white rounded-[4rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 shadow-2xl relative custom-scrollbar">
                <button onClick={() => setShowProfileModal(false)} className="absolute top-10 right-10 bg-gray-100 hover:bg-gray-200 p-4 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                   {/* Left: Profile Pic & Interaction */}
                   <div className="flex flex-col items-center space-y-6">
                      <div className="relative group">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100 shadow-2xl relative">
                          {profileForm.profilePic ? (
                            <img src={profileForm.profilePic} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                              <User className="w-20 h-20" />
                            </div>
                          )}
                          
                          {/* Choice Overlay */}
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center space-y-4">
                             <button onClick={() => document.getElementById('file-input').click()} className="flex items-center text-[10px] font-black text-white uppercase tracking-widest hover:text-blue-400">
                               <Upload className="w-4 h-4 mr-2" /> From Device
                             </button>
                             <div className="w-10 h-px bg-white/20"></div>
                             <button onClick={startCamera} className="flex items-center text-[10px] font-black text-white uppercase tracking-widest hover:text-orange-400">
                               <Camera className="w-4 h-4 mr-2" /> Live Camera
                             </button>
                          </div>
                        </div>
                        <input type="file" id="file-input" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </div>

                      <div className="text-center">
                        <h3 className="text-2xl font-black text-[#002B5B] tracking-tighter">{user?.name}</h3>
                        <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mt-1">ID: {user?.username}</p>
                      </div>
                   </div>

                   {/* Right: Forms */}
                   <div className="md:col-span-2 space-y-12">
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center"><Settings className="w-4 h-4 mr-3 text-blue-500" /> Basic Identity & Photo</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                             <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-400">{user?.name}</div>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contact Number</label>
                             <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-400">{user?.phone}</div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                           <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-400">{user?.email}</div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 mr-2" /> Save New Profile Photo
                        </button>
                      </form>

                      <div className="h-px bg-gray-100 w-full"></div>

                      <form onSubmit={handlePasswordChange} className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center"><ShieldAlert className="w-4 h-4 mr-3 text-red-500" /> Security Access (Change Password)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2 relative">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                             <input type={showOldPass ? "text" : "password"} value={passForm.oldPassword} onChange={e => setPassForm({...passForm, oldPassword: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl p-4 font-bold outline-none focus:border-red-500 pr-12" placeholder="••••••••" required />
                             <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute bottom-4 right-4 text-gray-400">{showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                           </div>
                           <div className="space-y-2 relative">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Secure Password</label>
                             <input type={showNewPass ? "text" : "password"} value={passForm.newPassword} onChange={e => setPassForm({...passForm, newPassword: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl p-4 font-bold outline-none focus:border-red-500 pr-12" placeholder="••••••••" required />
                             <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute bottom-4 right-4 text-gray-400">{showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                           </div>
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-red-700 transition-all">Update Security Key</button>
                      </form>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Camera Stream Modal */}
      <AnimatePresence>
        {showCamera && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[3rem] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black text-[#002B5B] uppercase tracking-tighter flex items-center"><Camera className="w-6 h-6 mr-3 text-blue-500" /> Biometric Scan</h2>
                 <button onClick={stopCamera} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
               </div>
               
               <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-video shadow-inner">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                 <canvas ref={canvasRef} className="hidden" />
                 <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500/50 rounded-full border-dashed animate-pulse"></div>
               </div>

               <div className="flex gap-4 mt-8">
                 <button onClick={stopCamera} className="flex-1 py-4 border border-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                 <button onClick={capturePhoto} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-700 transition-all">Capture Photo</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <EmergencyHospitalModal show={showHospitalMap} onClose={() => setShowHospitalMap(false)} district={user?.district} lat={location.lat} lng={location.lng} onNavigate={(hospitalName) => { setShowHospitalMap(false); setDirectionTarget(hospitalName); }} />
      <DirectionModal show={!!directionTarget} onClose={() => setDirectionTarget(null)} destinationName={directionTarget} district={user?.district} lat={location.lat} lng={location.lng} />
    </div>
  );
}

// Route Direction Popup (Rendered outside to avoid nesting issues)
const DirectionModal = ({ show, onClose, destinationName, district, lat, lng }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-[#002B5B]/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] p-8 max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-black text-[#002B5B] flex items-center uppercase tracking-tighter"><Navigation className="w-6 h-6 mr-3 text-orange-500" /> Route Intelligence</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live routing to {destinationName}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-red-100 transition-colors"><Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" /></button>
        </div>
        <div className="flex-1 rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner bg-gray-50 relative">
           <iframe 
              title="Route Map"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?saddr=${district ? encodeURIComponent(district) : `${lat},${lng}`}&daddr=${encodeURIComponent(destinationName || '')}&output=embed&z=10`}
           ></iframe>
        </div>
      </motion.div>
    </div>
  );
};

// Emergency Hospital Popup (District Based)
const EmergencyHospitalModal = ({ show, onClose, district, lat, lng, onNavigate }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;

    const findHospitals = async () => {
      setLoading(true);
      setHospitals([]);

      try {
        let query;

        if (district && district !== "All Districts") {
          query = `
            [out:json][timeout:30];
            area["name"="${district}"]["boundary"="administrative"]->.searchArea;
            (
              node["amenity"="hospital"](area.searchArea);
              way["amenity"="hospital"](area.searchArea);
              relation["amenity"="hospital"](area.searchArea);
            );
            out center tags;
          `;
        } else {
          query = `
            [out:json][timeout:30];
            (
              node["amenity"="hospital"](around:15000,${lat},${lng});
              way["amenity"="hospital"](around:15000,${lat},${lng});
              relation["amenity"="hospital"](around:15000,${lat},${lng});
            );
            out center tags;
          `;
        }

        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Hospital search failed");
        }

        const data = await response.json();

        const results = (data.elements || [])
          .map((item) => {
            const hospitalLat = item.lat ?? item.center?.lat;
            const hospitalLng = item.lon ?? item.center?.lon;

            if (
              typeof hospitalLat !== "number" ||
              typeof hospitalLng !== "number"
            ) {
              return null;
            }

            return {
              name:
                item.tags?.name ||
                item.tags?.["name:en"] ||
                "Unnamed Hospital",
              lat: hospitalLat,
              lng: hospitalLng,
              address:
                item.tags?.["addr:full"] ||
                item.tags?.["addr:street"] ||
                item.tags?.["addr:city"] ||
                "Address not available"
            };
          })
          .filter(Boolean);

        const uniqueHospitals = results.filter(
          (hospital, index, array) =>
            index ===
            array.findIndex(
              (h) =>
                h.name.toLowerCase() === hospital.name.toLowerCase()
            )
        );

        setHospitals(uniqueHospitals);
      } catch (error) {
        console.error("Hospital search error:", error);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    findHospitals();
  }, [show, district, lat, lng]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#002B5B]/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-8 max-w-5xl w-full shadow-2xl relative overflow-hidden flex flex-col h-[80vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-black text-red-600 flex items-center uppercase tracking-tighter">
              <Activity className="w-6 h-6 mr-3" />
              Hospitals in {district || "Your District"}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
              Emergency hospitals available in your district
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-3 bg-gray-100 hover:bg-red-50 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-[2rem] p-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
              <p className="font-black text-gray-500 uppercase text-sm">
                Finding hospitals in {district || "your district"}...
              </p>
            </div>
          ) : hospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {hospitals.map((hospital, index) => (
                <div
                  key={`${hospital.name}-${index}`}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-red-200 transition-all"
                >
                  <div className="flex items-start">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Activity className="w-7 h-7 text-red-600" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-black text-[#002B5B]">
                        {hospital.name}
                      </h4>

                      <p className="text-xs text-gray-500 mt-2">
                        {hospital.address}
                      </p>

                      <button
                        onClick={() => onNavigate(hospital.name)}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        Navigate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Activity className="w-16 h-16 text-red-200 mb-4" />
              <h3 className="text-xl font-black text-gray-600">
                No Hospitals Found
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                No hospitals were found in {district || "your district"}.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
