const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('download')
        .setDescription('Select a game and its loader to get a download link'),

    async execute(interaction) {
        const games = [
            { label: 'Genshin Impacts', value: 'gs' },
            { label: 'Honkai StarRail', value: 'hsr' },
            { label: 'Zenless Zen Zero', value: 'zzz' },
            { label: 'Marvel Rivals', value: 'mrs' },
            { label: 'Wuthering Wave', value: 'ww' },
            { label: 'Valorant', value: 'valorant' },
            { label: 'Counter Strike 2', value: 'cs2' },
            { label: 'DeadLock', value: 'deadlock' },
        ];

        const loadersByGame = {
            'gs': [{ label: 'Akebi', value: 'akebi' }, { label: 'UniCore', value: 'unicore' }],
            'hsr': [{ label: 'Unistar', value: 'Unistar' }, { label: 'Loader', value: 'Loader' }],
            'zzz': [{ label: 'Unizone', value: 'Unizone' }, { label: 'Loader', value: 'Loader' }],
            'mrs': [{ label: 'Unirivals', value: 'Unirivals' }, { label: 'Loader', value: 'Loader' }],
            'ww': [{ label: 'Uniwaves', value: 'Uniwaves' }, { label: 'meowaves', value: 'meowaves' }],
            'valorant': [{ label: 'NeoExclusive', value: 'neoexclusive' }, { label: 'NeoxAim', value: 'neoxaim' }],
            'cs2': [{ label: 'Predator', value: 'cs2' }, { label: 'Loader1', value: 'loader1' }],
            'deadlock': [{ label: 'Predator', value: 'deadlock' }, { label: 'Loader1', value: 'loader1' }],
        };

        const gameMenu = new StringSelectMenuBuilder()
            .setCustomId('select_game')
            .setPlaceholder('Select a game')
            .addOptions(games);

        const gameRow = new ActionRowBuilder().addComponents(gameMenu);

        await interaction.reply({
            content: 'Please select a game:',
            components: [gameRow],
            ephemeral: true,
        });

        const message = await interaction.fetchReply();

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000,
        });

        collector.on('collect', async (gameInteraction) => {
            if (gameInteraction.customId === 'select_game') {
                const selectedGame = gameInteraction.values[0];
                const selectedGameLabel = games.find(game => game.value === selectedGame).label;

                const embed = new EmbedBuilder()
                    .setTitle(`Selected Game: ${selectedGameLabel}`)
                    .setDescription('Now select a loader for the chosen game.')
                    .setColor(0x00AE86);

                const loaders = loadersByGame[selectedGame] || [];
                if (loaders.length === 0) {
                    await gameInteraction.update({
                        content: `No loaders available for **${selectedGameLabel}**.`,
                        components: [],
                    });
                    return;
                }

                const loaderMenu = new StringSelectMenuBuilder()
                    .setCustomId('select_loader')
                    .setPlaceholder('Select a loader')
                    .addOptions(loaders);

                const loaderRow = new ActionRowBuilder().addComponents(loaderMenu);

                await gameInteraction.update({
                    embeds: [embed],
                    components: [loaderRow],
                });

                const loaderCollector = message.createMessageComponentCollector({
                    componentType: ComponentType.StringSelect,
                    time: 60000,
                });

                loaderCollector.on('collect', async (loaderInteraction) => {
                    if (loaderInteraction.customId === 'select_loader') {
                        const selectedLoader = loaderInteraction.values[0];
                        const selectedLoaderLabel = loaders.find(loader => loader.value === selectedLoader).label;

                        const downloadLink = `https://arons.dev/loader/${selectedGame}/${selectedLoader}.zip`;

                        await loaderInteraction.update({
                            content: `You selected **${selectedLoaderLabel}** for **${selectedGameLabel}**. Here is your download link: [Download Now](${downloadLink})`,
                            embeds: [],
                            components: [],
                        });
                    }
                });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({
                    content: 'Interaction timed out. Use `/download` to try again.',
                    components: [],
                });
            }
        });
    },
};
