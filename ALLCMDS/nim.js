const { fetchJson } = require('../lib/functions');
const config = require('../config');
const { cmd, commands } = require('../command');

let baseUrl;

// Initialize baseUrl by fetching from GitHub
(async () => {
    let urlData = await fetchJson('https://raw.githubusercontent.com/prabathLK/PUBLIC-URL-HOST-DB/main/public/url.json');
    baseUrl = urlData.api;
})();

const yourName = '❗මෙය වෙබ් පිටපතක් වන අතර,සිංහල උපසිරැසි වෙනම එකතු කරගැනීමට *සිංහල උපසිරැසි* Button එක click කරන්න.\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀʜᴀꜱ ᴛᴇᴄʜ*\n\n 🎬*ꜱᴀʜᴀꜱ ᴍᴅ ᴄɪɴᴇʀᴜ.ʟᴋ ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*🎬​';

cmd({
    pattern: 'gdmovie',
    alias: ['gdrivemovie', 'googledrivemovie'],
    desc: 'download cinerulk movie ',
    category: 'movie',
    react: '🎬',
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Validate input URL
        if (!q || !q.startsWith('https://')) {
            return reply('මට මෙය හදුනාගැනීමට අපහසුයි🤔.\nඑකෙන් ලබා ගන්නා,Google drive ලින්ක් පමණක් භාවිතා කරන්න ');
        }

        // Fetch movie data
        let movieData = await fetchJson(baseUrl + '/api/gdrivedl?url=' + q);

        // Send processing message
        reply('🎬 *ꜱᴀʜᴀꜱ ᴍᴅ ᴄɪɴᴇʀᴜ.ʟᴋ ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ* 🎬​ \n*--------------------------------------------*\n𝕐𝕆𝕌ℝ 𝕄𝕆𝕍𝕀𝔼 𝕀𝕊\n*📤𝕌ℙ𝕃𝕆𝔸𝔻𝕀ℕ𝔾 ◽◽◽◽◽◽*\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀʜᴀꜱ ᴛᴇᴄʜ*');

        // Send movie file
        await client.sendMessage(from, {
            document: {
                url: movieData.data.download
            },
            fileName: movieData.data.fileName,
            mimetype: movieData.data.mimeType,
            caption: '🍟Movie Name : ' + movieData.data.fileName + ' | සිංහල උපසිරැසි ඇතුළත් කර නැත.\n🍫Bot Owner : 94718913389 \n\n' + yourName
        }, {
            quoted: message
        });

    } catch (error) {
        console.log(error);
        reply('' + error);
    }
});
