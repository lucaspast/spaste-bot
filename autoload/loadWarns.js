let fs = require('fs');

exports.run = async function (client) {
    client.guilds.cache.forEach(async function (guild) {
        guild.members.cache.forEach(async function (member) {
            if (fs.existsSync(`./warns/${guild.name} ${member.id}.json`)) {
                let user = member;
                let file = require(`../warns/${guild.name} ${user.id}.json`);
                user.warns = [];
                for (let i = 0; i < file.warns.length; i++) {
                    user.warns.push(file.warns[i].warn);
                }
            }

        });
    });
};