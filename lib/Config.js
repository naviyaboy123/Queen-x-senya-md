const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const APIs = {
    1: 'https://apk-dl.com',
    2: 'http://ws75.aptoide.com/api/7',
    3: 'https://apk.support',
    4: 'https://apps.evozi.com/apk-downloader',
    5: 'https://apkcombo.com',
    6: 'https://cafebazaar.ir'
};

const Proxy = (url) => url ? 'https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=' + encodeURIComponent(url) + '&client=webapp' : '';

const api = (apiIndex, endpoint = '/', params = {}) => {
    const baseURL = apiIndex in APIs ? APIs[apiIndex] : apiIndex;
    const queryString = params ? '?' + new URLSearchParams(Object.entries({ ...params })) : '';
    return baseURL + endpoint + queryString;
};

module.exports = {
    APIs,
    Proxy,
    api
};
