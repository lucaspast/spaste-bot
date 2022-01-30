exports.run = async (member, client) => {
    try {
        var { welcomeChannel } = require(`../guilds/${member.guild.name} wc.json`);
        await client.channels.cache.get(welcomeChannel.id).send(`**${member.user.tag}** left the server`);
    } catch (err) {
        console.log(err);
    }
}