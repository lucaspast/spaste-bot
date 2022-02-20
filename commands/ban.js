const { Permissions } = require('discord.js');

exports.run = async (interaction) => {
    try {
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
            return interaction.reply("You can't use this command!");
    } catch (err) {
        console.error(err);
    };
    let guild = interaction.guild;
    let member = interaction.options.getMember('user');

    let reason = interaction.options.getString('reason');
    if (!reason) reason = "undefined";

    member.send(`You where band from **${guild.name}** by ${interaction.member.user.username} reason:** ${reason}**`)
        .then(() => {
            member.ban()
                .then(() => {
                    interaction.reply('member banned!')
                })
                .catch(err => {

                })
        })
};

const { SlashCommandBuilder } = require('@discordjs/builders');
exports.slashcmdInfo = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server!')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The member you want to ban.')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('The reason for banning the user.')
            .setRequired(false));