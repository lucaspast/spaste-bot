const Discord = require('discord.js');

exports.run = async (guild, user, client) => {
    const { logsChannel } = require(`../guilds/${guild.name} lc.json`);
    if (logsChannel.name !== "none") {
        const banaddembed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`ban add`)
            .setAuthor(`${user.tag}`, `${user.avatarURL()}`)
            .setDescription(`${user.tag} has been band!`)
            .setTimestamp()
            .setFooter(`${user.id}`, `${user.avatarURL()}`)


        let lc = client.channels.cache.get(logsChannel.id);
        lc.send(banaddembed).catch(_err => {
            const banaddembed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`ban add`)
                .setAuthor(`${user.tag}`, `https://cdn.discordapp.com/embed/avatars/0.png`)
                .setDescription(`${user.tag} has been band!`)
                .setTimestamp()
                .setFooter(`${user.id}`, `https://cdn.discordapp.com/embed/avatars/0.png`)


            let lc = client.channels.cache.get(logsChannel.id);
            lc.send(banaddembed)
        })
    }
};