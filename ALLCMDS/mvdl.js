const { cmd, commands } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

// Audio Download Command
cmd({
    pattern: 'sindu',
    desc: 'Download Your Sindus.',
    category: 'download',
    filename: __filename
}, async (client, message, match, {
    from,
    quoted,
    q,
    reply
}) => {
    try {
        if (!q) return reply("*❌ Give Me title or Url*");
        
        // Search for the video
        const search = await yts(q);
        const video = search.videos[0];
        const url = video.url;

        // Create info message
        let text = `🎧 𝗦𝗘𝗢𝗡 𝗠𝗗 𝗠𝗨𝗦𝗜𝗖 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 📥\n\n` +
                   `*★| TITLE :* ${video.title}\n\n` +
                   `*★| TIME :* ${video.timestamp}\n\n` +
                   `*★| VIEWS :* ${video.views}\n\n` +
                   `*★| AGO :* ${video.ago}\n\n` +
                   `*★| DESCRIPTION :* ${video.description}\n\n` +
                   `*★| URL :* ${video.url}\n\n` +
                   `📥 | Choose Download Format\n\n` +
                   `1. 🎧 Audio File \n\n` +
                   `2. 📙 Document File\n\n` +
                   `> *Made By Dark Cyber Maker ™*`;

        // Get download URL
        const dldata = await fg.yta(url);
        const dlurl = dldata.dl_url;

        // Send message with options
        const sentMsg = await client.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: text
        }, { quoted: message });

        // Handle user's format choice
        client.ev.on('messages.upsert', async (update) => {
            const msg = update.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            if (msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === sentMsg.key.id) {

                const response = msg.message.extendedTextMessage.text.trim();

                try {
                    switch (response) {
                        case '1': // Audio format
                            await client.sendMessage(from, {
                                audio: { url: dlurl },
                                mimetype: 'audio/mpeg'
                            }, { quoted: message });
                            break;

                        case '2': // Document format
                            await client.sendMessage(from, {
                                document: { url: dlurl },
                                mimetype: 'audio/mpeg',
                                fileName: video.title + '.mp3',
                                caption: '> *Made By Dark Cyber Maker ™*'
                            }, { quoted: message });
                            break;

                        default:
                            reply("Invalid option. Please select a valid option 🔴");
                    }
                } catch (error) {
                    console.log(error);
                    reply("${err}");
                }
            }
        });
    } catch (error) {
        console.log(error);
        await client.sendMessage(from, {
            react: { text: '❌', key: message.key }
        });
        reply(`${error}`);
    }
});

// Video Download Command
cmd({
    pattern: 'video',
    desc: 'Download Youtube Videos.',
    category: 'download',
    filename: __filename
}, async (client, message, match, {
    from,
    quoted,
    q,
    reply
}) => {
    try {
        if (!q) return reply("*❌ Give Me title or Url*");

        // Search for the video
        const search = await yts(q);
        const video = search.videos[0];
        const url = video.url;

        // Create info message
        let text = `🎧 𝗦𝗘𝗢𝗡 𝗠𝗗 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 📥\n\n` +
                   `*★| TITLE :* ${video.title}\n\n` +
                   `*★| TIME :* ${video.timestamp}\n\n` +
                   `*★| VIEWS :* ${video.views}\n\n` +
                   `*★| AGO :* ${video.ago}\n\n` +
                   `*★| DESCRIPTION :* ${video.description}\n\n` +
                   `*★| URL :* ${video.url}\n\n` +
                   `📥 | Choose Download Format\n\n` +
                   `1. 🎧 Video File \n\n` +
                   `2. 📙 Document File\n\n` +
                   `> *Made By Dark Cyber Maker ™*`;

        // Get download URL
        const dldata = await fg.ytv(url);
        const dlurl = dldata.dl_url;

        // Send message with options
        const sentMsg = await client.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: text
        }, { quoted: message });

        // Handle user's format choice
        client.ev.on('messages.upsert', async (update) => {
            // ... similar to audio download handler ...
        });
    } catch (error) {
        console.log(error);
        reply(`${error}`);
    }
});
