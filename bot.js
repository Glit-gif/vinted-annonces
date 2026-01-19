const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { fetchVintedItems } = require("./services/vintedScraper");
const { getCategoryChannel } = require("./utils/categories");
const config = require("./config.json");

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
  const items = await fetchVintedItems({
    search_text: "",
  });

  for (const item of items) {
    if (seen.includes(item.id)) continue;

    seen.push(item.id);
    fs.writeFileSync("./data/seen.json", JSON.stringify(seen, null, 2));

    const category = getCategoryChannel(item.title);
    const channel = client.channels.cache.find(
      c => c.name === category
    );

    if (!channel) continue;

    const price = item.price?.amount || "?";
    const resale = Math.round(price * 2.5);
    const benefit = resale - price;

    channel.send(
      `🆕 **Nouvelle annonce**
🔗 ${item.url}
👕 ${item.title}
💰 Prix : ${price}€
📈 Revente estimée : ${resale}€
💸 Bénéfice : ${benefit}€`
    );
  }
}

client.login(config.token);
