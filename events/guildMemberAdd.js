exports.run = async (member, client) => {
    var { welcomeChannel } = require(`../guilds/${member.guild.name} wc.json`);
    if (welcomeChannel.hello.includes("{user}")) {
        let args = welcomeChannel.hello.split("{user}");
        client.channels.cache.get(welcomeChannel.id).send(`${args[0]}${member.user}${args[1]}`).catch(console.error);
    } else {
        client.channels.cache.get(welcomeChannel.id).send(`${welcomeChannel.hello}`).catch(console.error);
    }
    if (welcomeChannel.autoRole !== "none") {
        try {
            var role = member.guild.roles.cache.find(role => role.name == welcomeChannel.autoRole)
            member.roles.add(role);
        } catch (err) {
            console.error(err);
        }
    }

    if (member.guild.id == "705398092006031472") {
        let nick = `spastische ${member.displayName}`
        member.setNickname(nick)
            .catch(err => console.error(err));
    }
}