const fetchJson = require('fetch-json'); // Import fetch-json module
const config = require('./config'); // Import config.js file
const { cmd, commands } = require('./commands'); // Import cmd.js file

let baseUrl;
(async () => { // Asynchronous function to get baseUrl
  const data = await fetchJson('https://raw.githubusercontent.com/prabathLK/PUBLIC-URL-HOST-DB/main/public/url.json');
  baseUrl = data.url;
})();

const yourName = 'SAHAS MD CINE RU'; // Name of the bot

cmd({ // Define a command for the bot
  pattern: 'movie', // Command pattern
  alias: ['md', 'movie download'], // Command alias
  desc: 'Download movie from Google Drive', // Command description
  category: 'movie', // Command category
  react: '🎬', // Command react
  filename: __filename, // File name
  async function (message, args) { // Command function
    try {
      const url = args[0]; // Get the URL from the user input
      if (!url || !url.startsWith('https://')) { // Check if the URL is provided
        return message.reply('මට මෙය හදුනාගැනීමට අපහසුයි🤔.\nඑකෙන් ලබා ගන්නා, Google drive ලින්ක් පමණක් භාවිතා කරන්න බද්දා');
      }
      const response = await fetchJson(baseUrl + '/api/gdrivedl?url=' + url); // Fetch the movie data from Google Drive
      message.reply('🎬 *SAHAS MD CINE RU MOVIE DOWNLOADER* 🎬\n*--------------------------------------------*\n𝕐𝕆𝕌ℝ 𝕄𝕆𝕍𝕀𝔼 𝕀𝕊\n*📤𝕌ℙ𝕃𝕆𝔸𝔾𝔼𝔻𝕀𝔾 ◽◽◽◽◽◽*\n\n> *©POWERED BY SAHAS TECH*\n\n🎬*SAHAS MD CINE RU MOVIE DOWNLOADER*🎬\n\n*--------------------------------------------*\n𝕊𝕀𝕃𝕌𝕊 𝕌𝕃𝕃𝔸𝔾𝔻 𝕄𝕆𝕍𝕀𝔼\n*📤𝕌ℙ𝕃𝕆𝔸𝔾𝔻𝕀𝔾 ◽◽◽◽◽◽*\n\n> *©POWERED BY SAHAS TECH*');
      await message.sendMessage({ // Send the movie as a document
        document: { url: response.data.file },
        fileName: response.data.name,
        mimetype: response.data.mimeType,
        caption: '🍫Bot Owner: 94718913389\n\n' + yourName
      }, { quoted: message });
    } catch (error) {
      console.error(error); // Log any errors
      message.reply('' + error);
    }
  }
});
