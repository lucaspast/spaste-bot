const fsP = require('fs').promises;
const fs = require('fs');

exports.run = async (data) => {
    let suc6 = true;
    data.base64 = data.base64.replace(/^data:(.*?);base64,/, "");
    data.base64 = data.base64.replace(/ /g, '+');
    let GuildID = data.GuildID;

    try {
        if (!fs.existsSync(`./musicbot/${GuildID}`)) {
            fsP.mkdir(`./musicbot/${GuildID}`);
            fsP.mkdir(`./musicbot/${GuildID}/vids`);
            fsP.mkdir(`./musicbot/${GuildID}/embeder`);
        }
        let numberOfSb = (await fsP.readdir(`./musicbot/${GuildID}/vids`)).length + 1;

        let embedobj = {
            name: `**sound #${numberOfSb}**`,
            value: data.description
        };

        let jsonData = JSON.stringify(embedobj);
        await fsP.writeFile(`./musicbot/${GuildID}/embeder/${numberOfSb}.json`, jsonData, function (err) {
            console.log(err);
            suc6 = false;
        });

        await fsP.writeFile(`./musicbot/${GuildID}/vids/${numberOfSb}.mp4`, data.base64, 'base64', function (err) {
            console.log(err);
            suc6 = false;
            fsP.unlink(`./musicbot/${GuildID}/embeder/${numberOfSb}.json`, function (err) {
                console.error(err);
            });
        });

    } catch (err) {
        console.log(err);
        suc6 = false;
    };
    return { suc6: suc6 };
};