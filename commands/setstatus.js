const fs = require('fs');

exports.run = async (client, message, args) => {
    try {
        let args = message.content.split("setstatus ");
        const activity = args[1];
        if (!activity) {
            message.channel.send({ embed: { color: "RED", description: "pls geef een status op na de command" } })
        } else {

            client.user.setActivity(activity);
            message.channel.send({ embed: { color: "GREEN", description: `status has been changed to ${activity}` } });

            let objbm = {
                "botmemory": {
                    "activity": activity
                }
            }
            jsonData = JSON.stringify(objbm);
            fs.writeFile(`./JSON trash/botmemory.json`, jsonData, function (err) {
                console.log(err);
            });
            theactivity = activity;
            message.delete();
            if (message.guild.name === "spaste server") {
                client.channels.cache.get("744518619945369621").send({ embed: { color: "GREEN", description: `${message.author} heeft de status veranderd naar "${theactivity}"!` } });
            }
        }
    } catch (err) {
        message.channel.send({ embed: { color: "RED", description: "error uhg!" } });
        console.log(err);
    }
}