exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS'))
        return message.channel.send({ embed: { color: "RED", description: "You can't use this command!" } });
    let guild = message.guild;
    let member = message.mentions.members.first();
    if (!member) return message.channel.send({ embed: { color: "RED", description: "You need to input a user!" } });

    let reason = message.content.slice(28);
    if (!reason) reason = "undefined";

    member.send(`You where band from **${guild}** by ${message.author} reason:** ${reason}**`)
        .then(() => {
            member.ban()
                .catch(err => {
                    console.error(err);
                    message.channel.send({ embed: { color: "RED", description: "error uhg!" } });
                })
        })
};