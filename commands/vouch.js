const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Give a Vouch for another user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user you want to vouch for')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('rating')
        .setDescription('Rating from 1 to 5 stars')
        .setRequired(true)
        .addChoices(
          { name: '1 Star - Poor', value: 1 },
          { name: '2 Stars - Fair', value: 2 },
          { name: '3 Stars - Good', value: 3 },
          { name: '4 Stars - Great', value: 4 },
          { name: '5 Stars - Excellent', value: 5 },
        ))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the vouch')
        .setRequired(true)),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const rating = interaction.options.getInteger('rating');
    const reason = interaction.options.getString('reason');
    const author = interaction.user;

    // Prevent self-vouching
    if (targetUser.id === author.id) {
      return interaction.reply({
        content: '❌ You cannot vouch for yourself!',
        ephemeral: true
      });
    }

    // Create star rating display
    const filledStar = '<a:Nitro:1330152905055142044>';
    const emptyStar = '☆';
    const ratingDisplay = filledStar.repeat(rating) + emptyStar.repeat(5 - rating);

    // Create rating text based on score
    const getRatingText = (score) => {
      switch(score) {
        case 1: return '😔 Poor';
        case 2: return '🙁 Fair';
        case 3: return '😊 Good';
        case 4: return '🎉 Great';
        case 5: return '⭐ Excellent';
        default: return '';
      }
    };

    const embed = new EmbedBuilder()
      .setColor(rating >= 4 ? '#00ff00' : rating >= 3 ? '#ffff00' : '#ff0000')
      .setTitle('✨ New Vouch')
      .setDescription(`${author} has vouched for ${targetUser}\n\n📝 **Reason:** ${reason}`)
      .setThumbnail(author.displayAvatarURL({ dynamic: true }))
      .addFields([
        { name: '📊 Rating', value: `${ratingDisplay}\n${getRatingText(rating)}`, inline: true },
        { name: '🕒 Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
      ])
      .setImage('https://media0.giphy.com/media/tjYS8yUChlzSmdKx9x/200.gif')
      .setFooter({ 
        text: `Vouched by ${author.tag}`, 
        iconURL: targetUser.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    try {
      // Send confirmation message
      await interaction.reply({ 
        content: `✅ Your vouch for ${targetUser.tag} has been recorded!`,
        embeds: [embed]
      });
    } catch (error) {
      console.error('Error sending vouch:', error);
      await interaction.reply({
        content: '❌ An error occurred while recording your vouch. Please try again.',
        ephemeral: true
      });
    }
  },
};
