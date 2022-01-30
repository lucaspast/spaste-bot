const discord = require('discord.js');

exports.run = async (interaction, client) => {
    if (interaction.customId === 'primary') {

        const embed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org')
            .setDescription('Some description here');

        await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed] });
    }
};