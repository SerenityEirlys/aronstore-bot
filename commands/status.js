const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Hiển Thị Status Của Cheats.'),
  async execute(interaction) {
    const page1 = new EmbedBuilder()
      .setTitle('📢 Cheats Status (Page 1/4) 📢')
      .setDescription('Vietnamese Buy: [Here](https://arons.dev/) <a:__:1327833006945341570> GLOBAL BUY: [Here](https://arons.mysellix.io/) Use Commands: /dangerous, /download')
      .setColor(1029660)
      .addFields(
        {
          name: " ",
          value: "```\n🟢 Working/Safe \n```"
        },
        {
          name: " ",
          value: "```\n🟡 Risk/Updating \n```"
        },
        {
          name: " ",
          value: "```\n🔴Not Working/Down \n```"
        },
        {
          name: " ",
          value: "```\n🚯Better Skill Issue \n```"
        }
      )
      .setImage('https://i.pinimg.com/originals/f5/26/77/f526775e428eece2b1b9101cf5c3382a.gif')
      .setThumbnail('https://cdn.discordapp.com/attachments/1318252966515576943/1330188986160775240/bucac.gif?ex=678d1288&is=678bc108&hm=989a27d626a6b363b3d581f32bd735acad6d1a9e28792e26f0a4b5468114605c&')
      .setFooter({ text: 'Developer: Hitori, Desgin: Arons' });

    const page2 = new EmbedBuilder()
      .setTitle('📢 Cheats Status (Page 2/4) 📢')
      .setColor(1029660)
      .addFields(
        {
          name: "<a:__:1327833006945341570> Unicore Genshin <:Gi:1327875368971014156>",
          value: "```\n🟢 Working \n```"
        },
        {
          name: "<a:__:1327833006945341570> Akebi-GC 🥑",
          value: "```\n🟢 Working \n```"
        },
        {
          name: "<a:__:1327833006945341570> UniStar <:hsr:1327873865635987469>",
          value: "```\n🟢 Working \n```"
        },
        {
          name: "<a:__:1327833006945341570> Uniwaves 🌊",
          value: "```\n🟢 Working \n```"
        }
      )
      .setImage('https://i.pinimg.com/originals/f5/26/77/f526775e428eece2b1b9101cf5c3382a.gif')
      .setThumbnail('https://cdn.discordapp.com/attachments/1318252966515576943/1330188986160775240/bucac.gif?ex=678d1288&is=678bc108&hm=989a27d626a6b363b3d581f32bd735acad6d1a9e28792e26f0a4b5468114605c&')
      .setFooter({ text: 'Developer: Hitori, Desgin: Arons' });

    const page3 = new EmbedBuilder()
      .setTitle('📢 Cheats Status (Page 3/4) 📢')
      .setColor(1029660)
      .addFields(
        {
          name: "<a:__:1327833006945341570> Marvel Rivals <:mr:1327873867498258492>",
          value: "```\n🟢 Working \n```"
        },
        {
          name: "<a:__:1327833006945341570> Unizone <:zzz:1327873879527526410> ",
          value: "```\n🟢 Working \n```"
        },
        {
          name: "<a:__:1327833006945341570>  **NeoxExclusive ** <:val:1327873872002940929> ",
          value: "```\n🚯Better Skill Issue \n```"
        },
        {
          name: "<a:__:1327833006945341570>  **NeoxAIM ** <:val:1327873872002940929> ",
          value: "```\n🟢 Working \n```"
        }
      )
      .setImage('https://i.pinimg.com/originals/f5/26/77/f526775e428eece2b1b9101cf5c3382a.gif')
      .setThumbnail('https://cdn.discordapp.com/attachments/1318252966515576943/1330188986160775240/bucac.gif?ex=678d1288&is=678bc108&hm=989a27d626a6b363b3d581f32bd735acad6d1a9e28792e26f0a4b5468114605c&')
      .setFooter({ text: 'Developer: Hitori, Desgin: Arons' });

    const page4 = new EmbedBuilder()
      .setTitle('📢 Cheats Status (Page 4/4) 📢')
      .setColor(1029660)
      .addFields(
        {
          name: "<a:__:1327833006945341570> Predator CS2 <:cs2:1327873881498849392> ",
          value: "```\n🟢 Working \n```"
        },
        {
          name: "<a:__:1327833006945341570> Predator DeadLock <:deadlock:1327873888809390151> ",
          value: "```\n🟢 Working \n```"
        },
        {
          name: "<a:__:1327833006945341570> Unitheft Fivem-RageMP <:gtav:1327873696634896414>",
          value: "```\n🟢 Working \n```"
        },
        {
          name: "<a:__:1327833006945341570> Meowaves 🌊",
          value: "```\n🟢 Working \n```"
        }
      )
      .setImage('https://i.pinimg.com/originals/f5/26/77/f526775e428eece2b1b9101cf5c3382a.gif')
      .setThumbnail('https://cdn.discordapp.com/attachments/1318252966515576943/1330188986160775240/bucac.gif?ex=678d1288&is=678bc108&hm=989a27d626a6b363b3d581f32bd735acad6d1a9e28792e26f0a4b5468114605c&')
      .setFooter({ text: 'Developer: Hitori, Desgin: Arons' });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setLabel('◀️ Previous')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next ▶️')
          .setStyle(ButtonStyle.Primary)
      );

    const pages = [page1, page2, page3, page4];
    
    const message = await interaction.reply({ 
      embeds: [page1], 
      components: [row],
      fetchReply: true
    });

    // Store user-specific page numbers
    const userPages = new Map();

    const collector = message.createMessageComponentCollector();

    collector.on('collect', async i => {
      // Get current page for this specific user
      let userCurrentPage = userPages.get(i.user.id) || 1;

      if (i.customId === 'previous') {
        userCurrentPage = userCurrentPage > 1 ? userCurrentPage - 1 : pages.length;
      } else if (i.customId === 'next') {
        userCurrentPage = userCurrentPage < pages.length ? userCurrentPage + 1 : 1;
      }

      // Store the new page number for this user
      userPages.set(i.user.id, userCurrentPage);

      await i.update({ 
        embeds: [pages[userCurrentPage - 1]], 
        components: [row]
      });
    });
  },
};
