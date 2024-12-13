/*const axios = require('axios');
const { cmd } = require('../command'); // command file එකේ path එක මෙහි දාන්න

cmd({
    pattern: "movie",  // මෙහි "!" එකක් නැතුව movie command එකක් භාවිතා කරන්න
    react: "🎥",  // Reaction emoji
    desc: "චිත්‍රපට තොරතුරු සොයා බලන්න",
    category: "movie",
    filename: __filename,
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        // Movie name එක arguments එකෙන් ගන්නවා
        const movieName = args.join(" ");
        if (!movieName) {
            return reply("🍿 කරුණාකර චිත්‍රපටයේ නම එකක් ලබා දෙන්න. උදා: `movie Deadpool`");
        }

        // Dark Yasiya API endpoint එක
        const apiUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(movieName)}`;
        
        // API request එක යවමු
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.status || !data.result || data.result.data.length === 0) {
            return reply(`⚠️ *${movieName}* චිත්‍රපටය හමු නොවිය. වෙනත් නමක් තෝරන්න.`);
        }

        // First result එක භාවිතා කරන්න
        const movie = data.result.data[0];

        // Reply message එක
        const message = `🎬 *${movie.title}*\n\n` +
                        `⭐ *IMDb:* ${movie.imdb || "N/A"}\n` +
                        `🗓 *Year:* ${movie.year}\n` +
                        `🖇️ *URL:* ${movie.link}\n`;

        // Movie Poster එක attach කරන්න
        const posterUrl = movie.image;

        if (posterUrl) {
            await conn.sendMessage(from, {
                image: { url: posterUrl },
                caption: message,
            }, { quoted: mek });
        } else {
            await reply(message);
        }
    } catch (error) {
        console.error("Movie Command Error:", error);
        await reply("⚠️ චිත්‍රපට තොරතුරු ලබා ගැනීමේදී දෝෂයක් ඇතිවිය. කරුණාකර නැවත උත්සාහ කරන්න.");
    }
});
*/
