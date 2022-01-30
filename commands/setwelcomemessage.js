const jsonsaver = require('../jsonsaver.js');

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send({ embed: { color: "RED", description: "you can't use this command!" } });
    }


    //let args = message.content.split('setwelcomemessage ');
    let hellosentence = args[1];
    if (!hellosentence) return message.channel.send({ embed: { color: "RED", description: "You need to input a welcome sentence!" } });

    var { welcomeChannel } = require(`./guilds/${message.guild.name} wc.json`);
    let channel = client.channels.cache.get(welcomeChannel.id);
    let guild = message.guild;
    let roleName = welcomeChannel.autoRole;

    jsonsaver.wc(channel, guild, hellosentence, roleName);

    if (!message.content.includes("{user}")) {
        message.channel.send("**handy dandy tip:** you can use {user} to mention the user!");
        return message.channel.send({ embed: { color: "GREEN", description: `successfully changed the welcome sentence to: ${hellosentence}` } });
    }

    message.channel.send({ embed: { color: "GREEN", description: `successfully changed the welcome sentence to: ${hellosentence}` } });
}