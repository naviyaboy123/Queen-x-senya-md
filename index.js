const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')


const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const { File } = require('megajs');
const l = console.log;

var { updateCMDStore, isbtnID, getCMDStore, getCmdForCmdId, connectdb, input, get, updb, updfb } = require('./lib/database');

if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
    const sessdata = config.SESSION_ID.split("NAVIYA-MD=")[1];
    const filer = File.fromURL('https://mega.nz/file/' + sessdata);
    filer.load((err, data) => {
        if (err) throw err;
        fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
            console.log('Session download✔️');
        });
    });
}

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {
    console.log('🤖 Connecting To Whatsapp...');
    await connectdb();
    await updb();
    const prefix = await get('PREFIX');
    const aliveMsg = await get('ALIVE_MSG');
    const aliveLogo = await get('ALIVE_IMG');
    const sudo = await get('SUDO');
    const mode = await get('MODE');
    const autoSticker = await get('AUTO_STICKER');
    const autoReply = await get('AUTO_REPLY');
    const autoReact = await get('AUTO_REACT');
    const antiLink = await get('ANTI_LINK');
    const autoReadStatus = await get('AUTO_READ_STATUS');
    const antiBot = await get('ANTI_BOT');
    const antiBad = await get('ANTI_BAD');
    const alwaysOnline = await get('ALLWAYS_OFFLINE');
    const recording = await get('RECORDING');
    const autoVoice = await get('AUTO_VOICE');
    const readCmd = await get('READ_CMD');
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
    var { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS('Firefox'),
        syncFullHistory: true,
        auth: state,
        version: version
    });

    sock.ev.on('connection.update', update => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) connectToWA();
        } else if (connection === 'open') {
            console.log('🚀 _SEON-MD Connected Successfully!_ ✅');
            const path = require('path');
            fs.readdirSync('./ALLCMDS/').forEach(file => {
                if (path.extname(file).toLowerCase() == '.js') require('./ALLCMDS/' + file);
            });
            console.log('⭕ Plugins Installing Completed...✓');
            console.log('🤖 SEON-MD Start And Connected...✓');
            let welcomeMessage = '*🔆 Your Currently Settings ‼️*\n\n*🔰 Prefix* - ' + prefix + '\n\n*🔰 Alive_Msg* - ' + aliveMsg + '\n\n*🔰 Alive_Logo* - ' + aliveLogo + '\n\n*🔰 Sudo_Number* - ' + sudo + '\n\n*🔰 Mode* - ' + mode + '\n\n*🔰 Auto_Sticker* - ' + autoSticker + '\n\n*🔰 Auto_Reply* - ' + autoReply + '\n\n*🔰 Auto_React* - ' + autoReact + '\n\n*🔰 Anti_link* - ' + antiLink + '\n\n*🔰 Auto_Read_Status* - ' + autoReadStatus + '\n\n*🔰 Anti_Bot* - ' + antiBot + '\n\n*🔰 Anti_Bad* - ' + antiBad + '\n\n*🔰 Always_Online* - ' + alwaysOnline + '\n\n*🔰 Auto_Recording* - ' + recording + '\n\n*🔰 Auto_Voice* - ' + autoVoice + '\n\n*🔰 Read_Cmd* - ' + readCmd + '\n\n> *📡 Use .apply .settings and .reset commands to change these settings.*';
            sock.sendMessage(prefix + '@s.whatsapp.net', { image: { url: 'https://i.ibb.co/6Hx9Zkf/SEON-MD-V2.png' }, caption: welcomeMessage });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async message => {
        if (await get('AUTO_READ_STATUS') === 'true' && message.messages[0].key.remoteJid !== 'status@broadcast') {
            await sock.readMessages([message.messages[0].key]);
        }
        message = message.messages[0];
        if (!message.message) return;
        message.message = getContentType(message.message) === 'ephemeralMessage' ? message.message.ephemeralMessage.message : message.message;
        if (message.key && message.key.remoteJid === 'status@broadcast') return;

        const smsMessage = sms(sock, message);
        const contentType = getContentType(message.message);
        const messageContent = JSON.stringify(message.message);
        const chatId = message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderId = message.key.participant ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : message.key.remoteJid;
        const sender = senderId.split('@')[0];
        const botNumber = sock.user.id.split(':')[0];
        const isOwner = prefix.includes(sender) || botNumber.includes(sender);
        const groupMetadata = isGroup ? await sock.groupMetadata(chatId) : '';
        const groupName = isGroup ? groupMetadata.subject : '';
        const groupAdmins = isGroup ? await getGroupAdmins(groupMetadata.participants) : '';
        const isBotGroupAdmin = isGroup ? groupAdmins.includes(sock.user.id) : false;
        const isSenderGroupAdmin = isGroup ? groupAdmins.includes(senderId) : false;
        const isCommand = messageContent.startsWith(prefix);
        const command = isCommand ? messageContent.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
        const args = messageContent.trim().split(/ +/).slice(1);
        const q = args.join(' ');

        if (sender.startsWith('212') && await get('ANTI_BOT') === 'true') {
            console.log('Blocking number +212' + sender.slice(3) + '...');
            if (isGroup) {
                await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                await sock.sendMessage(chatId, { text: 'User with +212 number detected and removed from the group.' });
            } else {
                await sock.updateBlockStatus(senderId, 'block');
                console.log('Blocked +212' + sender.slice(3));
            }
            return;
        }

        if (isCommand) {
            const commands = require('./command').commands;
            const cmd = commands.find(cmd => cmd.pattern === command) || commands.find(cmd => cmd.alias && cmd.alias.includes(command));
            if (cmd) {
                if (cmd.react) sock.sendMessage(chatId, { react: { text: cmd.react, key: message.key } });
                try {
                    cmd.run(sock, message, smsMessage, {
                        from: chatId, quoted: message.message.extendedTextMessage ? message.message.extendedTextMessage.contextInfo.participant : '', body: messageContent, isCmd: isCommand, command, args, q, isGroup, sender: senderId, senderNumber: sender, botNumber2: sock.user.id, botNumber, pushname: message.pushName || message.quoted ? message.quoted.pushName : '', isMe: sock.user.id === senderId, isOwner, groupMetadata, groupName, participants: groupMetadata ? groupMetadata.participants : '', groupAdmins, isBotAdmins: isBotGroupAdmin, isAdmins: isSenderGroupAdmin, reply: (text) => sock.sendMessage(chatId, { text: text }, { quoted: message })
                    });
                } catch (err) {
                    console.log('[PLUGIN ERROR] ' + err);
                }
            }
        }

        const pluginCommands = require('./command').commands.filter(cmd => cmd.on === 'message');
        pluginCommands.forEach(async cmd => {
            if (messageContent && cmd.on === 'message') {
                cmd.run(sock, message, smsMessage, {
                    from: chatId, l: l, quoted: message.message.extendedTextMessage ? message.message.extendedTextMessage.contextInfo.participant : '', body: messageContent, isCmd: isCommand, command: cmd, args, q, isGroup, sender: senderId, senderNumber: sender, botNumber2: sock.user.id, botNumber, pushname: message.pushName || message.quoted ? message.quoted.pushName : '', isMe: sock.user.id === senderId, isOwner, groupMetadata, groupName, participants: groupMetadata ? groupMetadata.participants : '', groupAdmins, isBotAdmins: isBotGroupAdmin, isAdmins: isSenderGroupAdmin, reply: (text) => sock.sendMessage(chatId, { text: text }, { quoted: message })
                });
            }
        });

        await get('ALLWAYS_OFFLINE') === 'true' && sock.sendPresenceUpdate('unavailable');

        if (sender.startsWith('212') && await get('BAD_NO_BLOCK') === 'true') {
            console.log('Blocking number +212' + sender.slice(3) + '...');
            if (isGroup) {
                await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                await sock.sendMessage(chatId, { text: 'User with +212 number detected and removed from the group.' });
            } else {
                await sock.updateBlockStatus(senderId, 'block');
                console.log('Blocked +212' + sender.slice(3));
            }
            return;
        }

        if (config.ANTI_LINK == 'true') {
            if (!isOwner && isGroup && isBotGroupAdmin) {
                if (messageContent.match('chat.whatsapp.com')) {
                    if (prefix.includes(sender)) return await sock.sendMessage(chatId, { text: 'Link Derect but i can\'t Delete link' });
                    if (groupAdmins.includes(senderId)) return;
                    await sock.sendMessage(chatId, { delete: message.key });
                    await sock.groupParticipantsUpdate(chatId, [senderId], 'remove');
                }
            }
        }

        const badWords = await fetchJson('https://raw.githubusercontent.com/SEON-MD/SEON-MD-DATABASE/refs/heads/main/bad_word.json');

        if (config.ANTI_BAD == 'true') {
            if (!isSenderGroupAdmin && !isOwner) {
                for (any in badWords) {
                    if (messageContent.toLowerCase().includes(badWords[any])) {
                        if (!messageContent.includes('docu') && !messageContent.includes('image') && !messageContent.includes('video') && !messageContent.includes('gif') && groupAdmins.includes(senderId)) return;
                        if (message.key.fromMe) return;
                        await sock.sendMessage(chatId, { delete: message.key });
                        await sock.sendMessage(chatId, { text: '*Bad word detected..!*' });
                    }
                }
            }
        }

        if (config.ANTI_BOT == 'true') {
            if (isGroup && !isSenderGroupAdmin && !isOwner && !prefix.includes(sender) && isBotGroupAdmin && message.id.startsWith('3EB0') && await sock.sendMessage(chatId, { text: '❌ ```Another Bot\'s message Detected:``` 📚 *Removed By SEON-MD* ❗\nAnti Bot System on...' }) && config.BOT_NO_BLOCK == 'true' && isBotGroupAdmin && await sock.sendMessage(chatId, { delete: message.key }) && await sock.groupParticipantsUpdate(chatId, [senderId], 'remove'));
        }

        const blockedNumbers = ['94742195461@s.whatsapp.net'].map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(senderId);
        const bannedUsers = ['94742195461@s.whatsapp.net'].map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(senderId);

        if (!isOwner && await get('MODE') === 'private') return;
        if (!isOwner && isGroup && await get('MODE') === 'inbox') return;
        if (!isOwner && !isGroup && await get('MODE') === 'groups') return;
        if (isCommand && blockedNumbers) return sock.sendMessage(chatId, { text: '❌ *You are banned from using Commands.....*\n\n*_Please contact SEON-MD Bot Owners <94742195461 Remove your Ban_* 👨‍🔧\n' });

        const commands = require('./command');
        const cmd = isCommand ? commands.commands.find(cmd => cmd.pattern === command) || commands.commands.find(cmd => cmd.alias && cmd.alias.includes(command)) : false;
        if (isCommand) {
            if (cmd) {
                if (cmd.react) sock.sendMessage(chatId, { react: { text: cmd.react, key: message.key } });
                try {
                    cmd.run(sock, message, smsMessage, {
                        from: chatId, quoted: message.message.extendedTextMessage ? message.message.extendedTextMessage.contextInfo.participant : '', body: messageContent, isCmd: isCommand, command, args, q, isGroup, sender: senderId, senderNumber: sender, botNumber2: sock.user.id, botNumber, pushname: message.pushName || message.quoted ? message.quoted.pushName : '', isMe: sock.user.id === senderId, isOwner, groupMetadata, groupName, participants: groupMetadata ? groupMetadata.participants : '', groupAdmins, isBotAdmins: isBotGroupAdmin, isAdmins: isSenderGroupAdmin, reply: (text) => sock.sendMessage(chatId, { text: text }, { quoted: message })
                    });
                } catch (err) {
                    console.log('[PLUGIN ERROR] ' + err);
                }
            }
        }

        const pluginCommands = require('./command').commands.filter(cmd => cmd.on === 'message');
        pluginCommands.forEach(async cmd => {
            if (messageContent && cmd.on === 'message') {
                cmd.run(sock, message, smsMessage, {
                    from: chatId, l: l, quoted: message.message.extendedTextMessage ? message.message.extendedTextMessage.contextInfo.participant : '', body: messageContent, isCmd: isCommand, command: cmd, args, q, isGroup, sender: senderId, senderNumber: sender, botNumber2: sock.user.id, botNumber, pushname: message.pushName || message.quoted ? message.quoted.pushName : '', isMe: sock.user.id === senderId, isOwner, groupMetadata, groupName, participants: groupMetadata ? groupMetadata.participants : '', groupAdmins, isBotAdmins: isBotGroupAdmin, isAdmins: isSenderGroupAdmin, reply: (text) => sock.sendMessage(chatId, { text: text }, { quoted: message })
                });
            }
        });

        await get('ALLWAYS_OFFLINE') === 'true' && sock.sendPresenceUpdate('unavailable');
    });
}

app.use('/', async (req, res, next) => {
    res.send('🚀 SEON-MD Connected Successfully! ⭕ Plugins Installing... \n⭕ Plugins Installing Completed...✓ \n🤖 SEON-MD Start And Connected...✓');
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
    connectToWA();
}, 4000);
