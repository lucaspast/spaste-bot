const constructMute = require('../creamuted.js')

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MUTE_MEMBERS')) {
        return message.channel.send({ embed: { color: "RED", description: "you can't use this command!" } });
    }

    if (!message.guild.roles.cache.find(role => role.name == "Muted")) {
        let guild = message.guild;
        constructMute.run(guild);
        return message.channel.send({ embed: { color: "RED", description: "error Muted was deleted try again" } });
    }

    let user = message.mentions.members.first();
    if (!user) return message.channel.send({ embed: { color: "RED", description: "You need to mention the user!" } });


    if (user.roles.cache.find(role => role.name == "Muted")) return message.channel.send({ embed: { color: "RED", description: "This user is already muted!" } });

    let role = user.guild.roles.cache.find(role => role.name == "Muted");
    let reason = message.content.slice(29);
    if (!reason) {
        reason = "undefined";
    }

    user.roles.add(role).then(user => message.channel.send({
        embed: {
            "description": `${message.member} muted ${user}`,
            "color": 5855587,
            "author": {
                "name": `${user.user.username}`,
                "icon_url": `${user.user.avatarURL() !== null ? user.user.avatarURL() : 'https://cdn.discordapp.com/embed/avatars/0.png'}`
            },
            "fields": [
                {
                    "name": "reason:",
                    "value": reason
                }
            ]
        }
    }))
    const { logsChannel } = require(`../guilds/${message.guild.name} lc.json`);
    if (!logsChannel == 'none') {
        let lc = client.channels.cache.get(logsChannel.id);
        lc.send({
            embed: {
                "color": 5855587,
                "description": `${message.member} muted ${user} reason: ${reason}`
            }
        })
    }
    return message.delete()
}