const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const fg = require('api-dylux');
const axios = require('axios');
const { Buffer } = require('buffer');
const apkdl = require('../lib/apkdl');
const GOOGLE_API_KEY = 'AIzaSyDebFT-uY_f82_An6bnE9WvVcgVbzwDKgU';
const GOOGLE_CX = '45b94c5cef39940d1';

// Command to search and send images from Google
cmd({
    pattern: 'image',
    desc: 'Search and send images from Google with multiple format options.',
    react: '🖼️',
    category: 'search',
    filename: __filename
}, async (client, message, match, { from, reply, q, pushname }) => {
    try {
        if (!q) return reply('Please provide a search query for the image.');

        const encodedQuery = encodeURIComponent(q);
        const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodedQuery}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}&searchType=image&num=5`;
        const searchResponse = await axios.get(searchUrl);
        const searchData = searchResponse.data;

        if (!searchData.items || searchData.items.length === 0) return reply('No images found for your query.');

        const infoMessage = `🌟 Hello, ${pushname || 'User'}!\n\nSearch Query: ${q}\n\nReply with a number below\n\n1 || Send images in normal format\n\n2 || Send images as document format\n\n> *Made By Dark Cyber Maker ™*`;
        const sentMessage = await client.sendMessage(from, { text: infoMessage }, { quoted: message });

        client.ev.on('messages.upsert', async (update) => {
            const receivedMessage = update.messages[0];
            if (!receivedMessage.message || !receivedMessage.message.extendedTextMessage) return;

            const response = receivedMessage.message.extendedTextMessage.text.trim();
            if (receivedMessage.message.extendedTextMessage.contextInfo && receivedMessage.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
                if (response === '1') {
                    for (let i = 0; i < searchData.items.length; i++) {
                        const imageUrl = searchData.items[i].link;
                        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
                        await client.sendMessage(from, { image: imageBuffer, caption: `🖼️ Image ${i + 1} from your search!` }, { quoted: receivedMessage });
                    }
                } else if (response === '2') {
                    for (let i = 0; i < searchData.items.length; i++) {
                        const imageUrl = searchData.items[i].link;
                        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
                        await client.sendMessage(from, { document: imageBuffer, fileName: `Image_${i + 1}.jpg`, mimetype: 'image/jpeg', caption: `🖼️ Image ${i + 1} from your search! 🖼️` }, { quoted: receivedMessage });
                    }
                } else {
                    await client.sendMessage(from, { text: 'Invalid option. Please reply with either 1 or 2.' }, { quoted: receivedMessage });
                }
            }
        });
    } catch (error) {
        console.log(error);
        reply(`Error: ${error.message}`);
    }
});

// Command to download Tiktok videos
cmd({
    pattern: 'tiktok',
    alias: ['tt', 'ttdown'],
    desc: 'Download For Tiktok Videos',
    category: 'download',
    filename: __filename
}, async (client, message, match, { from, quoted, reply, q }) => {
    try {
        if (!q) return await reply('Please give me tiktok url');
        if (!q.includes('tiktok.com')) return await reply('This url is invalid');

        const downloadData = await fetchJson(`https://www.dark-yasiya-api.site/download/tiktok?url=${q}`);
        const infoMessage = `🎬 𝗦𝗘𝗢𝗡 𝗠𝗗 𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 📥\n\n*★| TITLE :* ${downloadData.result.title}\n\n*★| Views :* ${downloadData.result.views}\n\n*★| Upload Date and Time :* ${downloadData.result.lastup}\n\n*★| URL :* ${q}\n\n📥 | Choose Download Format\n\n1. 🎬 With Watermark\n\n2. 📙 Without Watermark\n\n3. 🎧 Audio File\n\n> *Made By Dark Cyber Maker ™*`;

        const sentMessage = await client.sendMessage(from, { image: { url: downloadData.result.cover || '' }, caption: infoMessage }, { quoted: message });

        client.ev.on('messages.upsert', async (update) => {
            const receivedMessage = update.messages[0];
            if (!receivedMessage.message || !receivedMessage.message.extendedTextMessage) return;

            if (receivedMessage.message.extendedTextMessage.contextInfo && receivedMessage.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
                const response = receivedMessage.message.extendedTextMessage.text.trim();
                try {
                    switch (response) {
                        case '3':
                            await client.sendMessage(from, { audio: { url: downloadData.result.sound }, mimetype: 'audio/mpeg' }, { quoted: message });
                            break;
                        case '1':
                            await client.sendMessage(from, { video: { url: downloadData.result.wmVideo }, mimetype: 'video/mp4', caption: `${downloadData.result.title}\n\nWATERMARK VIDEO ✅\n\n> *Made By Dark Cyber Maker ™*` }, { quoted: message });
                            break;
                        case '2':
                            await client.sendMessage(from, { video: { url: downloadData.result.nowmVideo }, mimetype: 'video/mp4', caption: `${downloadData.result.title}\n\nNO-WATERMARK VIDEO ✅\n\n> *Made By Dark Cyber Maker ™*` }, { quoted: message });
                            break;
                        default:
                            reply('Invalid option. Please select a valid option 🔴');
                    }
                } catch (error) {
                    console.log(error);
                    reply(`${error}`);
                }
            }
        });
    } catch (error) {
        console.log(error);
        reply(`${error}`);
    }
});

