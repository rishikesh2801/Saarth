const mongoose = require('mongoose');
const User = require('../models/User'); 
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/tourist_guard';

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'South Korea', 'Singapore', 'UAE', 'Italy', 'Spain', 'Russia', 'Brazil', 'Mexico'];
const CITIES = ['London', 'New York', 'Paris', 'Tokyo', 'Berlin', 'Seoul', 'Dubai', 'Sydney', 'Toronto', 'Singapore City', 'Rome', 'Madrid', 'Moscow', 'Sao Paulo', 'Mexico City'];

// Extracted from our new indiaTourismData.js
const LOCATIONS = [
  // Andhra Pradesh
  { name: "Tirupati", lat: 13.6288, lng: 79.4192, state: "Andhra Pradesh" },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh" },
  { name: "Vijayawada", lat: 16.5062, lng: 80.6480, state: "Andhra Pradesh" },
  
  // Arunachal Pradesh
  { name: "Tawang", lat: 27.5852, lng: 91.8594, state: "Arunachal Pradesh" },
  { name: "Itanagar", lat: 27.0844, lng: 93.6053, state: "Arunachal Pradesh" },

  // Assam
  { name: "Guwahati", lat: 26.1445, lng: 91.7362, state: "Assam" },
  { name: "Kaziranga", lat: 26.5775, lng: 93.1711, state: "Assam" },
  { name: "Jorhat", lat: 26.7509, lng: 94.2037, state: "Assam" },

  // Bihar
  { name: "Bodh Gaya", lat: 24.6961, lng: 84.9913, state: "Bihar" },
  { name: "Patna", lat: 25.5941, lng: 85.1376, state: "Bihar" },
  { name: "Nalanda", lat: 25.1205, lng: 85.4513, state: "Bihar" },

  // Goa
  { name: "Panaji", lat: 15.4909, lng: 73.8278, state: "Goa" },
  { name: "Calangute", lat: 15.5442, lng: 73.7553, state: "Goa" },
  { name: "Palolem", lat: 15.0100, lng: 74.0232, state: "Goa" },

  // Gujarat
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, state: "Gujarat" },
  { name: "Statue of Unity", lat: 21.8380, lng: 73.7191, state: "Gujarat" },
  { name: "Dwarka", lat: 22.2442, lng: 68.9685, state: "Gujarat" },

  // Karnataka
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, state: "Karnataka" },
  { name: "Mysuru", lat: 12.2958, lng: 76.6394, state: "Karnataka" },
  { name: "Hampi", lat: 15.3350, lng: 76.4600, state: "Karnataka" },

  // Kerala
  { name: "Kochi", lat: 9.9312, lng: 76.2673, state: "Kerala" },
  { name: "Munnar", lat: 10.0889, lng: 77.0595, state: "Kerala" },
  { name: "Wayanad", lat: 11.6854, lng: 76.1320, state: "Kerala" },

  // Maharashtra
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, state: "Maharashtra" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, state: "Maharashtra" },
  { name: "Ajanta Caves", lat: 20.5519, lng: 75.7033, state: "Maharashtra" },

  // Rajasthan
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, state: "Rajasthan" },
  { name: "Udaipur", lat: 24.5854, lng: 73.7125, state: "Rajasthan" },
  { name: "Jodhpur", lat: 26.2389, lng: 73.0243, state: "Rajasthan" },
  { name: "Jaisalmer", lat: 26.9157, lng: 70.9160, state: "Rajasthan" },

  // Tamil Nadu
  { name: "Chennai", lat: 13.0827, lng: 80.2707, state: "Tamil Nadu" },
  { name: "Madurai", lat: 9.9252, lng: 78.1198, state: "Tamil Nadu" },
  { name: "Ooty", lat: 11.4102, lng: 76.6950, state: "Tamil Nadu" },

  // Uttar Pradesh
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh" },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh" },
  { name: "Agra", lat: 27.1767, lng: 78.0081, state: "Uttar Pradesh" },

  // West Bengal
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, state: "West Bengal" },
  { name: "Darjeeling", lat: 27.0410, lng: 88.2627, state: "West Bengal" },
  { name: "Digha", lat: 21.6266, lng: 87.5074, state: "West Bengal" },

  // Adding others with single hubs for brevity but could expand more
  { name: "Shimla", lat: 31.1048, lng: 77.1734, state: "Himachal Pradesh" },
  { name: "Manali", lat: 32.2432, lng: 77.1892, state: "Himachal Pradesh" },
  { name: "Srinagar", lat: 34.0837, lng: 74.8336, state: "Jammu and Kashmir" },
  { name: "Gulmarg", lat: 34.0484, lng: 74.3805, state: "Jammu and Kashmir" },
  { name: "Dehradun", lat: 30.3165, lng: 78.0322, state: "Uttarakhand" },
  { name: "Rishikesh", lat: 30.0869, lng: 78.2676, state: "Uttarakhand" },
  { name: "Leh", lat: 34.1526, lng: 77.5771, state: "Ladakh" },
  { name: "Port Blair", lat: 11.6234, lng: 92.7265, state: "Andaman and Nicobar" }
];

