const { cmd } = require('../command');

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

// Middleware to check if the bot is deactivated for the group
cmd.middleware(async (mek, m, next) => {
    const { from, isGroup } = m;

    // Check if the group is deactivated
    if (isGroup && deactivatedGroups[from]) {
        return await m.reply("The bot is currently deactivated for this group.");
    }

    await next();
});
