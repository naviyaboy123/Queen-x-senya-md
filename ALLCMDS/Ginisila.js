const axios = require("axios"); // API request එක කිරීමේ library එක
const { cmd } = require('../command'); // Bot commands handler එක
const config = require('../config');
cmd({
    pattern: "ginisisila",  // Command pattern to trigger the function
    alias: ["cartoon"],  // Alternative names for the command
    react: "🎬",  // Emoji to react with
    desc: "Download Ginisisila Cartoon",  // Description of the command
    category: "download",  // Command category
    use: '.ginisisila <cartoon url>',  // Usage guide for the command
    filename: __filename  // File path of the current file
},
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        if (!q) return await reply("Please provide the URL of the Ginisisila cartoon.");  // If no URL is provided, return an error

        // Check if the URL is valid (starts with http:// or https://)
        const isValidUrl = /^https?:\/\/[^\s$.?#].[^\s]*$/.test(q);
        if (!isValidUrl) return await reply("⚠️ Invalid URL format. Please provide a valid URL.");
        
        const apiUrl = `https://www.dark-yasiya-api.site/download/ginisisila?url=${encodeURIComponent(q)}`;  // API URL for downloading Ginisisila

        // Send a request to the API
        const response = await axios.get(apiUrl);
        console.log(response.data);  // Log the response data for debugging

        // If the response contains a valid download link
        if (response.data && response.data.url) {
            const downloadUrl = response.data.url;

            // Send the download URL as a message
            await conn.sendMessage(from, {
                text: `🎬 Here is your download link for the Ginisisila cartoon: ${downloadUrl}`,
            }, { quoted: mek });

            // Optionally send the file directly if it's available
            await conn.sendMessage(from, {
                document: { url: downloadUrl },
                mimetype: "application/octet-stream",  // Mimetype for generic binary files
                fileName: "Ginisisila_Cartoon.mp4",  // You can change the filename if needed
            }, { quoted: mek });

        } else {
            return await reply("⚠️ Error occurred. Unable to find a download link.");
        }
    } catch (error) {
        console.log(error);
        return await reply("⚠️ Something went wrong. Please try again later.");
    }
});

