const { Permissions } = require('discord.js');

exports.run = async function (interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
        return interaction.reply("You can't use this command!");
    interaction.guild.fetchBans()
        .then(banned => {
            let list = banned.map(ban => `${ban.user.tag} : ${ban.user.id}`).join('\n');

            if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;

            interaction.reply(`**${banned.size} users are banned:**\n${list}`);
        })
        .catch(console.error);
};

const { SlashCommandBuilder } = require('@discordjs/builders');
exports.slashcmdInfo = new SlashCommandBuilder()
    .setName('bans')
    .setDescription('View the list of banned members!');
