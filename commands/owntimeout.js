const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('owntimeout') 
        .setDescription('Timeout người dùng (Chỉ chủ sở hữu)')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Người dùng cần timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Thời gian timeout (phút)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Lý do timeout')
                .setRequired(false)),

    async execute(interaction) {
        // Check if user is bot owner
        const ownerId = process.env.USER_ID; // Changed from OWNER_ID to USER_ID
        if (interaction.user.id !== ownerId) {
            return interaction.reply({ 
                content: '❌ Bạn không có quyền sử dụng lệnh này. Chỉ chủ sở hữu bot mới có thể dùng!', 
                ephemeral: true 
            });
        }

        const target = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'Không có lý do';

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ 
                content: '❌ Không tìm thấy người dùng này.', 
                ephemeral: true 
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: '❌ Không thể timeout người dùng này. Họ có thể có quyền cao hơn tôi.',
                ephemeral: true
            });
        }

        try {
            await member.timeout(duration * 60 * 1000, reason);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔇 Timeout Thành Công')
                .setDescription(`${target.tag} đã bị timeout.`)
                .addFields(
                    { name: '👤 Người Dùng', value: `${target}`, inline: true },
                    { name: '⏱️ Thời Gian', value: `${duration} phút`, inline: true },
                    { name: '📝 Lý Do', value: reason }
                )
                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            try {
                await target.send({
                    content: `Bạn đã bị timeout trong ${interaction.guild.name} trong ${duration} phút.\nLý do: ${reason}`
                });
            } catch (error) {
                console.log('Không thể gửi DM cho người dùng về timeout');
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Đã xảy ra lỗi khi timeout người dùng.',
                ephemeral: true
            });
        }
    },
};