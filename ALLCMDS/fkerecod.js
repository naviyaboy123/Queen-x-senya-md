const { cmd } = require('../command');

cmd({
    pattern: "start",
    alias: ["record"],
    react: "🎤",
    desc: "Set bot status to 'recording'",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Activate "recording" status
        await conn.sendPresenceUpdate('recording', from);
        reply("🎤 Bot is now 'recording'...");
        
        // Optional: Perform actions (like executing a command or waiting)
        setTimeout(async () => {
            // Reset presence to "available" after 10 seconds
            await conn.sendPresenceUpdate('available', from);
            reply("✅ Bot is back to 'available' mode.");
        }, 10000); // 10 seconds delay

    } catch (e) {
        console.error(e);
        reply("⚠️ Failed to set 'recording' status.");
    }
});
