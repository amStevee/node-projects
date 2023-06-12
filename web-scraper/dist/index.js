"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normarlizeUrl = exports.getUrlsFromHTML = void 0;
//
const jsdom_1 = require("jsdom");
function getUrlsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new jsdom_1.JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for (const link of linkElements) {
        if (link.href.startsWith('/')) {
            // link is relative
            try {
                const urlObj = new URL(`${baseURL}${link.href}`);
                urls.push(urlObj.href);
            }
            catch (error) {
                console.log(error.message);
            }
        }
        else {
            // link is absolute
            try {
                const urlObj = new URL(link.href);
                urls.push(urlObj.href);
            }
            catch (error) {
                console.log(error.message);
            }
        }
    }
    return urls;
}
exports.getUrlsFromHTML = getUrlsFromHTML;
function normarlizeUrl(url) {
    try {
        const urlObj = new URL(url);
        const domainPath = `${urlObj.hostname}${urlObj.pathname}`;
        if (domainPath.length && domainPath.slice(-1) === '/') {
            return domainPath.slice(0, -1);
        }
        return domainPath;
    }
    catch (error) {
        console.log(error.message);
    }
}
exports.normarlizeUrl = normarlizeUrl;
