const jsonSaver = require('../jsonsaver.js');
const fs = require('fs');

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_ROLES'))
        return message.reply('you do not have the perms to use that command!⛔');

    let controler = message.author;
    let QChannel = message.channel;
    const filter = m => m.member.id == controler.id;

    let usedContent = null;
    let usedEmbed = null;
    let usedColorEmbed = null;
    let usedEmojiRoles = [];
    let usedChannel = null;

    const usedContentF = async () => {
        await QChannel.send({ embed: { color: "BLUE", description: "What do you want the message to say?" } }).then(message => {
            QChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(async collected => {
                    usedContent = collected.first().content;
                    usedEmbedF();
                })
                .catch((err) => { QChannel.send('cancelled the rs set-up out of time(max. 10min).') });
        });
    };


    const usedEmbedF = async () => {
        await QChannel.send({ embed: { color: "BLUE", description: "Do you wanne use a embed?(yes/no)" } }).then(message => {
            QChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(async collected => {
                    message = collected.first();
                    if (message.content.toLowerCase().startsWith("yes")) {
                        usedEmbed = true;
                        usedColorEmbedF();
                    } else if (message.content.toLowerCase().startsWith("no")) {
                        usedEmbed = false;
                        await QChannel.send("you're message will look like this:");
                        await QChannel.send(usedContent)
                            .then(() => {
                                keepembedF();
                            })
                    } else {
                        message.reply('pls use yes or no!');
                        usedEmbedF();
                    }
                })
                .catch((err) => {
                    QChannel.send('cancelled the rs set-up out of time(max. 10min).')
                    console.log(err)
                });
        });
    };


    const usedColorEmbedF = async () => {
        await QChannel.send({ embed: { color: "BLUE", description: "Wich color do you want the embed to have?" } }).then(message => {
            QChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(async collected => {
                    message = collected.first();
                    if (message.content.toUpperCase() == 'GREEN' ||
                        message.content.toUpperCase() == 'BLUE' ||
                        message.content.toUpperCase() == 'RED' ||
                        message.content.toUpperCase() == 'BLACK' ||
                        message.content.toUpperCase() == 'PURPLE' ||
                        message.content.toUpperCase() == 'ORANGE' ||
                        message.content.toUpperCase() == 'YELLOW'
                    ) {
                        usedColorEmbed = message.content.toUpperCase();
                        await QChannel.send("you're message will look like this:")
                        await QChannel.send({ embed: { color: usedColorEmbed, description: usedContent } })
                            .then(() => {
                                keepembedF();
                            })
                    } else {
                        message.channel.send(
                            'Invalid color!\n[GREEN, BLUE, RED, BLACK, PURPLE, ORANGE, YELLOW]'
                        )
                        usedColorEmbedF();
                    }
                })
                .catch((err) => { QChannel.send('cancelled the rs set-up out of time(max. 10min).') });
        });
    };

    const keepembedF = async () => {
        await QChannel.send({ embed: { color: "BLUE", description: "Do you wanne keep it?(yes/no)" } }).then(message => {
            QChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(async collected => {
                    message = collected.first();
                    if (message.content.toLowerCase().startsWith("yes")) {
                        usedEmojiRolesF();
                    } else if (message.content.toLowerCase().startsWith("no")) {
                        return this.run(client, message, args);
                    } else {
                        message.reply('pls use yes or no!');
                        keepembedF();
                    }
                })
                .catch((err) => { QChannel.send('cancelled the rs set-up out of time(max. 10min).') });
        });
    };

    const usedEmojiRolesF = async () => {
        await QChannel.send({ embed: { color: "BLUE", description: "Wich reactions for what roles do you wanne use? Do it like this:\n `<emoji>` `<role mention>`" } }).then(message => {
            QChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(async collected => {
                    message = collected.first();

                    let emargs = message.content.split(" ");
                    let emoji = emargs[0].toString();
                    let role = message.mentions.roles.first();
                    let validEmoji = false;

                    try {
                        await message.react(`${emoji}`).then(() => validEmoji = true)
                            .catch(err => validEmoji = false)
                    } catch (err) {
                        validEmoji = false
                    }

                    if (validEmoji == true) {
                        if (role) {
                            let reaRoleObj = {
                                emoji: emoji,
                                role: role.id
                            }

                            usedEmojiRoles.push(reaRoleObj);
                            moreEmojiF();
                        } else {
                            message.reply('pls mention a role!');
                            usedEmojiRolesF();
                        }
                    } else {
                        message.reply('pls use a valid emoji!');
                        usedEmojiRolesF();
                    }
                })
                .catch((err) => { QChannel.send('cancelled the rs set-up out of time(max. 10min).') });
        });
    };

    const moreEmojiF = async () => {
        await QChannel.send({ embed: { color: "BLUE", description: "do you want to add more reaction roles to this message?(yes/no)" } }).then(message => {
            QChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(async collected => {
                    message = collected.first();

                    if (message.content.toLowerCase().startsWith("yes")) {
                        usedEmojiRolesF();
                    } else if (message.content.toLowerCase().startsWith("no")) {
                        usedChannelF();
                    } else {
                        message.reply('pls use yes or no!');
                        moreEmojiF();
                    }
                })
                .catch((err) => { QChannel.send('cancelled the rs set-up out of time(max. 10min).') });
        });
    };

    const usedChannelF = async () => {
        await QChannel.send({ embed: { color: "BLUE", description: "Wich channel you want the message to be in?" } }).then(message => {
            QChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(async collected => {
                    message = collected.first();

                    usedChannel = message.mentions.channels.first();
                    if (usedChannel) {
                        reaRoleConstructer(usedChannel, usedEmbed, usedContent, usedEmojiRoles, usedColorEmbed).then(async res => {
                            await jsonSaver.RR(usedEmojiRoles, res.id, QChannel.guild)
                            QChannel.send({ embed: { color: "GREEN", description: "created the reaction role message!✅" } })

                            runCol(res, res.id);
                        })
                    } else {
                        message.reply('pls mention a channel!');
                        usedChannelF();
                    }
                })
                .catch((err) => { QChannel.send('cancelled the rs set-up out of time(max. 10min).') });
        });
    };

    usedContentF();
};

