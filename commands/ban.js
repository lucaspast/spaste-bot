exports.run = async (interaction) => {
    //if (!message.member.hasPermission('BAN_MEMBERS'))
    //return message.channel.send({ embed: { color: "RED", description: "You can't use this command!" } });
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