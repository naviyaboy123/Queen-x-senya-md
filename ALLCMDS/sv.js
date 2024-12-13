
const { cmd } = require('../command'); // Correct path to the command handler
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "save",
    alias: ["download"],
    react: "📥",
    desc: "Download quoted media status",
    use: ".save <quoted media>",
    filename: __filename
},
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        if (!quoted || !quoted.message) {
            return await reply("❌ No media found. Please quote a media message.");
        }

        // Check if it's an image message
        if (quoted.message.imageMessage) {
            const imgUrl = quoted.message.imageMessage.url;
            await conn.sendMessage(from, { image: { url: imgUrl }, caption: "Here is your downloaded image!" }, { quoted: mek });
        }

        // Check if it's a video message
        else if (quoted.message.videoMessage) {
            const videoUrl = quoted.message.videoMessage.url;
            await conn.sendMessage(from, { video: { url: videoUrl }, caption: "Here is your downloaded video!" }, { quoted: mek });
        }

        // Check if it's an audio message
        else if (quoted.message.audioMessage) {
            const audioUrl = quoted.message.audioMessage.url;
            await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
        }

        // If none of these, it's not a supported media type
        else {
            await reply("❌ Only video, image, or audio messages are supported.");
        }
    } catch (e) {
        console.log(e);
        reply("An error occurred while trying to download the media.");
    }
});
