const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const replies = require('./data/replies.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

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

// Lưu trữ thời gian reply cuối cùng cho mỗi kênh
const lastReplyTimes = new Map();

// Event xử lý tin nhắn văn bản
client.on('messageCreate', async (message) => {
    // Bỏ qua tin nhắn từ bot
    if (message.author.bot) return;

    const channelId = message.channel.id;
    const now = Date.now();
    const lastReplyTime = lastReplyTimes.get(channelId) || 0;

    // Kiểm tra xem đã đủ 5 giây kể từ lần reply cuối chưa
    if (now - lastReplyTime < 5000) return;

    // Kiểm tra tin nhắn có chứa từ khóa trong replies không
    const messageContent = message.content.toLowerCase();
    for (const [keyword, responses] of Object.entries(replies)) {
        if (messageContent.includes(keyword)) {
            // Chọn ngẫu nhiên một câu trả lời từ mảng responses
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            await message.reply(randomResponse);
            lastReplyTimes.set(channelId, now); // Cập nhật thời gian reply cuối
            break; // Thoát vòng lặp sau khi đã trả lời
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
