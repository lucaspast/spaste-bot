module.exports = {
    name: "message",
    run: async (client, message, args) => {
        let ontvanger = message.mentions.members.first();
        let bericht = message.content.slice(32);

        try {
            if (!bericht) {
                message.delete();
                message.channel.send({ embed: { color: "RED", description: 'de opsteling van het bericht is verkeer je moet het zo doen:\n<message <mention> <bericht>' } });
            } else {
                if (message.guild.name === "spaste server") {
                    client.channels.cache.get("744518619945369621").send({ embed: { color: "GREEN", description: `${message.author} stuurde "${bericht}" naar ${ontvanger}` } });
                }
                message.delete();
                ontvanger.send(bericht);
            }
        } catch (err) {
            if (message.guild.name === "spaste server") {
                client.channels.cache.get("744518619945369621").send({ embed: { color: "RED", description: `er was een error bij de command <message : ${err}` } });
            }
            message.delete();
        }
    }
}