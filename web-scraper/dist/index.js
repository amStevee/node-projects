"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normarlizeUrl = exports.getUrlsFromHTML = exports.crawlPage = void 0;
//
const jsdom_1 = require("jsdom");
console.log(crawlPage('https://blog.logrocket.com', 'https://blog.logrocket.com', {}));
function crawlPage(baseURL, currentURL, pages) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        //================ BASECODE===========================//
        const baseURLObj = new URL(baseURL);
        const currentURLObj = new URL(currentURL);
        if (baseURLObj.hostname !== currentURLObj.hostname) {
            return pages;
        }
        //   add url to object and increment if url has already been crawled.
        const normarlizeCurrentURL = normarlizeUrl(currentURL);
        if (pages[normarlizeCurrentURL] > 0) {
            pages[normarlizeCurrentURL]++;
            return pages;
        }
        pages[normarlizeCurrentURL] = 1;
        //===============BASECODE ENDS=========================//
        //  asyn SET RESULT
        console.log(`crawling ${currentURL}..`);
        try {
            const res = yield fetch(currentURL);
            if (res.status > 399 ||
                !((_a = res.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('text/html'))) {
                console.log(`error handling response for ${currentURL} with status ${res.status}`);
                return;
            }
            const htmlText = yield res.text();
            const nextUrls = getUrlsFromHTML(htmlText, currentURL);
            for (const url of nextUrls) {
                pages = (yield crawlPage(baseURL, url, pages)) || pages;
            }
        }
        catch (error) {
            console.log(error);
        }
        return pages;
    });
}
exports.crawlPage = crawlPage;
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
    let domainPath;
    try {
        const urlObj = new URL(url);
        domainPath = `${urlObj.hostname}${urlObj.pathname}`;
        if (domainPath.length && domainPath.slice(-1) === '/') {
            return domainPath.slice(0, -1);
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return domainPath || '';
}
exports.normarlizeUrl = normarlizeUrl;
