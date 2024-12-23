const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio');
const tools = require('../lib/Config');

async function search(query) {
    let response = await fetch(tools.api(5, '/apps/search', { 'query': query, 'limit': 1000 }));
    let result = {};
    response = await response.json();
    result = response.datalist.list.map(item => {
        return { 'name': item.name, 'id': item.file };
    });
    return result;
}

async function download(appId) {
    let response = await fetch(tools.api(5, '/apps/search', { 'query': appId, 'limit': 1 }));
    response = await response.json();
    let appName = response.datalist.list[0].name;
    let appPackage = response.datalist.list[0].package;
    let appIcon = response.datalist.list[0].icon;
    let appDownloadLink = response.datalist.list[0].file.path;
    let appLastUpdated = response.datalist.list[0].updated;

    return {
        'name': appName,
        'lastup': appLastUpdated,
        'package': appPackage,
        'icon': appIcon,
        'dllink': appDownloadLink
    };
}

module.exports = { 'search': search, 'download': download };
