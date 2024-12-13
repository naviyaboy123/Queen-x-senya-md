const { cmd } = require('../command');
const os = require('os'); // Node.js os module for system info
const process = require('process'); // Access system process details
let startTime = Date.now(); // Track bot start time

cmd({
    pattern: "menu",
    alias: ["help", "commands"],
    react: "📜",
    desc: "Display the bot's menu with categorized commands",
    category: "general",
    use: ".menu",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Get RAM Usage in MB
        const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024; // Convert to MB
        const totalMemory = os.totalmem() / 1024 / 1024; // Total RAM in MB
        const ramUsage = usedMemory.toFixed(2); // Formatting RAM usage to 2 decimals

        // Calculate Bot's Uptime
        const uptime = Math.floor((Date.now() - startTime) / 1000); // in seconds
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        // Menu Content with Dynamic Information
        const menuContent = `
*~ 🔰 QUENN SENAYA MD V2  🔰 ~*

╭───────────────╮
  🤖 *COMMANDS PANEL* 🤖
╰───────────────╯
📊 *RAM USAGE:* ${ramUsage}MB / ${(totalMemory / 1024).toFixed(2)}GB
⏱ *RUNTIME:* ${hours} hours, ${minutes} minutes, ${seconds} seconds

🔹 *LIST MENU* 🔹
1️⃣ || 🎥 MOVIE
2️⃣ || 🛠️ OWNER
3️⃣ || 🤖 AI
4️⃣ || 🔍 SEARCH
5️⃣ || 📥 DOWNLOAD
6️⃣ || 🎭 FUN
7️⃣ || ⚙️ MAIN
8️⃣ || 👥 GROUP
9️⃣ || 🔄 CONVERT
🔟 || 🎲 OTHER



🚀 *QUENN SENAYA MD V2 *
        `;

        // Using the provided image URL
        const imageUrl = "https://i.ibb.co/LzWS0wx/image.webp";

        // Sending Menu with Image as a Message
        await conn.sendMessage(from, { 
            image: { url: imageUrl }, 
            caption: menuContent 
        }, { quoted: mek });
    } catch (error) {
        console.error("Error in Menu Command:", error);
        await reply("⚠️ An error occurred while displaying the menu!");
    }
});
