exports.run = async (client, message, args) => {
    if (message.member.hasPermission('KICK_MEMBERS')) {
        try {
            let member = message.mentions.members.first();
            if (!member) return message.channel.send('pls mention a user.');
            member.kick();
            message.channel.send(`${member.user.tag} has been kicked`).then(msg => {
                setTimeout(() => {
                    msg.delete();
                    message.delete();
                }, 5000);
            });
        } catch (err) {
            console.error(err)
        }
    }
}