// Command to download Mediafire files
cmd({
    pattern: 'mediafire',
    alias: ['mf', 'mfire'],
    react: '🔥',
    desc: 'Download Your Mediafire Files.',
    category: 'download',
    filename: __filename
}, async (client, message, match, { from, quoted, reply, q }) => {
    try {
        if (!q) return await reply('Please give me mediafire url');
        if (!q.includes('mediafire.com')) return await reply('This url is invalid');

        const downloadData = await fetchJson(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
        const infoMessage = `📙 𝗦𝗘𝗢𝗡 𝗠𝗗 𝗠𝗘𝗗𝗜𝗔𝗙𝗜𝗥𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 📥\n\n*★| File Name :* ${downloadData.result.fileName}\n\n*★| File Size :* ${downloadData.result.size}\n\n*★| File Type :* ${downloadData.result.fileType}\n\n> *Made By Dark Cyber Maker ™*`;

        await client.sendMessage(from, { image: { url: 'https://i.ibb.co/dPw1fHD/mfire.jpg' }, caption: infoMessage }, { quoted: message });
        await client.sendMessage(from, { document: { url: downloadData.result.downloadUrl }, mimetype: downloadData.result.fileType, fileName: downloadData.result.fileName, caption: `${downloadData.result.fileName}\n\n> *Made By Dark Cyber Maker ™*` }, { quoted: message });
    } catch (error) {
        console.log(error);
        reply(`${error}`);
    }
});

// Command to download Xvideos
cmd({
    pattern: 'xvideos',
    alias: ['xvdl', 'xvdown'],
    react: '🔞',
    desc: 'Download Xvideos.',
    category: 'download',
    filename: __filename
}, async (client, message, match, { from, quoted, reply, q }) => {
    try {
        if (!q) return await reply('Please give me xvideos url');
        const searchData = await fetchJson(`https://nsfw-pink-venom.vercel.app/api/xnxx/search?query=${q}`);
        if (searchData.result.length < 0) return await reply('Not results found!');

        const downloadData = await fetchJson(`https://nsfw-pink-venom.vercel.app/api/xnxx/download?url=${searchData.result[0].url}`);
        const infoMessage = `💋 𝗦𝗘𝗢𝗡 𝗠𝗗 𝗫𝗩𝗜𝗗𝗘𝗢𝗦 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 📥\n\n*★| Video Title :* ${downloadData.result.title}\n\n*★| Duration :* ${downloadData.result.duration}\n\n*★| Like :* ${downloadData.result.like}\n\n*★| Deslink :* ${downloadData.result.deslike}\n\n*★| Size :* ${downloadData.result.size}\n\n> *Made By Dark Cyber Maker ™*`;

        await client.sendMessage(from, { image: { url: downloadData.result.image || '' }, caption: infoMessage }, { quoted: message });
        await client.sendMessage(from, { document: { url: downloadData.result.dl_link }, mimetype: 'video/mp4', fileName: downloadData.result.title, caption: '> *Made By Dark Cyber Maker ™*' }, { quoted: message });
    } catch (error) {
        console.log(error);
        reply(`${error}`);
    }
});

// Command to download APK files
cmd({
    pattern: 'apk',
    react: '📱',
    desc: 'Download For apk.',
    category: 'download',
    filename: __filename
}, async (client, message, match, { from, quoted, reply, q }) => {
    try {
        await client.sendMessage(from, { react: { text: '📥', key: quoted.key } });
        if (!q) return await client.sendMessage(from, { text: 'Need apk link...' }, { quoted: message });

        const downloadData = await apkdl.apkdl(q);
        let infoMessage = `🎮 𝗦𝗘𝗢𝗡 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 📙\n\n★| Name : ${downloadData.name}\n\n★| Developer : ${downloadData.author}\n\n★| Last update : ${downloadData.lastup}\n\n★| File Size : ${downloadData.size}\n\n> *Made By Dark Cyber Maker ™*`;

        await client.sendMessage(from, { image: { url: downloadData.icon }, caption: infoMessage }, { quoted: message });
        let sentMessage = await client.sendMessage(from, { document: { url: downloadData.dl_url }, mimetype: 'application/vnd.android.package-archive', fileName: `${downloadData.name}.apk`, caption: '' }, { quoted: message });

        await client.sendMessage(from, { react: { text: '📁', key: sentMessage.key } });
        await client.sendMessage(from, { react: { text: '✔', key: quoted.key } });
    } catch (error) {
        console.log(error);
        reply(`${error}`);
    }
});
