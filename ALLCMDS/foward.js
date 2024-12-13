const { cmd } = require('../command');

cmd({
    pattern: "forward",
    alias: ["fwd"],
    react: "🔄",
    desc: "Forward a message to a specific user or group",
    category: "utility",
    use: ".forward <target> <message>",
    filename: __filename
}, 
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        if (!q.includes('|')) return reply(`Usage: .forward <target>|<message>\nExample: .forward 1234567890@s.whatsapp.net|Hello there!`);

        // Separate target ID and message
        const args = q.split('|');
        const target = args[0].trim(); // Target ID
        const message = args.slice(1).join('|').trim(); // Message content

        // Validate target
        if (!target.endsWith('@s.whatsapp.net') && !target.endsWith('@g.us')) {
            return reply("Invalid target ID. Please use a valid number (e.g., 1234567890@s.whatsapp.net) or group ID.");
        }

        // Validate message
        if (!message) return reply("Message cannot be empty!");

        // Forward the message
        await conn.sendMessage(target, { text: message }, { quoted: mek });
        reply(`Message successfully forwarded to ${target}`);
    } catch (e) {
        console.error(e);
        reply("An error occurred while forwarding the message.");
    }
});

