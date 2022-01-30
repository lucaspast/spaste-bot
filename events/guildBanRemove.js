const Discord = require('discord.js');
const path = require('path');
var Datastore = require('nedb');
let db = {};
db.ban = new Datastore(path.join('./databases', 'ban.db'));
db.ban.loadDatabase();

exports.run = async (guild, user, client) => {
    const { logsChannel } = require(`../guilds/${guild.name} lc.json`);
    if (logsChannel.name !== "none") {

        const banremoveembed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('ban removed')
            .setAuthor(`${user.tag}`, `${user.avatarURL()}`)
            .setDescription(`${user.tag} has been unband!`)
            .setTimestamp()
            .setFooter(`${user.id}`, `${user.avatarURL()}`);

        let lc = client.channels.cache.get(logsChannel.id);
        lc.send(banremoveembed).catch(_err => {
            const banremoveembed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('ban removed')
                .setAuthor(`${user.tag}`, `https://cdn.discordapp.com/embed/avatars/0.png`)
                .setDescription(`${user.tag} has been unband!`)
                .setTimestamp()
                .setFooter(`${user.id}`, `https://cdn.discordapp.com/embed/avatars/0.png`);

            let lc = client.channels.cache.get(logsChannel.id);
            lc.send(banremoveembed);

            db.ban.remove({ memberID: user.id, guildID: guild.id }, {}, function (err, numRemoved) { });
        })
    }
};