const fs = require('fs');
const bcrypt = require('bcrypt');

const express = require('express');
const Datastore = require('nedb');
let db = {};
db.web = new Datastore('database.db');
db.web.loadDatabase();

const app = express();
app.listen(80, () => { console.log("listening!") });
app.use(express.static('public'));
app.use(express.json({ limit: '20gb' }));

app.post('/api', async (req, res) => {
    const data = req.body;
    if (data.cmd) {
        if (fs.existsSync(`./web cmds/${data.cmd}.js`)) {
            const cmd = require(`./web cmds/${data.cmd}`);
            cmd.run(data).then(async json => {
                console.log(json)
                return res.json(json);
            });
        }
    }
});

app.post('/login', async (req, res) => {
    const data = req.body;
    let username = data.username;
    let password = data.password;

    db.web.find({ username: username }, (err, docs) => {
        if (err !== null) return console.error(err), res.json({ status: 'error' });
        if (docs[0]) {
            bcrypt.compare(password, docs[0].password, (err, isMatch) => {
                if (err) console.error(err);

                if (isMatch) {
                    return res.json({ status: '+' });
                } else {
                    return res.json({ status: '-' });
                }
            });
        } else {
            res.json({ status: 'wrongU' });
        }
    });
});

app.post('/register', async (req, res) => {
    const data = req.body;
    let username = data.username;
    let password = data.password;

    bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(password, salt,
            (err, hash) => {
                if (err) throw err;
                password = hash;

                db.web.insert({ username: username, password: password, dateOfRegistration: Date.now() });
                res.redirect('');
            }));
});

app.use(function (req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
        res.sendFile(__dirname + '/public/404.html');
        return
    }

    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return
    }

    res.type('txt').send('Not found');
});

const discord = require('discord.js');
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { prefix, token } = require('./config.json');

client.login(token);

client.on('ready', () => {
    const e_ready = require("./events/ready.js");
    e_ready.run(client);
});

//client.on('message', message => {
//  const e_message = require("./events/message.js");
//e_message.run(client, message, prefix);
// });

client.on('guildCreate', guild => {
    const e_guildCreate = require("./events/guildCreate.js");
    e_guildCreate.run(guild);
})

client.on("guildDelete", guild => {
    const e_guildDelete = require("./events/guildDelete.js");
    e_guildDelete.run(guild);
});

client.on("channelCreate", channel => {
    const e_channelCreate = require("./events/channelCreate.js");
    e_channelCreate.run(channel);
});

client.on("guildBanAdd", (guild, user) => {
    const e_guildBanAdd = require("./events/guildBanAdd.js");
    e_guildBanAdd.run(guild, user, client);
});

client.on("guildBanRemove", (guild, user) => {
    const e_guildBanRemove = require("./events/guildBanRemove.js");
    e_guildBanRemove.run(guild, user, client);
});

client.on("guildMemberAdd", async member => {
    const e_guildMemberAdd = require("./events/guildMemberAdd.js");
    e_guildMemberAdd.run(member, client);
});

client.on("guildMemberRemove", async member => {
    const e_guildMemberRemove = require("./events/guildMemberRemove.js");
    e_guildMemberRemove.run(member, client);
});

client.on("interactionCreate", async interaction => {
    const e_interactionCreate = require("./events/interactionCreate.js");
    e_interactionCreate.run(interaction, client);
});

const rest = new REST({ version: '9' }).setToken(token);
//const { SlashCommandBuilder } = require('@discordjs/builders');
const commands = [];
//let data = new SlashCommandBuilder()
//  .setName('echo')
//.setDescription('Replies with your input!')
//.addStringOption(option =>
//  option.setName('input')
//    .setDescription('The input to echo back')
//  .setRequired(true));
//commands.push(data.toJSON());
let files = fs.readdirSync('./commands');
files.forEach(filename => {
    let file = require(`./commands/${filename}`);
    if (file.slashcmdInfo) commands.push(file.slashcmdInfo.toJSON());
});

try {
    console.log('Started refreshing application (/) commands.');

    rest.put(
        Routes.applicationCommands('711598866595840030'),
        { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
};