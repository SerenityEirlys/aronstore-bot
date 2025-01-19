const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dangerous')
    .setDescription('Info.'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📢 Dangerous Status 📢')
      .setDescription('Vietnamese Buy: [Here](https://arons.dev/) <a:__:1327833006945341570> GLOBAL BUY: [Here](https://arons.mysellix.io/)')
      .setColor(0xff0000)
      .addFields(
        {
            name: "<a:__:1327833006945341570> Unicore Genshin <:Gi:1327875368971014156>",
            value: "```\n🟢-OS 🟡-CN\n```"
          },
          {
            name: "<a:__:1327833006945341570> Akebi-GC 🥑",
            value: "```\n🟢-OS 🔴-Asia CN \n```"
          },
          {
            name: "<a:__:1327833006945341570> UniStar <:hsr:1330114892287705118>",
            "value": "```\n🟢-All\n```"
          },
          {
            name: "<a:__:1327833006945341570> Uniwaves 🌊",
            "value": "```\n🟢-All\n```"
          },
          {
            name: "<a:__:1327833006945341570> Marvel Rivals <:mr:1327873867498258492>",
            "value": "```\n🟢-All\n```"
          },
          {
            name: "<a:__:1327833006945341570> Unizone <:zzz:1327873879527526410> ",
            "value": "```\n🟢-All\n```"
          },
          {
            name: "<a:__:1327833006945341570>  **NeoxExclusive ** <:val:1327873872002940929> ",
            "value": "```\n🔴At risk/Deving\n```"
          },
          {
            name: "<a:__:1327833006945341570>  **NeoxAIM ** <:val:1327873872002940929> ",
            "value": "```\n🟢-All\n```"
          },
          {
            name: "<a:__:1327833006945341570> Predator CS2 <:cs2:1327873881498849392> ",
            "value": "```\n🟢-All\n```"
          },
          {
            name: "<a:__:1327833006945341570> Predator DeadLock <:deadlock:1327873888809390151> ",
            "value": "```\n🟢-All\n```"
          },
          {
            name: "<a:__:1327833006945341570> Unitheft Fivem-RageMP <:gtav:1327873696634896414>",
            "value": "```\n🟢-All\n```"
          },
          {
            name: "<a:__:1327833006945341570> Meowaves 🌊",
            "value": "```\n🟢-All\n```"
          },
      )
      .setFooter({ text: 'Developer: Hitori, Desgin: Arons' });

    await interaction.reply({ embeds: [embed] });
  },
};
