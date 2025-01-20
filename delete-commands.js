const { REST, Routes } = require('discord.js');
require('dotenv').config();

// Validate environment variables
const { DISCORD_TOKEN, CLIENT_ID, GUILD_IDS } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_IDS) {
  console.error('Missing required environment variables. Please check your .env file.');
  console.error('Required variables: DISCORD_TOKEN, CLIENT_ID, GUILD_IDS');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Deleting global commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
    console.log('Successfully deleted global commands.');

    const guildIds = GUILD_IDS.split(',').map(id => id.trim());
    for (const guildId of guildIds) {
      try {
        console.log(`Deleting commands in guild: ${guildId}`);
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: [] });
        console.log(`Successfully deleted commands in guild: ${guildId}`);
      } catch (guildError) {
        if (guildError.code === 50001) {
          console.error(`Error: Missing access for guild ${guildId}. Make sure to:`);
          console.error('1. Use the correct bot token');
          console.error('2. Enable "applications.commands" scope when inviting the bot');
          console.error('3. The bot has proper permissions in the server');
        } else {
          console.error(`Error deleting commands in guild ${guildId}:`, guildError);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting commands:', error);
    process.exit(1);
  }
})();