const FIRST_NAMES = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Nancy", "Matthew", "Lisa", "Anthony", "Betty", "Mark", "Margaret", "Donald", "Sandra", "Steven", "Ashley", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna", "Kenneth", "Michelle", "Kevin", "Dorothy", "Brian", "Carol", "George", "Amanda", "Timothy", "Melissa", "Ronald", "Deborah"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing tourists created by seed
    await User.deleteMany({ createdBy: 'SEED_GENERATOR' });

    const totalToSeed = 25544;
    const batchSize = 1000;
    let tourists = [];

    const STATE_DATA = {
      "Andhra Pradesh": { districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Anantapur", "Chittoor", "Kadapa", "Kakinada", "Eluru"], lat: 15.91, lng: 79.74 },
      "Arunachal Pradesh": { districts: ["Itanagar", "Tawang", "Ziro", "Pasighat", "Along"], lat: 28.21, lng: 94.72 },
      "Assam": { districts: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon", "Tinsukia"], lat: 26.2, lng: 92.93 },
      "Bihar": { districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Nalanda", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Munger"], lat: 25.09, lng: 85.31 },
      "Goa": { districts: ["North Goa", "South Goa"], lat: 15.29, lng: 74.12 },
      "Gujarat": { districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Gandhidham"], lat: 22.25, lng: 71.19 },
      "Karnataka": { districts: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Kalaburagi", "Ballari", "Vijayapura"], lat: 15.31, lng: 75.71 },
      "Kerala": { districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha"], lat: 10.85, lng: 76.27 },
      "Madhya Pradesh": { districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Ratlam", "Rewa"], lat: 22.97, lng: 78.65 },
      "Maharashtra": { districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai", "Kolhapur", "Akola"], lat: 19.75, lng: 75.71 },
      "Rajasthan": { districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Pali"], lat: 27.02, lng: 74.21 },
      "Tamil Nadu": { districts: ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tiruppur", "Erode", "Vellore"], lat: 11.12, lng: 78.65 },
      "Uttar Pradesh": { districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Noida", "Ghaziabad", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Jhansi"], lat: 26.84, lng: 80.94 },
      "West Bengal": { districts: ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah", "Darjeeling"], lat: 22.98, lng: 87.85 },
      "Delhi": { districts: ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"], lat: 28.61, lng: 77.2 },
      "Jammu and Kashmir": { districts: ["Srinagar", "Jammu", "Anantnag", "Baramulla"], lat: 33.77, lng: 76.57 }
    };

    const DISTRICT_COORDS = {
      "Patna": [25.5941, 85.1376], "Gaya": [24.7914, 85.0002], "Bodh Gaya": [24.6961, 84.9913], "Nalanda": [25.1205, 85.4513],
      "Jaipur": [26.9124, 75.7873], "Udaipur": [24.5854, 73.7125], "Jodhpur": [26.2389, 73.0243], "Varanasi": [25.3176, 82.9739],
      "Lucknow": [26.8467, 80.9462], "Agra": [27.1767, 78.0081], "Mumbai": [19.0760, 72.8777], "Pune": [18.5204, 73.8567],
      "Bengaluru": [12.9716, 77.5946], "Chennai": [13.0827, 80.2707], "Kolkata": [22.5726, 88.3639], "New Delhi": [28.6139, 77.2090]
    };

    for (let i = 0; i < totalToSeed; i++) {
      const id = `TID-${100000 + i}`;
      const password = 'password';
      const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      
      const stateInfo = STATE_DATA[loc.state] || { districts: ["General"], lat: loc.lat, lng: loc.lng };
      const districtName = stateInfo.districts[Math.floor(Math.random() * stateInfo.districts.length)];
      
      // Get base coordinates from district map or fallback to state center
      const baseCoords = DISTRICT_COORDS[districtName] || [stateInfo.lat, stateInfo.lng];
      const hashedPassword = bcrypt.hashSync(password, 10);

      tourists.push({
        username: id,
        password: hashedPassword, 
        originalPassword: password,
        role: 'TOURIST',
        state: loc.state,
        district: districtName,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@global.com`,
        phone: `+${Math.floor(Math.random() * 90) + 1} ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        origin: country,
        destination: `${districtName}, India`, // SYNCED: Location Hub now matches District
        travelDetails: 'Exploring cultural heritage and local cuisine.',
        visaDuration: Math.floor(Math.random() * 90) + 15,
        arrivalDate: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
        safetyScore: Math.floor(Math.random() * 40) + 60,
        lastLocation: {
          lat: baseCoords[0] + (Math.random() - 0.5) * 0.2, // Jitter around district center
          lng: baseCoords[1] + (Math.random() - 0.5) * 0.2
        },
        createdBy: 'SEED_GENERATOR'
      });

      if (tourists.length === batchSize) {
        await User.insertMany(tourists);
        console.log(`Inserted ${i + 1} tourists...`);
        tourists = [];
      }
    }

    if (tourists.length > 0) {
      await User.insertMany(tourists);
    }

    console.log(`Successfully seeded ${totalToSeed} tourists`);
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedData();
