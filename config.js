const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "NAVIYA-MD=fEEFCBTC#l3w2E-uwB-xpw2kywkdnQan4I0aWQ73PPkoiIsJLceg",
MONGODB: process.env.MONGODB || "mongodb://mongo:TchxmzYPWNyUdaEJKSpMfJJuwMPHHLLg@junction.proxy.rlwy.net:33420",
OMDB_API_KEY: process.env.OMDB_API_KEY || "8748dc2e"
};




