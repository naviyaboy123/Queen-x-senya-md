const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "NAVIYA-MD=XcERTIQZ#EUvbAO9_d3TP6wUahaAIkENjvTp5WYiPx0PDEFVFxrw",
MONGODB: process.env.MONGODB || "mongodb://mongo:hDtscvzygtxOuBnrNGaNkRbsgziCJjjq@junction.proxy.rlwy.net:22030",
OMDB_API_KEY: process.env.OMDB_API_KEY || "8748dc2e"
};



