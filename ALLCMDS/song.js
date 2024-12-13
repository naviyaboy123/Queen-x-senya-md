// YTMP3 DL PLUGIN

const config = require('../config');
const { cmd } = require('../command');
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); // request package.json "@dark-yasiya/yt-dl.js": "latest"


cmd({
    pattern: "song",
    alias: ["ytmp3","ytsong"],
    react: "🎶",
    desc: "Download Youtube song",
    category: "download",
    use: '.song < Yt url or Name >',
    filename: __filename
},
async(conn, mek, m,{ from, prefix, quoted, q, reply }) => {
try{

if(!q) return await reply("Please give me Yt url or Name")
	
const yt = await ytsearch(q);
if(yt.results.length < 1) return reply("Results is not found !")

let yts = yt.results[0]  
const ytdl = await ytmp3(yts.url)
		
let ytmsg = ` *QUEEN SENAYA MD AUDIO DAWONLODER 👑💘*


🎵 *TITLE :* ${yts.title}
🤵 *AUTHOR :* ${yts.author.name}
⏱ *RUNTIME :* ${yts.timestamp}
👀 *VIEWS :* ${yts.views}
🖇️ *URL :* ${yts.url}
`
// SEND DETAILS
await conn.sendMessage(from, { image: { url: yts.thumbnail || yts.image || '' }, caption: `${ytmsg}`}, { quoted: mek });

// SEND AUDIO TYPE
await conn.sendMessage(from, { audio: { url: ytdl.download.url }, mimetype: "audio/mpeg" }, { quoted: mek })

// SEND DOC TYPE

await conn.sendMessage(from,{document: {url:downloadUrl},mimetype:"audio/mpeg",fileName:data.title + ".mp3",caption:"⃟⃟◍̸̸̣̣⃟◍̸̸̸̸̶̶̣̣̣̜̜̜̜̜̜̜̠ ͜𝑫𝒂𝒓𝒌͒͜ 𝑯𝒂𝒄𝒌𝒆𝒓͜⚘֗͢♮ 𝒁𝒐𝒏𝒆↝𝑻𝒆𝒂𝒎⚘♪{ 𝑵 𝑨 𝑽 𝑰 𝒀 𝑨 }⛦↝</> 🇱🇰↜..."},{quoted:mek})

//await conn.sendMessage(from, { document: { url: ytdl.download.url }, mimetype: "audio/mpeg", fileName: ytdl.result.title + '.mp3', caption: `}` }, { quoted: mek })


} catch (e) {
console.log(e)
reply(e)
}}
)

