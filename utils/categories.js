function getCategoryChannel(title) {
  const t = title.toLowerCase();

  if (t.includes("t-shirt") || t.includes("tee")) return "t-shirt";
  if (t.includes("pull") || t.includes("sweat")) return "pull";
  if (t.includes("veste")) return "veste";
  if (t.includes("manteau")) return "manteau";
  if (t.includes("chaussure") || t.includes("sneaker")) return "chaussures";

  return "autres";
}

module.exports = { getCategoryChannel };
