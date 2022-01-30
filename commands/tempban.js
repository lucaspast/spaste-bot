const ms = require('ms');
const path = require('path');
var Datastore = require('nedb');
let db = {};
db.ban = new Datastore(path.join('./databases', 'ban.db'));
db.ban.loadDatabase();

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS'))
        return message.channel.send({ embed: { color: "RED", description: "You can't use this command!" } });
    let guild = message.guild;
    let member = message.mentions.members.first();
    if (!member) return message.channel.send({ embed: { color: "RED", description: "You need to input a user!" } });

    let time = args[1];
    if (!time) return message.channel.send({ embed: { color: "RED", description: "You need to specify the time!" } });
    if (!time.endsWith("d") && !time.endsWith("h") && !time.endsWith("m") && !time.endsWith("s")) return message.channel.send(`You did not use the correct formatting for the time!`);

    let reason = args.slice(2).join(' ');
    if (!reason) reason = "undefined";

    await member.send(`You where band from **${guild}** by ${message.author} for ${time} reason:** ${reason}**`);
    member.ban()
        .catch(err => {
            console.error(err);
            message.channel.send({ embed: { color: "RED", description: "error uhg!" } });
        })

    let doc = {
        guildID: message.guild.id,
        memberID: member.id,
        endTime: Date.now() + ms(time)
    };

    db.ban.insert(doc, function (err, newDoc) { });
    message.delete();

    setTimeout(() => {
        guild.members.unban(member.id)
            .catch(err => {
                console.error(err);
            });
        db.ban.remove({ memberID: member.id, guildID: guild.id }, {}, function (err, numRemoved) { });
    }, ms(time));
};


exports.load = async (client) => {
    db.ban.find({}, function (err, docs) {
        if (docs == null) return;
        docs.forEach(async doc => {
            guildID = doc.guildID;
            let guild = client.guilds.cache.get(guildID);
            memberID = doc.memberID;
            let timeLeft = doc.endTime - Date.now();
            if (timeLeft < 0) timeLeft = 0;

            setTimeout(() => {
                guild.members.unban(memberID)
                    .catch(err => {
                        console.error(err);
                    });
                db.ban.remove({ memberID: memberID, guildID: guildID }, {}, function (err, numRemoved) { });
            }, timeLeft);
        })
    });
};