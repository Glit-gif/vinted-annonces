const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { fetchVintedItems } = require("./services/vintedScraper");
const { getCategoryChannel } = require("./utils/categories");
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let seen = JSON.parse(fs.readFileSync("./data/seen.json"));

client.once("ready", () => {
  console.log("Bot connecté :", client.user.tag);

  setInterval(checkVinted, 2 * 60 * 1000); // toutes les 2 minutes
});

async function checkVinted() {
  console.log("Recherche d'annonces Vinted...");

  const items = await fetchVintedItems({
    search_text: "nike"
  });

  console.log("Annonces trouvées :", items.length);

  if (items.length === 0) return;

  const item = items[0]; // on force UNE annonce

  const category = getCategoryChannel(item.title);
  console.log("Catégorie détectée :", category);

  const channel = client.channels.cache.find(
    c => c.name === category
  );

  if (!channel) {
    console.log("Salon introuvable :", category);
    return;
  }

  channel.send(
    `🧪 **TEST ANNONCE**
🔗 ${item.url}
👕 ${item.title}
💰 Prix : ${item.price?.amount || "?"}€`
  );
}

client.login(DISCORD_TOKEN);



