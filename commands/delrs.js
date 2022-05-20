const jsonSaver = require('../jsonsaver.js');
const fs = require('fs');
const { Permissions } = require('discord.js');

exports.run = async (interaction) => {
    try {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
            return interaction.reply("You can't use this command!");
    } catch (err) {
        console.error(err);
    };

    let id = interaction.options.getString('id');
    const guild = interaction.guild;
    if (fs.existsSync(`./rearoles/${guild.name} ${id}.json`)) {
        guild.channels.cache.forEach(async channel => {
            if (channel.type == 'text') {
                let msg = await channel.messages.fetch(id).catch(err => { });
                if (!msg) return;
                fs.unlinkSync(`./rearoles/${guild.name} ${msg.id}.json`);
                msg.delete();
                return message.channel.send("Successfuly removed the reaction role message!");
            }
        })
    } else {
        return interaction.reply('The given message id is not recognized as a reaction role message id!');
    }
};

const { SlashCommandBuilder } = require('@discordjs/builders');
exports.slashcmdInfo = new SlashCommandBuilder()
    .setName('delrs')
    .setDescription('delete a reaction role message!')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('The message id of the reaction role message.')
            .setRequired(true));
