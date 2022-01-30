const { botmemory } = require('../JSON trash/botmemory.json');
const loadWarns = require('../autoload/loadWarns.js');
const rs = require('../commands/rs.js');
let giveaways = require('../commands/giveaway.js');
let tempban = require('../commands/tempban.js');
let tempmute = require('../commands/tempmute.js');

module.exports = {
    name: "ready",
    run: async (client) => {
        console.log('ready!');
        client.user.setStatus('available');
        let theactivity = botmemory.activity;
        client.user.setActivity(theactivity);
        loadWarns.run(client).then(() => console.log("activated!"));
        rs.collecters(client);
        giveaways.load(client);
        tempban.load(client);
        tempmute.load(client);
    }
}