async function reaRoleConstructer(channel, usedEmbed, content, usedEmojiRoles, color) {
    let msg;
    if (usedEmbed == true) {
        await channel.send({ embed: { color: color, description: content } }).then(x => {
            msg = x;
        })

        await usedEmojiRoles.forEach(x => {
            msg.react(x.emoji)
        });

    } else {
        await channel.send(content).then(x => {
            msg = x;
        });

        await usedEmojiRoles.forEach(x => {
            msg.react(x.emoji)
        });

    }

    return msg
}

async function runCol(msg, id) {
    let guild = msg.guild;
    let file = require(`../rearoles/${guild.name} ${id}.json`)
    const filter = (reaction, user) => {
        return user.id !== msg.author.id;

    };

    const collector = msg.createReactionCollector(filter);
    collector.on('collect', (reaction, user) => {
        for (let i = 0; file.reactionRoles.length > i; i++) {
            if (reaction.emoji.name == file.reactionRoles[i].emoji) {
                let member = guild.members.cache.get(user.id);

                if (!member.roles.cache.find(role => role.id == file.reactionRoles[i].role)) {
                    try {
                        let role = reaction.message.guild.roles.cache.get(file.reactionRoles[i].role);
                        member.roles.add(role);
                        reaction.users.remove(member.id);
                    } catch (err) {
                        console.log(err)
                    };
                }
                else if (member.roles.cache.find(role => role.id == file.reactionRoles[i].role)) {
                    try {
                        let role = reaction.message.guild.roles.cache.get(file.reactionRoles[i].role);
                        member.roles.remove(role);
                        reaction.users.remove(member.id);
                    } catch (err) {
                        console.log(err)
                    };
                };
            };
        };
    });
};

exports.collecters = async client => {
    let msgFiles = fs.readdirSync("./rearoles");
    msgFiles.forEach(async msgFile => {
        let file = require(`../rearoles/${msgFile}`);
        client.guilds.cache.forEach(async guild => {
            guild.channels.cache.forEach(async channel => {
                if (channel.type == 'text') {

                    let message = await channel.messages.fetch(file.messageID).catch(err => { });

                    if (message) {
                        const filter = (reaction, user) => {
                            return user.id !== message.author.id;
                        };
                        const collector = message.createReactionCollector(filter);

                        collector.on('collect', (reaction, user) => {
                            for (let i = 0; file.reactionRoles.length > i; i++) {
                                if (reaction.emoji.name == file.reactionRoles[i].emoji) {
                                    let member = guild.members.cache.get(user.id);

                                    if (!member.roles.cache.find(role => role.id == file.reactionRoles[i].role)) {
                                        try {
                                            let role = reaction.message.guild.roles.cache.get(file.reactionRoles[i].role);
                                            member.roles.add(role);
                                            reaction.users.remove(member.id);
                                        } catch (err) {
                                            console.log(err)
                                        };
                                    }
                                    else if (member.roles.cache.find(role => role.id == file.reactionRoles[i].role)) {
                                        try {
                                            let role = reaction.message.guild.roles.cache.get(file.reactionRoles[i].role);
                                            member.roles.remove(role);
                                            reaction.users.remove(member.id);
                                        } catch (err) {
                                            console.log(err)
                                        };
                                    };
                                };
                            };
                        });
                    }
                }
            });
        });
    });
};