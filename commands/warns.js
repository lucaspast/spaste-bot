exports.run = async (client, message, args) => {
    let user;
    if (message.member.hasPermission('MUTE_MEMBERS')) {
        user = message.mentions.members.first();
        if (!user) user = message.member;
    } else if (message.mentions.members.first() == undefined || message.mentions.members.first() == message.member) {
        user = message.member;
    } else {
        return message.channel.send("you dont have the perms to list others there warns")
    }

    if (user.warns) {
        let warns = user.warns;
        content = [];
        for (let i = 0; i < warns.length; i++) {
            content[i] = `\nwarn ${i + 1} reason: ${warns[i].reason}, mod: ${warns[i].mod}`;
        }
        message.channel.send({ embed: { color: "RED", description: `${user.user.username} has ${warns.length} warns! ${content}` } });
    } else {
        message.channel.send(`${user.user.username} doesn't have any warns!`);
    }
}