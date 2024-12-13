const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "movie",
    alias: ["film", "moviedl"],
    react: "🎥",
    desc: "Search and download movies",
    category: "download",
    use: ".movie <Movie Name>",
    filename: __filename,
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("⚠️ *Please provide a movie name to search!*");

        const response = await axios.get(`https://www.dark-yasiya-api.site/movie/search?text=${encodeURIComponent(q)}`);
        const data = response.data;

        if (!data || data.results.length === 0) {
            return reply("❌ *No results found for the given movie name!*");
        }

        const movie = data.results[0];
        const movieInfo = `
🎬 *MOVIE DETAILS* 🎬

📌 *Title:* ${movie.title}
🌟 *IMDB Rating:* ${movie.imdb || "N/A"}
⏳ *Duration:* ${movie.duration || "N/A"}
🗓 *Release Date:* ${movie.releaseDate || "N/A"}
📂 *Categories:* ${movie.categories || "N/A"}

📥 *Download Link:* ${movie.download || "N/A"}
        `;

        await conn.sendMessage(from, { image: { url: movie.thumbnail || '' }, caption: movieInfo }, { quoted: mek });

        if (movie.download) {
            await conn.sendMessage(from, { text: `🔗 *Click here to download:* ${movie.download}` }, { quoted: mek });
            await conn.sendMessage(from, { text: "✔️ *Movie details and download link sent successfully!*" }, { quoted: mek });
        } else {
            reply("⚠️ *Download link not available!*");
        }
    } catch (error) {
        console.log(error.response ? error.response.data : error.message);
        reply("❌ *An error occurred while searching for the movie!*");
    }
});
