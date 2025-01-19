const { REST, Routes } = require('discord.js');
require('dotenv').config(); // Load .env file
const fs = require('fs');

// Load environment variables from .env
const { DISCORD_TOKEN, CLIENT_ID, GUILD_IDS } = process.env;

// Validate that required environment variables are provided
if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_IDS) {
  console.error('Missing environment variables. Please check your .env file.');
  console.error('Required variables: DISCORD_TOKEN, CLIENT_ID, GUILD_IDS');
  process.exit(1); // Exit the process with an error code
}

// Split GUILD_IDS into an array and trim spaces
const guildIds = GUILD_IDS.split(',').map(id => id.trim());

// Read all commands from the "commands" folder
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Create REST client to interact with Discord API
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// Register commands for each guild
(async () => {
  try {
    console.log('Registering slash commands for guilds...');

    for (const guildId of guildIds) {
      // Validate that the guild ID is in the correct format
      if (!/^\d{17,19}$/.test(guildId)) {
        console.warn(`Invalid guild ID skipped: ${guildId}`);
        continue;
      }

      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, guildId),
        { body: commands }
      );
      console.log(`Successfully registered commands for guild ID: ${guildId}`);
    }

    console.log('All guilds have been updated successfully!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();
