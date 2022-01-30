const ms = require('ms');
const path = require('path');
var Datastore = require('nedb');
let db = {};
db.mute = new Datastore(path.join('./databases', 'mute.db'));
db.mute.loadDatabase();
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

    let member = message.mentions.members.first();
    if (!member) return message.channel.send({ embed: { color: "RED", description: "You need to mention the user!" } });

    let time = args[1];
    if (!time) return message.channel.send({ embed: { color: "RED", description: "You need to specify the time!" } });
    if (!time.endsWith("d") && !time.endsWith("h") && !time.endsWith("m") && !time.endsWith("s")) return message.channel.send(`You did not use the correct formatting for the time!`);

    let reason = args.slice(2).join(' ');
    if (!reason) reason = "undefined";



    if (member.roles.cache.find(role => role.name == "Muted")) return message.channel.send({ embed: { color: "RED", description: "This user is already muted!" } });

    let role = member.guild.roles.cache.find(role => role.name == "Muted");

    member.roles.add(role).then(user => message.channel.send({
        embed: {
            "description": `${message.member} tempmuted ${user}`,
            "color": 5855587,
            "author": {
                "name": `${user.user.username}`,
                "icon_url": `${user.user.avatarURL() !== null ? user.user.avatarURL() : 'https://cdn.discordapp.com/embed/avatars/0.png'}`
            },
            "fields": [
                {
                    "name": "time:",
                    "value": time,
                    'inline': true
                },
                {
                    "name": "reason:",
                    "value": reason,
                    'inline': true
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
                "description": `${message.member} tempmuted ${member.tag} for ${time} reason: ${reason}`
            }
        })
    }




    let doc = {
        guildID: message.guild.id,
        memberID: member.id,
        endTime: Date.now() + ms(time)
    };

    db.mute.insert(doc, function (err, newDoc) { });
    message.delete()


    setTimeout(() => {
        member.roles.remove(role)
            .then(member => {
                const { logsChannel } = require(`../guilds/${message.guild.name} lc.json`);
                if (logsChannel.id !== 'none') {
                    let lc = client.channels.cache.get(logsChannel.id);
                    lc.send({
                        embed: {
                            "color": '3B680D',
                            "description": `**${member.user.tag}** has been unmuted`
                        }
                    })
                }
            })
            .catch(err => {
                console.error(err);
            });
        db.mute.remove({ memberID: member.id, guildID: message.guild.id }, {}, function (err, numRemoved) { });
    }, ms(time));

};

exports.load = async client => {
    db.mute.find({}, function (err, docs) {
        if (docs == null) return;
        docs.forEach(async doc => {
            guildID = doc.guildID;
            let guild = client.guilds.cache.get(guildID);
            memberID = doc.memberID;
            let member = guild.members.cache.get(memberID);
            let timeLeft = doc.endTime - Date.now();
            if (timeLeft < 0) timeLeft = 0;
            setTimeout(() => {

                let role = member.guild.roles.cache.find(role => role.name == "Muted")

                member.roles.remove(role)
                    .then(member => {
                        const { logsChannel } = require(`../guilds/${guild.name} lc.json`);
                        if (logsChannel.id !== 'none') {
                            let lc = client.channels.cache.get(logsChannel.id);
                            lc.send({
                                embed: {
                                    "color": '3B680D',
                                    "description": `**${member.user.tag}** has been unmuted`
                                }
                            })
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
                db.mute.remove({ memberID: memberID, guildID: guildID }, {}, function (err, numRemoved) { });
            }, timeLeft);
        });
    });
};