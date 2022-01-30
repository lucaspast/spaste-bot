const fs = require('fs');

module.exports = {
    name: "message",
    run: async (client, message, prefix) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();


        if (cmd.length === 0) return;
        if (!fs.existsSync(`./commands/${cmd}.js`)) return;

        //delete require.cache[require.resolve(`./commands/${cmd}.js`)];
        const command = require(`../commands/${cmd}.js`);
        command.run(client, message, args);
    }
}