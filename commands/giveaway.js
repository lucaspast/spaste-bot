const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const path = require('path');
var Datastore = require('nedb');
let db = {};
db.giveaway = new Datastore(path.join('./databases', 'giveaway.db'));
db.giveaway.loadDatabase();


module.exports = {
    name: "giveaway",
    description: "Create a simple giveaway",
    usage: "<time> <channel> <winner amount> <role> <prize>",
    run: async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR'))
            return message.reply('you do not have the perms to use that command!⛔');
        if (!args[0]) return message.channel.send(`You did not specify your time!`);
        if (
            !args[0].endsWith("d") &&
            !args[0].endsWith("h") &&
            !args[0].endsWith("m") &&
            !args[0].endsWith("s")
        )
            return message.channel.send(
                `You did not use the correct formatting for the time!`
            );
        if (isNaN(args[0][0])) return message.channel.send(`That is not a number!`);
        let channel = message.mentions.channels.first();
        if (!channel)
            return message.channel.send(
                `I could not find that channel in the guild!`
            );

        let winnerAmount = args[2];
        if (!winnerAmount) return message.channel.send(
            `pls provide a winner amount!`
        ); else if (isNaN(winnerAmount)) return message.channel.send(
            `winner amount must be a number!`
        ); else if (winnerAmount < 1) return message.channel.send(
            `winner amount must be at least 1!`
        );
        winnerAmount = Math.round(winnerAmount);
        let winnerAmountSentence = `There are **${winnerAmount}** winners for this giveaway!`;
        if (winnerAmount == 1) {
            winnerAmountSentence = `There is **${winnerAmount}** winner for this giveaway!`;
        };


        let role_req = message.mentions.roles.first();
        if (isNaN(args.slice(3).join(" ").slice(3, 21))) {
            role_req = undefined;
        } else if (!message.guild.roles.cache.find(role => role.id == args.slice(3).join(" ").slice(3, 21))) {
            role_req = undefined;
        }
        let role_req_sentence = `You need ${role_req} to join!`;
        if (!role_req) role_req_sentence = "There are no requirements for this giveaway!";

        let prize = args.slice(4).join(" ");
        if (!role_req) prize = args.slice(3).join(" ");
        if (!prize) return message.channel.send(`No prize specified!`);
        message.channel.send(`*Giveaway created in ${channel}*`);
        let ends = Date.now() + ms(args[0]);
        let Embed = new MessageEmbed()
            .setTitle(`:tada:GIVEAWAY:tada:`)
            .setDescription(
                `${message.author} is hosting a giveaway for **${prize}**,\n ${role_req_sentence}\n ${winnerAmountSentence}`
            )
            .setFooter(`Ends`)
            .setTimestamp(ends)
            .setColor(`BLUE`);
        let m = await channel.send(Embed);
        m.react("🎉");

        let collector;
        if (role_req) {
            const filter = (reaction, user) => {
                return !user.bot;
            };
            collector = m.createReactionCollector(filter);
            collector.on('collect', (reaction, user) => {
                let member = m.guild.members.cache.get(user.id);
                if (member.roles.cache.some(role => role.id == role_req.id)) return;
                reaction.users.remove(user.id);
            });
        };

        if (!role_req) role_req = null;
        let doc = {
            channelIDs: {
                channel: m.channel.id,
                loggChannelID: message.channel.id
            },
            messageID: m.id,
            details: {
                winnerAmount: winnerAmount,
                prize: prize,
                role_req: role_req,
                endTime: Date.now() + ms(args[0])
            }
        };

        db.giveaway.insert(doc, function (err, newDoc) { });

        setTimeout(() => {
            if (m.reactions.cache.get("🎉").count <= 1) {
                message.channel.send(`Reactions: ${m.reactions.cache.get("🎉").count}`);
                return message.channel.send(
                    `Not enough people reacted for me to start draw a winner!`
                );
            };


            let winners = [];
            let reactedUsers = m.reactions.cache.get("🎉").users.cache.filter((u) => !u.bot);
            for (let i = 1; i <= winnerAmount && !reactedUsers.size < 1; i++) {
                let winner = reactedUsers.random();
                reactedUsers.delete(winner.id);
                winners.push(winner);
            };

            let winnerEmbedSentence = `**WINNERS:** ${winners}`
            if (winners.length == 1) {
                channel.send(
                    `The winner of the giveaway for **${prize}** is... ${winners}🎉`
                );
                winnerEmbedSentence = `**WINNER:** ${winners}`;
            } else channel.send(
                `The winners of the giveaway for **${prize}** are... ${winners}🎉`
            );

            let Embed = new MessageEmbed()
                .setTitle(`:tada:GIVEAWAY:tada:`)
                .setDescription(
                    `:confetti_ball:**PRIZE: ${prize.toUpperCase()}**\n:trophy:${winnerEmbedSentence}`
                )
                .setFooter(`Ended`)
                .setTimestamp(ends)
                .setColor(`RED`);
            m.edit(Embed);
            if (role_req) {
                collector.stop();
            }

            db.giveaway.remove({ messageID: m.id }, {}, function (err, numRemoved) { });
        }, ms(args[0]));
    },
    reroll: async (message, args) => {
        message.delete();
        if (!args[0]) return message.channel.send('Pls insert a ID.');
        let id = args[0];
        let winnerAmount = args[1];
        if (!winnerAmount) return message.channel.send(
            `pls provide a winner amount!`
        ); else if (isNaN(winnerAmount)) return message.channel.send(
            `winner amount must be a number!`
        ); else if (winnerAmount < 1) return message.channel.send(
            `winner amount must be at least 1!`
        );
        let found = false;
        let m = await message.channel.messages.fetch(id).catch(err => { });
        if (m) {
            found = true;
            if (!m.reactions.cache.get("🎉")) {
                return message.channel.send(
                    `This message doesn't has any of the right reactions, make sure you copy the ID from a giveaway message!`
                );
            }
            else if (m.reactions.cache.get("🎉").count <= 1) {
                message.channel.send(`Reactions: ${m.reactions.cache.get("🎉").count}`);
                return message.channel.send(
                    `Not enough people reacted for me to start draw a winner!`
                );
            }

            let winners = [];
            let reactedUsers = m.reactions.cache.get("🎉").users.cache.filter((u) => !u.bot);
            for (let i = 1; i <= winnerAmount && !reactedUsers.size < 1; i++) {
                let winner = reactedUsers.random();
                reactedUsers.delete(winner.id);
                winners.push(winner);
            };
            let winnerEmbedSentence = `**WINNERS:** ${winners}`
            if (winners.length == 1) {
                message.channel.send(
                    `The new winner of the giveaway is... ${winners}🎉`
                );
                winnerEmbedSentence = `**WINNER:** ${winners}`;
            } else message.channel.send(
                `The new winners of the giveaway are... ${winners}🎉`
            );

            let prize = m.embeds[0].description.split("**PRIZE: ");
            prize = prize[1].split('**');
            prize = prize[0];
            let ends = m.embeds[0].timestamp;
            let Embed = new MessageEmbed()
                .setTitle(`:tada:GIVEAWAY:tada:`)
                .setDescription(
                    `:confetti_ball:**PRIZE: ${prize.toUpperCase()}**\n:trophy:${winnerEmbedSentence}`
                )
                .setFooter(`Ended`)
                .setTimestamp(ends)
                .setColor(`RED`);
            m.edit(Embed);
        };
        if (!found) {
            return message.channel.send("Didn't found the message make sure you are in the same channel as the giveaway.");
        };
    }, load: async (client) => {
        db.giveaway.find({}, function (err, docs) {
            if (docs == null) return;
            docs.forEach(async doc => {
                let channel = client.channels.cache.get(doc.channelIDs.channel);
                let message = {};
                message.channel = client.channels.cache.get(doc.channelIDs.loggChannelID);
                let winnerAmount = doc.details.winnerAmount;
                let prize = doc.details.prize;
                let role_req = doc.details.role_req;
                if (role_req == null) role_req = undefined;
                let ends = doc.details.endTime;
                let timeLeft = ends - Date.now();

                let m = await channel.messages.fetch(doc.messageID).catch(err => { });
                if (m) {

                    async function endGiveaway() {
                        if (m.reactions.cache.get("🎉").count <= 1) {
                            message.channel.send(`Reactions: ${m.reactions.cache.get("🎉").count}`);
                            return message.channel.send(
                                `Not enough people reacted for me to start draw a winner!`
                            ), db.giveaway.remove({ messageID: m.id }, {}, function (err, numRemoved) { });
                        };


                        let winners = [];
                        let reactedUsers = m.reactions.cache.get("🎉").users.cache.filter((u) => !u.bot);
                        for (let i = 1; i <= winnerAmount && !reactedUsers.size < 1; i++) {
                            let winner = reactedUsers.random();
                            reactedUsers.delete(winner.id);
                            winners.push(winner);
                        };

                        let winnerEmbedSentence = `**WINNERS:** ${winners}`
                        if (winners.length == 1) {
                            channel.send(
                                `The winner of the giveaway for **${prize}** is... ${winners}🎉`
                            );
                            winnerEmbedSentence = `**WINNER:** ${winners}`;
                        } else channel.send(
                            `The winners of the giveaway for **${prize}** are... ${winners}🎉`
                        );

                        let Embed = new MessageEmbed()
                            .setTitle(`:tada:GIVEAWAY:tada:`)
                            .setDescription(
                                `:confetti_ball:**PRIZE: ${prize.toUpperCase()}**\n:trophy:${winnerEmbedSentence}`
                            )
                            .setFooter(`Ended`)
                            .setTimestamp(ends)
                            .setColor(`RED`);
                        m.edit(Embed);
                        if (role_req) {
                            collector.stop();
                        }
                        return db.giveaway.remove({ messageID: m.id }, {}, function (err, numRemoved) { });
                    };

                    if (timeLeft <= 0) {
                        endGiveaway();
                    } else if (timeLeft > 0) {
                        setTimeout(() => {
                            endGiveaway();
                        }, timeLeft);
                    }

                }

            });
        });
    }
};