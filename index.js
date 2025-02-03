const {Client, GatewayIntentBits, Collection} = require('discord.js');
const fs = require('fs');
const path = require('path');
const replies = require('./data/replies.js');
const {removeVietnameseAccents} = require("./utils/utils");
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Load commands from commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Hỗ trợ cả command slash và command thường
    const commandName = command.data ? command.data.name : command.name;
    client.commands.set(commandName, command);
}

// Ready event handler
client.once('ready', () => {
    console.log(`Bot is online: ${client.user.tag}`);

    // Set bot status
    client.user.setPresence({
        activities: [{
            name: 'arons.dev',
            type: 0
        }],
        status: 'dnd'
    });
});

// Message handler
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Chỉ trả lời trong server có ID 1104940962804936856
    if (message.guild.id !== '1104940962804936856') return;

    const messageContent = removeVietnameseAccents(message.content.toLowerCase());
    console.log(`Handle message:
    - Author: ${message.author}
    - Original message: ${message.content}
    - Handling message: ${messageContent}`);
    for (const [keyword, responses] of Object.entries(replies)) {
        if (messageContent.includes(keyword)) {
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            await message.reply(randomResponse);
            break;
        }
    }
});

// Slash command handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply({content: 'Command not found!', flags: ['Ephemeral']});
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
        if (error.code === 50001) {
            const missingAccessMessage = 'Error: Bot lacks permissions. Please make sure:\n' +
                '1. The bot has proper permissions in the server\n' +
                '2. The "applications.commands" scope is enabled\n' +
                '3. You are using the correct bot token';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: missingAccessMessage, flags: ['Ephemeral']});
            } else {
                await interaction.reply({content: missingAccessMessage, flags: ['Ephemeral']});
            }
        } else {
            const errorMessage = 'An error occurred while executing the command. Please try again later.';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: errorMessage, flags: ['Ephemeral']});
            } else {
                await interaction.reply({content: errorMessage, flags: ['Ephemeral']});
            }
        }
    }
});

// Server join handler
client.on('guildCreate', (guild) => {
    if (guild.id !== process.env.SERVER_ID_PING) {
        guild.leave()
            .then(() => console.log(`Đã rời khỏi server không được phép: ${guild.name}`))
            .catch(console.error);
    }
});

// Validate environment variables
if (!process.env.DISCORD_TOKEN || !process.env.SERVER_ID_PING || !process.env.USER_ID) {
    console.error('Missing required environment variables!');
    process.exit(1);
}

// Login with error handling
client.login(process.env.DISCORD_TOKEN).catch(error => {
    if (error.code === 50001) {
        console.error(`Error: Bot lacks permissions. Make sure to:
    1. Use the correct bot token
    2. Enable "applications.commands" scope when inviting the bot
    3. The bot has proper permissions in the server`);
    } else {
        console.error(`Failed to login: ${error}
Please check if your token is valid and the bot has proper permissions`);
    }
    process.exit(1);
});
