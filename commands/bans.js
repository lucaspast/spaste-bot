
exports.run = async function (client, message, args) {
    if (!message.member.hasPermission('BAN_MEMBERS'))
        return message.channel.send({ embed: { color: "RED", description: "You can't use this command!" } });
    message.guild.fetchBans()
        .then(banned => {
            let list = banned.map(ban => `${ban.user.tag} : ${ban.user.id}`).join('\n');

            if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;

            message.channel.send(`**${banned.size} users are banned:**\n${list}`);
        })
        .catch(console.error);
};