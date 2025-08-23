const animals = ['Cat', 'Dog', 'Bunny', 'Panda', 'Duck'];
const hats = ['Hat', 'Laser', 'Sword', 'Crown'];

export const generateTokenName = () => {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const hat = hats[Math.floor(Math.random() * hats.length)];
  return `${animal}Wif${hat}`;
};

// Add more generators for prices, etc.
