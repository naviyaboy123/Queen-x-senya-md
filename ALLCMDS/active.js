const config = require('../config')
const { cmd, commands } = require('../command') 
// Create an object to store deactivated groups
let deactivatedGroups = {};

cmd({
    pattern: "deactivate",
    alias: ["disable"],
    react: "❌",
    desc: "Deactivate bot for this group",
    category: "admin",
    use: ".deactivate",
    filename: __filename
},
async(conn, mek, m, { from, isGroup, isAdmin, reply }) => {
    try {
        if (!isGroup) return await reply("This command can only be used in groups.");
        if (!isAdmin) return await reply("Only group admins can use this command.");

        // Add group to deactivated list
        deactivatedGroups[from] = true;
        await reply("Bot has been deactivated for this group. Use `.activate` to re-enable it.");
    } catch (e) {
        console.error(e);
        await reply("An error occurred. Please try again.");
    }
});

cmd({
    pattern: "activate",
    alias: ["enable"],
    react: "✅",
    desc: "Activate bot for this group",
    category: "admin",
    use: ".activate",
    filename: __filename
},
async(conn, mek, m, { from, isGroup, isAdmin, reply }) => {
    try {
        if (!isGroup) return await reply("This command can only be used in groups.");
        if (!isAdmin) return await reply("Only group admins can use this command.");

        // Remove group from deactivated list
        if (deactivatedGroups[from]) {
            delete deactivatedGroups[from];
            await reply("Bot has been activated for this group.");
        } else {
            await reply("Bot is already active for this group.");
        }
    } catch (e) {
        console.error(e);
        await reply("An error occurred. Please try again.");
    }
});

// Add this check to all commands you want to restrict
cmd({
    pattern: "example",
    react: "✅",
    desc: "Example command",
    category: "general",
    use: ".example",
    filename: __filename
},
async(conn, mek, m, { from, reply, isGroup }) => {
    // Check if the bot is deactivated for the group
    if (isGroup && deactivatedGroups[from]) {
        return await reply("The bot is currently deactivated for this group. Use `.activate` to enable it.");
    }

    // Normal command functionality
    await reply("This is an example command.");
});
    await next();
});
