const { REST, Routes } = require('discord.js');
require('dotenv').config(); // Load .env file
const fs = require('fs');
const path = require('path');

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

// Validate guild IDs
if (guildIds.length === 0) {
  console.error('No guild IDs provided. Please add guild IDs to GUILD_IDS in .env file.');
  process.exit(1);
}

// Log the guild IDs being used
console.log('Registering commands for the following guild IDs:');
guildIds.forEach(id => console.log(`- ${id}`));

// Function to read command files recursively from commands directory and its subdirectories
const readCommandFiles = () => {
  const commands = [];
  
  // Function to recursively read commands from directory
  const readCommands = (dir) => {
    const fullPath = path.join(__dirname, dir);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Directory "${fullPath}" does not exist, skipping...`);
      return;
    }

    const items = fs.readdirSync(fullPath);

    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // If it's a directory, recursively read commands from it
        readCommands(path.join(dir, item));
      } else if (item.endsWith('.js')) {
        // If it's a JS file, try to load it as a command
        try {
          const command = require(itemPath);
          if (command && command.data && command.data.toJSON) {
            commands.push(command.data.toJSON());
          } else {
            console.warn(`Skipping invalid command file: ${itemPath}`);
          }
        } catch (error) {
          console.error(`Error loading command file ${itemPath}:`, error);
        }
      }
    }
  };

  // Start reading from the commands directory
  readCommands('./commands');

  if (commands.length === 0) {
    console.warn('No command files found in the commands directory or its subdirectories.');
  }

  return commands;
};

// Read commands from commands folder and its subdirectories
const commands = readCommandFiles();

// Create REST client to interact with Discord API
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// Register commands for each guild ID
(async () => {
  try {
    console.log('Started refreshing application (/) commands for guilds...');

    // Register commands for each guild
    let successCount = 0;
    let failCount = 0;

    for (const guildId of guildIds) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, guildId),
          { body: commands }
        );
        console.log(`✅ Successfully registered commands for guild ${guildId}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to register commands for guild ${guildId}:`, error.message);
        failCount++;
      }
    }

    console.log('\nRegistration Summary:');
    console.log(`✅ Successfully registered commands in ${successCount} guilds`);
    if (failCount > 0) {
      console.log(`❌ Failed to register commands in ${failCount} guilds`);
    }
  } catch (error) {
    if (error.code === 50001) {
      console.error('Error: Bot lacks permissions. Make sure to:');
      console.error('1. Use the correct bot token');
      console.error('2. Enable "applications.commands" scope when inviting the bot');
      console.error('3. The bot has proper permissions in the server');
    } else {
      console.error('Error registering commands:', error);
    }
  }
})();