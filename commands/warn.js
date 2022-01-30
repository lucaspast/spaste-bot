const jsonsaver = require('../jsonsaver.js');
const constructMute = require('../creamuted.js');

exports.run = async function (client, message, args) {
    if (!message.member.hasPermission('MUTE_MEMBERS'))
        return message.channel.send({ embed: { color: "RED", description: "You can't use this command!" } });


    let true0;
    let user = message.mentions.members.first();
    if (!user) return message.channel.send("you didn't input a user!");

    let reason = message.content.slice(29);
    if (!reason) {
        reason = "Unspecified";
    }

    if (user.warns) {
        user.warns[user.warns.length] = { mod: `<@!${message.member.user.id}>`, reason: reason };
        true0 = false;
    } else {
        user.warns = [];
        user.warns[0] = { mod: `<@!${message.member.user.id}>`, reason: reason };
        true0 = true;
    }

    if (user.user.avatarURL() == null) {
        message.channel.send({
            embed: {
                "description": `${message.member} warnd ${user}`,
                "color": 5855587,
                "author": {
                    "name": `${user.user.username}`,
                    "icon_url": `https://cdn.discordapp.com/embed/avatars/0.png`
                },
                "fields": [
                    {
                        "name": "reason:",
                        "value": reason
                    }
                ]
            }
        })
    } else {
        message.channel.send({
            embed: {
                "description": `${message.member} warnd ${user}`,
                "color": 5855587,
                "author": {
                    "name": `${user.user.username}`,
                    "icon_url": `${user.user.avatarURL()}`
                },
                "fields": [
                    {
                        "name": "reason:",
                        "value": reason
                    }
                ]
            }
        })
    }
    message.delete();

    const { logsChannel } = require(`../guilds/${message.guild.name} lc.json`);
    let lc = client.channels.cache.get(logsChannel.id);
    lc.send({
        embed: {
            "color": 5855587,
            "description": `${message.member} warnd ${user} reason: ${reason}`
        }
    })

    let guild = message.guild;

    jsonsaver.wa(user.warns, guild, user);

    puwa(user, message, client);

    return user.warns[user.warns.length - 1];
}

async function puwa(user, message, client) {
    if (user.warns.length >= 4) {
        if (!message.guild.roles.cache.find(role => role.name == "Muted")) {
            let guild = message.guild;
            constructMute.creaMuted(guild);
            setTimeout(puwa, 500, user, message, client);
        } else {

            let role = user.guild.roles.cache.find(role => role.name == "Muted");
            let reason = "To many warns!"

            if (user.user.avatarURL() == null) {
                user.roles.add(role).then(user => message.channel.send({
                    embed: {
                        "description": `mr. spast muted ${user}`,
                        "color": 5855587,
                        "author": {
                            "name": `${user.user.username}`,
                            "icon_url": `https://cdn.discordapp.com/embed/avatars/0.png`
                        },
                        "fields": [
                            {
                                "name": "reason:",
                                "value": reason
                            }
                        ]
                    }
                }))
            } else {
                user.roles.add(role).then(user => message.channel.send({
                    embed: {
                        "description": `mr. spast muted ${user}`,
                        "color": 5855587,
                        "author": {
                            "name": `${user.user.username}`,
                            "icon_url": `${user.user.avatarURL()}`
                        },
                        "fields": [
                            {
                                "name": "reason:",
                                "value": reason
                            }
                        ]
                    }
                }))
            }
            const { logsChannel } = require(`../guilds/${message.guild.name} lc.json`);
            let lc = client.channels.cache.get(logsChannel.id);
            lc.send({
                embed: {
                    "color": 5855587,
                    "description": `mr. spast muted ${user} reason: ${reason}`
                }
            })
        }
    }
};