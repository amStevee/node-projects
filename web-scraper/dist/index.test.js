"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const globals_1 = require("@jest/globals");
const crawler = new index_1.default();
(0, globals_1.test)('normarlizeUrl strip protocol', () => {
    const input = 'https://daydream.netlify.app/path';
    const actual = crawler.normarlizeUrl(input);
    const expected = 'daydream.netlify.app/path';
    (0, globals_1.expect)(actual).toEqual(expected);
});
(0, globals_1.test)('normarlizeUrl strip slash', () => {
    const input = 'https://daydream.netlify.app/path/';
    const actual = crawler.normarlizeUrl(input);
    const expected = 'daydream.netlify.app/path';
    (0, globals_1.expect)(actual).toEqual(expected);
});
(0, globals_1.test)('normarlizeUrl strip http', () => {
    const input = 'http://daydream.netlify.app/path/';
    const actual = crawler.normarlizeUrl(input);
    const expected = 'daydream.netlify.app/path';
    (0, globals_1.expect)(actual).toEqual(expected);
});
(0, globals_1.test)('getUrlsFromHTML for absolute urls', () => {
    const inputHtmlBody = `
  <html>
    <body>
        <a href='https://daydream.netlify.app/'>
        daydream
        </a>
    </body>
  </html>
  `;
    const inputBaseUrl = 'https://daydream.netlify.app/';
    const actual = crawler.getUrlsFromHTML(inputHtmlBody, inputBaseUrl);
    const expected = ['https://daydream.netlify.app/'];
    (0, globals_1.expect)(actual).toEqual(expected);
});
(0, globals_1.test)('getUrlsFromHTML for relative urls', () => {
    const inputHtmlBody = `
  <html>
    <body>
        <a href='https://daydream.netlify.app/link1'>
        daydream
        </a>
        <a href='/link2'>
        daydream
        </a>
    </body>
  </html>
  `;
    const inputBaseUrl = 'https://daydream.netlify.app';
    const actual = crawler.getUrlsFromHTML(inputHtmlBody, inputBaseUrl);
    const expected = [
        'https://daydream.netlify.app/link1',
        'https://daydream.netlify.app/link2',
    ];
    (0, globals_1.expect)(actual).toEqual(expected);
});
(0, globals_1.test)('getUrlsFromHTML check for invalid links', () => {
    const inputHtmlBody = `
  <html>
    <body>
        <a href='https://daydream.netlify.app/link1'>
        daydream
        </a>
        <a href='invalid'>
        invalid
        </a>
    </body>
  </html>
  `;
    const inputBaseUrl = 'https://daydream.netlify.app';
    const actual = crawler.getUrlsFromHTML(inputHtmlBody, inputBaseUrl);
    const expected = ['https://daydream.netlify.app/link1'];
    (0, globals_1.expect)(actual).toEqual(expected);
});
