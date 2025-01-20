const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('🛡️ Protect server from spam and scam links')
        .addIntegerOption(option => 
            option.setName('time')
                .setDescription('⏰ Mute duration for spammers (seconds)')
                .setRequired(true)),
    
    async execute(interaction) {
        // Check bot permissions
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
        if (!botMember || !botMember.permissions.has('MANAGE_ROLES') || !botMember.permissions.has('TIMEOUT_MEMBERS')) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Permission Error')
                .setDescription('Bot needs "Manage Roles" and "Timeout Members" permissions to execute this command.')
                .setTimestamp();
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Check user permissions
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noPermEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('⛔ Insufficient Permissions')
                .setDescription('You need ADMINISTRATOR permission to use this command.')
                .setTimestamp();
            return interaction.reply({ embeds: [noPermEmbed], ephemeral: true });
        }

        const muteTime = interaction.options.getInteger('time') * 1000;
        const spamThreshold = 4;
        const messageCache = new Map();

        interaction.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            
            const userId = message.author.id;
            const messageContent = message.content.trim();
            const member = message.guild.members.cache.get(message.author.id);
            const bypassRoleIds = process.env.WHITELIST_ROLE_ID?.split(',') || [];

            // Check if user has bypass role
            if (member && member.roles.cache.some(role => bypassRoleIds.includes(role.id))) {
                return;
            }

            if (!messageCache.has(userId)) {
                messageCache.set(userId, []);
            }

            const userMessages = messageCache.get(userId);
            userMessages.push({ content: messageContent, timestamp: Date.now() });

            const recentMessages = userMessages.filter(msg => Date.now() - msg.timestamp <= 30000);
            messageCache.set(userId, recentMessages);

            const messageCount = recentMessages.filter(msg => msg.content === messageContent).length;

            if (messageCount >= spamThreshold) {
                if (member) {
                    const spamEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('🚫 Spam Detected')
                        .setDescription(`<@${userId}> has been muted for ${muteTime / 1000} seconds`)
                        .addFields(
                            { name: '📝 Reason', value: 'Sending the same message too many times' },
                            { name: '⚠️ Warning', value: 'Avoid spamming to prevent future mutes!' }
                        )
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp();

                    await member.timeout(muteTime, 'Anti-Spam System').catch(console.error);
                    message.channel.send({ embeds: [spamEmbed] });
                    messageCache.set(userId, []);
                }
            }

            const scamLinks = [
                'http', 'www', 'bit.ly', 'short.ly', 'freegift', 
                'promo', 'buy-now', 'free-nitro', 'steam-gift',
                'discord-nitro', 'free-robux'
            ];
            
            if (scamLinks.some(link => message.content.toLowerCase().includes(link))) {
                if (member) {
                    const scamEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('🚨 Scam Link Detected')
                        .setDescription(`<@${userId}> has been kicked from the server`)
                        .addFields(
                            { name: '📝 Reason', value: 'Sending potential scam links' },
                            { name: '🛡️ Protection', value: 'Server is protected from harmful links!' }
                        )
                        .setThumbnail(message.author.displayAvatarURL())
                        .setImage('https://i.imgur.com/mE6LxHj.gif')
                        .setTimestamp();

                    // Delete the scam message first
                    await message.delete().catch(console.error);
                    
                    // Then kick the member
                    await member.kick('Anti-Scam System').catch(console.error);
                    message.channel.send({ embeds: [scamEmbed] });
                }
            }
        });

        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🛡️ AutoMod Activated')
            .setDescription('Server protection system is now enabled')
            .addFields(
                { name: '🤖 Features', value: '• Anti-Spam\n• Anti-Scam Links' },
                { name: '⚙️ Settings', value: `• Mute duration: ${muteTime/1000} seconds\n• Spam threshold: ${spamThreshold} messages` }
            )
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();

        return interaction.reply({ embeds: [successEmbed] });
    },
};
