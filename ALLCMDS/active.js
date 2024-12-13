const config = require('../config');
const { cmd } = require('../command');

// Object to store deactivated commands for each group
const deactivatedCommands = {};

cmd({
    pattern: "deactivate",
    alias: ["disable"],
    react: "❌",
    desc: "Deactivate a specific command in this group",
    category: "admin",
    use: ".deactivate <command>",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmin, q, reply }) => {
    try {
        // Ensure the command is used in a group
        if (!isGroup) return await reply("This command can only be used in groups.");

        // Ensure only admins can use this command
        if (!isAdmin) return await reply("Only group admins can use this command.");

        // Ensure a command name is provided
        if (!q) return await reply("Please specify a command to deactivate.");

        const command = q.trim().toLowerCase();

        // Initialize the deactivated commands list for this group
        if (!deactivatedCommands[from]) deactivatedCommands[from] = [];

        // Check if the command is already deactivated
        if (deactivatedCommands[from].includes(command)) {
            return await reply(`The command *${command}* is already deactivated in this group.`);
        }

        // Add the command to the deactivated list
        deactivatedCommands[from].push(command);
        await reply(`The command *${command}* has been deactivated for this group.`);
    } catch (err) {
        console.error(err);
        await reply("An error occurred while processing your request.");
    }
});

// Reactivate Command

cmd({
    pattern: "activate",
    alias: ["enable"],
    react: "✅",
    desc: "Reactivate a specific command in this group",
    category: "admin",
    use: ".activate <command>",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmin, q, reply }) => {
    try {
        // Ensure the command is used in a group
        if (!isGroup) return await reply("This command can only be used in groups.");

        // Ensure only admins can use this command
        if (!isAdmin) return await reply("Only group admins can use this command.");

        // Ensure a command name is provided
        if (!q) return await reply("Please specify a command to activate.");

        const command = q.trim().toLowerCase();

        // Check if the command is currently deactivated
        if (!deactivatedCommands[from] || !deactivatedCommands[from].includes(command)) {
            return await reply(`The command *${command}* is not deactivated in this group.`);
        }

        // Remove the command from the deactivated list
        deactivatedCommands[from] = deactivatedCommands[from].filter(cmd => cmd !== command);
        await reply(`The command *${command}* has been reactivated for this group.`);
    } catch (err) {
        console.error(err);
        await reply("An error occurred while processing your request.");
    }
});

// Middleware to check if a command is deactivated
cmd.middleware = async (conn, mek, m, next) => {
    try {
        const { from, command } = m;

        // Check if the command is deactivated for the group
        if (deactivatedCommands[from] && deactivatedCommands[from].includes(command)) {
            return conn.sendMessage(from, { text: `The command *${command}* is currently deactivated in this group.` }, { quoted: mek });
        }

        // Proceed to the next middleware or command handler
        await next();
    } catch (err) {
        console.error(err);
    }
};

