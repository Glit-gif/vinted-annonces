const fetch = require('node-fetch');

const ANNOUNCES_URL =
  'https://raw.githubusercontent.com/Glit-gif/vinted-annonces/45c08f8fcf80b4504cf6d0c52f1bf22c4f7a2ed1/annonces.json';

module.exports = async function fetchAnnonces() {
  try {
    const response = await fetch(ANNOUNCES_URL);
    const annonces = await response.json();
    return annonces;
  } catch (err) {
    console.error('Erreur fetchAnnonces :', err.message);
    return [];
  }
};
