const { cmd } = require('../command');

cmd({
    pattern: "movfwd",
    alias: ["fwdmovie", "forwardmovie"],
    react: "🎥",
    desc: "Forward movie or any media to a group or chat",
    category: "utility",
    use: ".movfwd <target>",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        // Check if the command is used in reply to a message
        if (!quoted) return reply("Please reply to a media message (photo/video) to forward.");

        // Ensure that the quoted message is not undefined and contains media
        const messageContent = quoted.message || {};
        
        // Check for different types of media
        const mediaTypes = ['videoMessage', 'imageMessage', 'audioMessage', 'documentMessage'];

        let mediaFound = false;
        let mediaType = '';

        // Loop through the possible media types
        for (let type of mediaTypes) {
            if (messageContent[type]) {
                mediaFound = true;
                mediaType = type;
                break;
            }
        }

        if (!mediaFound) return reply("The quoted message does not contain any supported media (photo/video/audio/document).");

        // Get the target chat ID from the command argument
        if (!q) return reply("Please specify a target ID (e.g., 947XXXXXXXX@s.whatsapp.net or group_id@g.us).");

        const target = q.trim();
        if (!target.endsWith("@s.whatsapp.net") && !target.endsWith("@g.us")) {
            return reply("Invalid target ID. Please use a valid WhatsApp chat or group ID.");
        }

        // Forward the message based on its media type
        await conn.forwardMessage(target, quoted, { forceForward: true });
        reply(`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} successfully forwarded to ${target}`);

    } catch (error) {
        console.error("Error forwarding media:", error);
        reply("An error occurred while forwarding the media. Please try again.");
    }
});
