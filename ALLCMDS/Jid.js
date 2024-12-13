const { cmd } = require('../command');

cmd({
    pattern: "jixd",
    alias: ["getjid", "activeid"],
    react: "📋",
    desc: "Get JID and mark it active",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, groupMetadata }) => {
    try {
        let jidInfo = isGroup
            ? `🔹 *Group JID:* ${from}\n\n👥 *Group Name:* ${groupMetadata.subject || 'Unknown'}`
            : `🔹 *User JID:* ${from}`;

        // Mark the JID as active (Here you can add additional logic)
        reply(`✅ JID is now active:\n\n${jidInfo}`);
        
        // Optionally save the JID to a database or perform another action
        // Example: Save the JID
        console.log(`Active JID: ${from}`);
        
    } catch (e) {
        console.error(e);
        reply("⚠️ An error occurred while retrieving JID.");
    }
});



cmd({
    pattern: "id",
    alias: ["getid"],
    react: "📋",
    desc: "Get JID of a group or user",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, groupMetadata }) => {
    try {
        // Check if it's a group
        if (isGroup) {
            reply(`🔹 *Group JID:* ${from}`);
        } else {
            // Individual chat
            reply(`🔹 *User JID:* ${from}`);
        }
    } catch (e) {
        console.log(e);
        reply("⚠️ An error occurred.");
    }
});



cmd({
    pattern: "jid",
    alias: ["getjid", "idj"],
    react: "🆔",
    desc: "Get the JID (Jabber ID) of the chat or user",
    category: "utility",
    use: ".jid",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, sender, reply }) => {
    try {
        // Detecting Group or Individual JID
        const jidType = isGroup ? "Group JID" : "Individual JID";
        const jid = from;

        // Sender JID
        const senderJid = sender;

        // JID Response
        const message = `
🔹 *JID Information* 🔹
📌 *Chat Type:* ${jidType}
🆔 *Chat JID:* ${jid}
🙍‍♂️ *Your JID:* ${senderJid}
        `;
        await reply(message);
    } catch (error) {
        console.error("Error in JID command:", error);
        await reply("⚠️ An error occurred while fetching the JID.");
    }
});

