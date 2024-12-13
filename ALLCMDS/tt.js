const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "tiktok",
    alias: ["tiktokdl", "ttdl"],
    react: "🎥",
    desc: "Download TikTok video",
    category: "download",
    use: '.tiktok <TikTok URL>',
    filename: __filename
},
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        if (!q) return await reply("Please provide the TikTok URL");

        // TikTok API URL
        const apiUrl = `https://www.dark-yasiya-api.site/download/tiktok?url=${encodeURIComponent(q)}`;

        // Make request to get the download link
        const response = await axios.get(apiUrl);

        // Check if we have a valid download URL
        if (response.data && response.data.download) {
            const videoUrl = response.data.download;

            // Send video download link as a video message
            await conn.sendMessage(from, { video: { url: videoUrl }, mimetype: 'video/mp4' }, { quoted: mek });

            // Optionally send it as a document
            await conn.sendMessage(from, { document: { url: videoUrl }, mimetype: 'video/mp4', fileName: 'tiktok_video.mp4', caption: 'Here is your TikTok video!' }, { quoted: mek });
        } else {
            reply("Couldn't find a valid video to download.");
        }

    } catch (e) {
        console.log(e);
        reply("Something went wrong. Please try again.");
    }
});
