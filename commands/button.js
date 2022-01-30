const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('primary')
                .setLabel('Primary')
                .setStyle('PRIMARY'),
        );

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Some title')
        .setURL('https://discord.js.org')
        .setDescription('Some description here');

    await message.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
};