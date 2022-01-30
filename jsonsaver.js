let fs = require('fs');

exports.lc = function (channel, guild) {
    if (channel == "none") {
        let objlc = {
            "logsChannel": {
                "id": "none",
                "name": "none"
            }
        }
        jsonData = JSON.stringify(objlc);
        fs.writeFile(`./guilds/${guild.name} lc.json`, jsonData, function (err) {
            console.log(err);
        })
        try {
            const { logsChannel } = require(`./guilds/${guild.name} lc.json`)
            logsChannel.id = "none";
            logsChannel.name = "none";
        } catch (err) {
            console.log(err);
        }
    } else {
        let objlc = {
            "logsChannel": {
                "id": channel.id,
                "name": channel.name
            }
        }
        jsonData = JSON.stringify(objlc);
        fs.writeFile(`./guilds/${guild.name} lc.json`, jsonData, function (err) {
            console.log(err);
        })
        try {
            const { logsChannel } = require(`./guilds/${guild.name} lc.json`)
            logsChannel.id = channel.id;
            logsChannel.name = channel.name;
        } catch (err) {
            console.log(err);
        }
    }
}



exports.wc = function (channel, guild, hellosentence, roleName) {
    let objwc = {
        "welcomeChannel": {
            "id": channel.id,
            "name": channel.name,
            "hello": hellosentence,
            "autoRole": roleName
        }
    }
    jsonData = JSON.stringify(objwc);
    fs.writeFile(`./guilds/${guild.name} wc.json`, jsonData, function (err) {
        console.log(err);
    })
    try {
        const { welcomeChannel } = require(`./guilds/${guild.name} wc.json`);
        welcomeChannel.id = channel.id;
        welcomeChannel.name = channel.name;
        welcomeChannel.hello = hellosentence;
        welcomeChannel.role = roleName;
    } catch (err) {
        console.log(err);
    }
}

/**
 * 
 * @param {param} warn de warn
 * @param {param} guild de guild
 * @param {param} user de user
 */
exports.wa = async function (warn, guild, user) {
    let warns = [];
    for (let i = 0; i < warn.length; i++) {
        let objwa = {
            "numberWa": i,
            "warn": warn[i]
        }
        warns.push(objwa);
    }
    let objWaSec = {
        "warns": warns
    }
    jsonData = JSON.stringify(objWaSec);
    fs.writeFileSync(`./warns/${guild.name} ${user.id}.json`, jsonData, function (err) {
        console.log(err);
    })
};


exports.RR = async (usedEmojiRoles, id, guild) => {
    let jsonobj = {
        messageID: id,
        reactionRoles: usedEmojiRoles
    }

    jsonData = JSON.stringify(jsonobj);
    fs.writeFileSync(`./rearoles/${guild.name} ${id}.json`, jsonData, function (err) {
        console.log(err);
    })
};