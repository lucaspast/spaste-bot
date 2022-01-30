const jsonSaver = require('../jsonsaver.js');
const fs = require('fs');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('pls provide a reaction role message ID!');
    const guild = message.guild;
    if (fs.existsSync(`./rearoles/${guild.name} ${args[0]}.json`)) {
        guild.channels.cache.forEach(async channel => {
            if (channel.type == 'text') {
                let msg = await channel.messages.fetch(args[0]).catch(err => { });
                if (!msg) return;
                fs.unlinkSync(`./rearoles/${guild.name} ${msg.id}.json`);
                msg.delete();
                return message.channel.send("Successfuly removed the reaction role message!");
            }
        })
    } else {
        return message.channel.send('The given message id is not recognized as a reaction role message id!');
    }
};