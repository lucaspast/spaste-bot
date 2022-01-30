const jsonsaver = require('../jsonsaver.js');

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send({ embed: { color: "RED", description: "you can't use this command!" } });
    }

    let args = message.content.split('setautorole ');
    let roleName = args[1];
    if (!roleName) return message.channel.send({ embed: { color: "RED", description: "You need to input a role name!" } });

    let role = message.guild.roles.cache.find(role => role.name == roleName)
    if (!role) return message.channel.send({ embed: { color: "RED", description: "this role doesn't exist!" } });

    var { welcomeChannel } = require(`./guilds/${message.guild.name} wc.json`);
    let channel = client.channels.cache.get(welcomeChannel.id);
    let guild = message.guild;
    let hellosentence = welcomeChannel.hello;

    jsonsaver.wc(channel, guild, hellosentence, roleName);
    message.channel.send({ embed: { color: "GREEN", description: `successfully changed the AutoRole to ${roleName}` } });
}