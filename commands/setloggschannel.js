const jsonsaver = require('../jsonsaver.js');

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send({ embed: { color: "RED", description: "you can't use this command!" } });
    }
    let guild = message.guild
    let channel = message.channel
    if (!message.content.includes("none")) {
        message.channel.send({ embed: { color: "GREEN", description: `successfully changed the logs channel` } });
        return jsonsaver.lc(channel, guild)
    }

    channel = "none";
    jsonsaver.lc(channel, guild);
    return message.channel.send({ embed: { color: "GREEN", description: `successfully changed the logs channel` } })
}