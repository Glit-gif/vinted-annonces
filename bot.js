const { Client, GatewayIntentBits } = require('discord.js');
const fetchAnnonces = require('./services/fetchAnnonces');
const { getCategorieSalon } = require('./utils/categories');

const PREFIX = 'v!';
let filtres = [];

// Création du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Quand le bot est connecté
client.once('ready', () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

// Gestion des messages
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const commande = message.content
    .slice(PREFIX.length)
    .trim()
    .toLowerCase();

  // Ajouter un filtre (ex: v!ralph)
  if (
    commande !== 'showfilters' &&
    commande !== 'clearfilters' &&
    commande !== 'marques'
  ) {
    if (!filtres.includes(commande)) {
      filtres.push(commande);
      message.channel.send(`✅ Filtre ajouté : **${commande}**`);
    } else {
      message.channel.send(`⚠️ Le filtre **${commande}** est déjà actif`);
    }
    return;
  }

  // Afficher les filtres
  if (commande === 'showfilters') {
    if (filtres.length === 0) {
      message.channel.send('ℹ️ Aucun filtre actif');
    } else {
      message.channel.send(`🔎 Filtres actifs : ${filtres.join(', ')}`);
    }
    return;
  }

  // Supprimer les filtres
  if (commande === 'clearfilters') {
    filtres = [];
    message.channel.send('🧹 Tous les filtres ont été supprimés');
    return;
  }

  // Marques connues
  if (commande === 'marques') {
    message.channel.send(
      '📦 Marques connues : ralph, nike, adidas, carhartt, lacoste'
    );
    return;
  }
});

// Boucle principale : récupération des annonces
async function loopAnnonces() {
  try {
    const annonces = await fetchAnnonces();

    for (const annonce of annonces) {
      // Appliquer les filtres
      if (
        filtres.length > 0 &&
        !filtres.includes(annonce.marque.toLowerCase())
      ) {
        continue;
      }

      const salonName = getCategorieSalon(annonce.categorie);
      const guild = client.guilds.cache.first();
      if (!guild) return;

      const salon = guild.channels.cache.find(
        (c) => c.name === salonName
      );

      if (!salon) continue;

      const benefice = annonce.revente - annonce.prix;

      salon.send(
        `🆕 **Annonce détectée**\n` +
        `🔗 Lien : ${annonce.lien}\n` +
        `🏷️ Marque : ${annonce.marque}\n` +
        `💰 Prix : ${annonce.prix}€\n` +
        `📈 Revente estimée : ${annonce.revente}€\n` +
        `💸 Bénéfice : ${benefice}€`
      );
    }
  } catch (err) {
    console.error('❌ Erreur annonces :', err.message);
  }
}

// Lancer la boucle toutes les 60 secondes
setInterval(loopAnnonces, 60 * 1000);

// Connexion à Discord (Render)
client.login(process.env.DISCORD_TOKEN);
