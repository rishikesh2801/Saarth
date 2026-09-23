const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/tourist_guard';

const STATE_DATA = [
  { name: "Andhra Pradesh", code: "AP", districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Anantapur", "Chittoor", "Kadapa", "Kakinada", "Eluru"], airports: ["VTZ", "VGA"] },
  { name: "Arunachal Pradesh", code: "AR", districts: ["Itanagar", "Tawang", "Ziro", "Pasighat", "Along"], airports: ["IXI"] },
  { name: "Assam", code: "AS", districts: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon", "Tinsukia"], airports: ["GAU", "DIB"] },
  { name: "Bihar", code: "BR", districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Nalanda", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Munger"], airports: ["PAT", "GAY"] },
  { name: "Chhattisgarh", code: "CG", districts: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"], airports: ["RPR"] },
  { name: "Goa", code: "GA", districts: ["North Goa", "South Goa"], airports: ["GOI", "GOX"] },
  { name: "Gujarat", code: "GJ", districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Gandhidham"], airports: ["AMD", "BDQ"] },
  { name: "Haryana", code: "HR", districts: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak"], airports: [] },
  { name: "Himachal Pradesh", code: "HP", districts: ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi"], airports: ["DHM"] },
  { name: "Jharkhand", code: "JH", districts: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"], airports: ["IXR"] },
  { name: "Karnataka", code: "KA", districts: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Kalaburagi", "Ballari", "Vijayapura"], airports: ["BLR", "IXE"] },
  { name: "Kerala", code: "KL", districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha"], airports: ["TRV", "COK", "CCJ"] },
  { name: "Madhya Pradesh", code: "MP", districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Ratlam", "Rewa"], airports: ["BHO", "IDR"] },
  { name: "Maharashtra", code: "MH", districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai", "Kolhapur", "Akola"], airports: ["BOM", "PNQ", "NAG"] },
  { name: "Manipur", code: "MN", districts: ["Imphal"], airports: ["IMF"] },
  { name: "Meghalaya", code: "ML", districts: ["Shillong", "Tura"], airports: ["SHL"] },
  { name: "Mizoram", code: "MZ", districts: ["Aizawl"], airports: ["AJL"] },
  { name: "Nagaland", code: "NL", districts: ["Kohima", "Dimapur"], airports: ["DMU"] },
  { name: "Odisha", code: "OR", districts: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"], airports: ["BBI"] },
  { name: "Punjab", code: "PB", districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"], airports: ["ATQ"] },
  { name: "Rajasthan", code: "RJ", districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Pali"], airports: ["JAI", "JDH", "UDR"] },
  { name: "Sikkim", code: "SK", districts: ["Gangtok"], airports: ["PYG"] },
  { name: "Tamil Nadu", code: "TN", districts: ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tiruppur", "Erode", "Vellore"], airports: ["MAA", "CJB", "IXM", "TRZ"] },
  { name: "Telangana", code: "TG", districts: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"], airports: ["HYD"] },
  { name: "Tripura", code: "TR", districts: ["Agartala"], airports: ["IXA"] },
  { name: "Uttar Pradesh", code: "UP", districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Noida", "Ghaziabad", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Jhansi"], airports: ["LKO", "VNS"] },
  { name: "Uttarakhand", code: "UK", districts: ["Dehradun", "Haridwar", "Haldwani", "Roorkee"], airports: ["DED"] },
  { name: "West Bengal", code: "WB", districts: ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah", "Darjeeling"], airports: ["CCU", "IXB"] },
  { name: "Andaman and Nicobar", code: "AN", districts: ["Port Blair"], airports: ["IXZ"] },
  { name: "Delhi", code: "DL", districts: ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"], airports: ["DEL"] },
  { name: "Jammu and Kashmir", code: "JK", districts: ["Srinagar", "Jammu", "Anantnag", "Baramulla"], airports: ["SXR", "IXJ"] },
  { name: "Ladakh", code: "LA", districts: ["Leh", "Kargil"], airports: ["IXL"] }
];

async function seedAuthorities() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing authority accounts
    await User.deleteMany({ createdBy: 'AUTHORITY_SEEDER' });

    let authorities = [];
    const salt = await bcrypt.genSalt(10);

    for (const state of STATE_DATA) {
      // 1. Generate Police IDs for ALL Districts in Domain Format with Real Names
      state.districts.forEach((distName, idx) => {
        const distClean = distName.toLowerCase().replace(/\s+/g, '-');
        const username = `${state.code.toLowerCase()}-${distClean}@police.gov.in`;
        const plainPassword = `password`;
        
        // Hashing passwords for login security
        authorities.push({
          username,
          password: bcrypt.hashSync(plainPassword, salt),
          originalPassword: plainPassword,
          role: 'POLICE',
          state: state.name,
          district: distName,
          name: `${distName} District Command`,
          email: username,
          createdBy: 'AUTHORITY_SEEDER'
        });
      });

      // 2. Generate Airport IDs in Domain Format
      for (const air of state.airports) {
        const username = `${air.toLowerCase()}@airport.gov.in`;
        const plainPassword = `password`;
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        
        authorities.push({
          username,
          password: hashedPassword,
          originalPassword: plainPassword,
          role: 'AIRPORT',
          state: state.name,
          name: `${air} International Terminal`,
          email: username,
          createdBy: 'AUTHORITY_SEEDER'
        });
      }
    }

    // Add National Super Admin in Domain Format
    const adminPass = 'password';
    authorities.push({
      username: 'national-admin@police.gov.in',
      password: await bcrypt.hash(adminPass, salt),
      originalPassword: adminPass,
      role: 'POLICE',
      state: 'All India',
      name: 'National Surveillance Center',
      email: 'national-admin@police.gov.in',
      createdBy: 'AUTHORITY_SEEDER'
    });

    await User.insertMany(authorities);
    console.log(`Successfully seeded ${authorities.length} Authority IDs (Districts & Airports)`);
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedAuthorities();
