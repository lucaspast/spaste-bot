let fs = require('fs');

module.exports = {
    name: "guildDelete",
    run: async (guild) => {
        console.log(`removed uit de server ${guild.name}`);
        fs.unlink(`./guilds/${guild.name} wc.json`, err => {
            console.log(err);
        })
        fs.unlink(`./guilds/${guild.name} lc.json`, err => {
            console.log(err);
        })
    }
}