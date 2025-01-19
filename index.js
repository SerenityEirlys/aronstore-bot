const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

// Initialize autoReplies Map
global.autoReplies = new Map([
    ['download', 'hi use /download'], // Example auto-reply
    ['how to download', 'hi use /download'],
    ['cách nào tải', 'hi use /download'],
    ['trung bùi', 'vua đầu cặc']
]);

// Load lệnh từ thư mục commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (!command.data || !command.execute) {
        console.warn(`Tệp lệnh ${file} không hợp lệ! Bỏ qua.`);
        continue;
    }
    client.commands.set(command.data.name, command);
}

// Event kích hoạt khi bot sẵn sàng
client.once('ready', () => {
    console.log(`Bot đã hoạt động: ${client.user.tag}`);

    // Đặt trạng thái cho bot
    client.user.setPresence({
        activities: [{ name: 'arons.dev', type: 'PLAYING' }], // type có thể là PLAYING, LISTENING, WATCHING
        status: 'dnd', // Các trạng thái: online, idle, dnd, invisible
    });
});

// Event xử lý tin nhắn văn bản
client.on('messageCreate', async (message) => {
    // Bỏ qua tin nhắn từ bot
    if (message.author.bot) return;

    // Kiểm tra trigger trong Map
    if (global.autoReplies) {
        const response = global.autoReplies.get(message.content.toLowerCase());
        if (response) {
            try {
                await message.reply(response);
            } catch (error) {
                console.error(`Lỗi khi trả lời auto-reply: ${error}`);
            }
        }
    }
});

// Event xử lý lệnh Slash
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Có lỗi xảy ra khi thực thi lệnh!', ephemeral: true });
    }
});

// Đăng nhập bot
client.login(process.env.DISCORD_TOKEN);
