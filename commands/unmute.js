const constructMute = require('../creamuted.js')
const path = require('path');
var Datastore = require('nedb');
let db = {};
db.mute = new Datastore(path.join('./databases', 'mute.db'));
db.mute.loadDatabase();

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MUTE_MEMBERS')) {
        return message.channel.send({ embed: { color: "RED", description: "you can't use this command!" } });
    }

    if (!message.guild.roles.cache.find(role => role.name == "Muted")) {
        let guild = message.guild;
        constructMute.run(guild);
        db.mute.remove({ memberID: member.id, guildID: message.guild.id }, {}, function (err, numRemoved) { })
        return message.channel.send({ embed: { color: "GREEN", description: "successfully unmuted ${user}" } });
    }

    let user = message.mentions.members.first();
    if (!user) return message.channel.send({ embed: { color: "RED", description: "You need to mention the user!" } });

    if (!user.roles.cache.find(role => role.name == "Muted")) return message.channel.send({ embed: { color: "RED", description: "This user isn't muted!" } });

    let role = user.guild.roles.cache.find(role => role.name == "Muted");
    user.roles.remove(role).then(user => {
        message.channel.send({ embed: { color: "GREEN", description: `successfully unmuted ${user}` } })
    });
    db.mute.remove({ memberID: member.id, guildID: message.guild.id }, {}, function (err, numRemoved) { });
}