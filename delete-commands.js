const { REST, Routes } = require('discord.js');
require('dotenv').config();

const { DISCORD_TOKEN, CLIENT_ID } = process.env;

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Đang xóa toàn bộ lệnh toàn cầu...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
    console.log('Đã xóa toàn bộ lệnh toàn cầu.');

    const guildIds = process.env.GUILD_IDS.split(',').map(id => id.trim());
    for (const guildId of guildIds) {
      console.log(`Đang xóa lệnh trong guild: ${guildId}`);
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: [] });
      console.log(`Đã xóa lệnh trong guild: ${guildId}`);
    }

    console.log('Tất cả lệnh đã được xóa thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa lệnh:', error);
  }
})();
