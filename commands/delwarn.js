const jsonsaver = require('../jsonsaver.js');
let fs = require('fs');

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send('you dont have perms for this command!')
    let user = message.mentions.members.first();
    if (!user) return message.channel.send("you didn't input a user!");
    if (user.id == message.author.id) return message.channel.send("you can't delete your own warns!");

    if (!fs.existsSync(`./warns/${message.guild.name} ${user.id}.json`)) return message.channel.send("This user doesn't have any warns!");

    let content = message.content.split(' ');
    let newPrefix = content[0];
    args = message.content.slice(newPrefix.length).trim().split(/ +/g);

    if (isNaN(args[1])) return message.channel.send("you didn't input the number of the warn!");
    let number = args[1];

    delete require.cache[require.resolve(`../warns/${message.guild.name} ${user.id}.json`)];
    let file = require(`../warns/${message.guild.name} ${user.id}.json`);
    let FWarns = file.warns;

    if (number > FWarns.length || number < 1) return message.channel.send(`the provided number of warn doesn't exist!(max: ${FWarns.length}, min: 1)`);

    let warns = [];
    for (let i = 0; i < FWarns.length; i++) {
        if (number - 1 !== i) {
            let objwa = {
                mod: FWarns[i].warn.mod,
                reason: FWarns[i].warn.reason
            }
            warns.push(objwa);
        }
    }

    user.warns = warns;
    if (user.warns == []) {
        fs.unlinkSync(`./warns/${message.guild.name} ${user.id}.json`);
    } else {
        let guild = message.guild;
        jsonsaver.wa(warns, guild, user);
    };

    return message.channel.send(`removed warn #${args[1]}!`)
};