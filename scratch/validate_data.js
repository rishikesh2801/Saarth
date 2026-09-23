const data = require('./frontend/src/data/indiaTourismData.js');
const states = data.indiaTourismData;

states.forEach((s, i) => {
  if (!s.name) console.error(`State at index ${i} missing name`);
  if (!s.locations) console.error(`State ${s.name} missing locations`);
  if (!s.foods) console.error(`State ${s.name} missing foods`);
  if (s.locations && !Array.isArray(s.locations)) console.error(`State ${s.name} locations is not an array`);
  if (s.foods && !Array.isArray(s.foods)) console.error(`State ${s.name} foods is not an array`);
});
console.log('Validation complete');
