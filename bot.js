const { Client, GatewayIntentBits } = require('discord.js');
const { fetchAnnonces } = require('./services/fetchAnnonces');
const { note } = require('./utils/profit');
const categories = require('./utils/categories');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let filters = [];

client.once('ready', () => {
  console.log('✅ Bot connecté');
});

// COMMANDES
client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const cmd = message.content.slice(2).toLowerCase();

  if (cmd === "showfilters")
    return message.channel.send(filters.length ? filters.join(", ") : "Aucun filtre");

  if (cmd === "clearfilters") {
    filters = [];
    return message.channel.send("Filtres supprimés");
  }

  if (!filters.includes(cmd)) {
    filters.push(cmd);
    message.channel.send(`Filtre ajouté : ${cmd}`);
  }
});

// CRÉATION / RÉCUPÉRATION SALON
async function getChannel(guild, name) {
  let channel = guild.channels.cache.find(c => c.name === name);
  if (!channel) {
    channel = await guild.channels.create({
      name,
      type: 0
    });
  }
  return channel;
}

// BOUCLE ANNONCES
setInterval(async () => {
  const annonces = await fetchAnnonces(config.annoncesEndpoint);

  for (const annonce of annonces) {
    if (filters.length && !filters.includes(annonce.marque)) continue;

    const salon = annonce.categorie;
    const channel = await getChannel(client.guilds.cache.first(), salon);

    const score = note(annonce.prix, annonce.revente);

    channel.send(`
🆕 **Annonce détectée**
${annonce.titre}
🔗 ${annonce.lien}

📊 ${score}% bien
💰 ${annonce.prix}€
📈 ${annonce.revente}€
🟢 +${annonce.revente - annonce.prix}€
    `);
  }
}, 60000);

client.login(process.env.DISCORD_TOKEN);


