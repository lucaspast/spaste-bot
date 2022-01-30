exports.run = async function (client, message, args) {
    if (!message.member.hasPermission('BAN_MEMBERS'))
        return message.channel.send({ embed: { color: "RED", description: "You can't use this command!" } });
    let userinfo = message.content.slice(7);
    if (!userinfo) return message.channel.send(`Please provide a ID or username!`);
    let found = false;

    message.guild.members.unban(userinfo)
        .catch(error => {
            console.error(error)
            message.guild.fetchBans().then(banned => {
                banned.forEach(user => {
                    if (userinfo == user.user.username) {
                        message.guild.members.unban(user.user.id)
                            .catch(error => console.error(error));
                        found = true;
                    }
                })
            })
                .then(x => {
                    if (found == false) {
                        message.channel.send('please provide a valid ID or username from a user thats band!');
                    }
                })
        })
};