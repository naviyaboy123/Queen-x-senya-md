const { fetchJson } = require('../DATABASE/functions');
const { downloadTiktok } = require('@mrnima/tiktok-downloader');
const { facebook } = require('@bochilteam/scraper');
const cheerio = require('cheerio');
const { igdl } = require('@bochilteam/scraper');
const axios = require('axios');
const { cmd, commands } = require('../command');

// TikTok Downloader
cmd({
    pattern: 'tiktokd',
    alias: ['ttd'],
    react: '🎥',
    desc: 'download tiktok videos',
    category: 'download',
    filename: __filename
}, async (client, message, match, { from, quoted, q, reply }) => {
    try {
        if (!q || !q.startsWith('https://')) {
            return reply('Please provide a valid TikTok URL');
        }

        match.react('⬇️');
        let tiktokData = await downloadTiktok(q);
        let messageText = `*📽️ TikTok Downloader*\n\n*Caption:* ${tiktokData.result.caption}\n\n` +
                         `*🔢 REPLY BELOW THE NUMBER*\n\n` +
                         `*VIDEO FILE* 🎬\n\n` +
                         `*1*     ┃  *SD Quality*\n` +
                         `*2*     ┃  *HD Quality*\n\n` +
                         `*AUDIO FILE*🎧\n\n` +
                         `*3*     ┃  *AUDIO*\n\n` +
                         `> SILENT-SOBX-MD ✻\n     `;

        const sentMessage = await client.sendMessage(from, {
            image: { url: tiktokData.result.image },
            caption: messageText
        });

        client.ev.on('messages.upsert', async (update) => {
            const msg = update.messages[0];
            if (!msg.message) return;

            const choice = msg.message.conversation || msg.message.extendedTextMessage?.text;
            const chat = msg.key.remoteJid;
            const isReplyToOptions = msg.message.extendedTextMessage && 
                msg.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id;

            if (isReplyToOptions) {
                await client.sendMessage(chat, { react: { text: '⬇️', key: msg.key }});
                let content = tiktokData.result;

                switch(choice) {
                    case '1':
                        await client.sendMessage(chat, {
                            video: { url: content.links.download_mp4_1 },
                            caption: '*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱɪʟᴇɴᴛ ʟᴏᴠᴇʀ · · ·⁴³²*'
                        }, { quoted: msg });
                        break;
                    case '2':
                        await client.sendMessage(chat, {
                            video: { url: content.links.download_mp4_hd },
                            caption: '*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱɪʟᴇɴᴛ ʟᴏᴠᴇʀ · · ·⁴³²*'
                        }, { quoted: msg });
                        break;
                    case '3':
                        await client.sendMessage(chat, {
                            audio: { url: content.links.download_audio },
                            mimetype: 'audio/mpeg'
                        }, { quoted: msg });
                        break;
                }
            }
        });
    } catch (error) {
        console.log(error);
        reply(error.toString());
    }
});

// Facebook Downloader
cmd({
    pattern: 'fbd',
    alias: ['facebook'],
    desc: 'download facebook videos',
    category: 'download',
    filename: __filename
}, async (client, message, match, { from, quoted, q, reply }) => {
    try {
        if (!q || !q.startsWith('https://')) {
            return client.sendMessage(from, {
                text: 'Please provide a valid Facebook URL'
            }, { quoted: message });
        }

        await client.sendMessage(from, {
            react: { text: '⏳', key: message.key }
        });

        const fbData = await facebook(q);
        const messageText = `*📽️ Facebook Downloader*\n\n*Title:* ${fbData.result.title}\n\n` +
                          `*🔢 REPLY WITH NUMBER FOR QUALITY*\n\n`;

        const sentMessage = await client.sendMessage(from, {
            image: { url: fbData.result.thumbnail },
            caption: messageText
        }, { quoted: message });

        client.ev.on('messages.upsert', async (update) => {
            const msg = update.messages[0];
            if (!msg.message) return;

            const choice = msg.message.conversation || msg.message.extendedTextMessage?.text;
            const chat = msg.key.remoteJid;
            const isReplyToOptions = msg.message.extendedTextMessage && 
                msg.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id;

            if (isReplyToOptions) {
                let content = fbData.result;

                switch(choice) {
                    case '1':
                        await client.sendMessage(chat, {
                            video: { url: content.links.SD },
                            caption: '*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱɪʟᴇɴᴛ ʟᴏᴠᴇʀ · · ·⁴³²*'
                        }, { quoted: msg });
                        break;
                    case '2':
                        await client.sendMessage(chat, {
                            video: { url: content.links.HD },
                            caption: '*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱɪʟᴇɴᴛ ʟᴏᴠᴇʀ · · ·⁴³²*'
                        }, { quoted: msg });
                        break;
                }
            }
        });
    } catch (error) {
        console.log(error);
        reply(error.toString());
    }
});

// Twitter Downloader implementation would follow similar pattern...
