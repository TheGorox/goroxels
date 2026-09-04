const ssr = require('../data/ssr.json');
const locale = require('locale');


const supported = new locale.Locales(['en', 'ru'], 'en');

function getLang(rawLang) {
    const locales = new locale.Locales(rawLang);
    return locales.best(supported);
}

function patchIndex(html, rawLang) {
    const lang = getLang(rawLang);

    html = replaceDescription(html, lang);
    html = replaceTitle(html, lang);
    html = replaceLanguage(html, lang);

    return html;
}

function replaceDescription(document, lang) {
    const desc = ssr[lang].desc;

    return document.replace('REPL_DESC', desc);
}

function replaceTitle(document, lang) {
    const title = ssr[lang].title;

    return document.replace('REPL_TITLE', title);
}

function replaceLanguage(document, lang) {
    return document.replace('REPL_LANG', lang);
}


module.exports = {
    patchIndex
}