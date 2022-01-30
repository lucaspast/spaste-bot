const jsonsaver = require('../jsonsaver.js');

exports.run = async (client, message, args) => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
        let channel = message.channel;
        let guild = message.guild;
        var { welcomeChannel } = require(`../guilds/${guild.name} wc.json`);
        let hellosentence = welcomeChannel.hello;
        let roleName = welcomeChannel.autoRole;
        jsonsaver.wc(channel, guild, hellosentence, roleName);
        message.channel.send({ embed: { color: "GREEN", description: `successfully changed the welcome channel` } });
    } else {
        message.channel.send({ embed: { color: "RED", description: "you can't use this command!" } });
    }
}