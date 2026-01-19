const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const BASE_URL = "https://www.vinted.fr/api/v2/catalog/items";

async function fetchVintedItems(filters = {}) {
  const params = new URLSearchParams({
    per_page: 20,
    order: "newest_first",
    ...filters
  });

  const url = `${BASE_URL}?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  if (!res.ok) {
    console.error("Erreur Vinted :", res.status);
    return [];
  }

  const data = await res.json();
  return data.items || [];
}

module.exports = { fetchVintedItems };
