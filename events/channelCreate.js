exports.run = async channel => {
    if (channel.type == "text") {
        const Muted = channel.guild.roles.cache.find(role => role.name == "Muted");
        channel.updateOverwrite(Muted, { SEND_MESSAGES: false });
    }
}