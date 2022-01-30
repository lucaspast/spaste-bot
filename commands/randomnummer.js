exports.run = async (client, message, args) => {
    let args = message.content.split(" ");
    const testtot = args[1];
    if (testtot === "max") {
        const randomlimiet = args[2];
        var randomNumber = Math.floor(Math.random() * randomlimiet);
        message.channel.send({ embed: { color: "GREEN", description: `<${randomNumber}` } })
    } else {
        var randomNumber = Math.floor(Math.random() * 10);
        message.channel.send({ embed: { color: "GREEN", description: `<${randomNumber}` } })
    }
}