const constructMute = require('../creamuted.js');
const jsonsaver = require('../jsonsaver.js');


module.exports = {
    name: "message",
    run: async (guild) => {
        var found = false;
        var hellosentence = `Welcome {user} to the server!`;
        var roleName = "none";
        guild.channels.cache.forEach(function (channel, _id) {
            if (found == true || channel.type != "text") {
                return;
            }

            if (guild.me.permissionsIn(channel).has("SEND_MESSAGES") && guild.me.permissionsIn(channel).has("VIEW_CHANNEL")) {
                found = true;
                channel.send({ embed: { color: "RANDOM", description: "Thanks for inviting me, type <help to get a list of commands" } });
                channel = "none";
                jsonsaver.lc(channel, guild);
                return jsonsaver.wc(channel, guild, hellosentence, roleName);
            }
        })

        if (!guild.roles.cache.find(role => role.name == "Muted")) {
            constructMute.run(guild);
        }
    }
}