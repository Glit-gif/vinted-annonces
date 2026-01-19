function getCategorieSalon(categorie) {
  const map = {
    't-shirt': 't-shirt',
    'tee-shirt': 't-shirt',
    'pull': 'pull',
    'sweat': 'sweat',
    'chaussures': 'chaussures',
    'veste': 'veste',
    'manteau': 'manteau'
  };

  return map[categorie.toLowerCase()] || 'autres';
}

module.exports = { getCategorieSalon };
