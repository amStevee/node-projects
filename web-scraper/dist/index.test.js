"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const globals_1 = require("@jest/globals");
(0, globals_1.test)('normarlizeUrl strip protocol', () => {
    const input = 'https://daydream.netlify.app/path';
    const actual = (0, index_1.normarlizeUrl)(input);
    const expected = 'daydream.netlify.app/path';
    (0, globals_1.expect)(actual).toEqual(expected);
});
(0, globals_1.test)('normarlizeUrl strip slash', () => {
    const input = 'https://daydream.netlify.app/path/';
    const actual = (0, index_1.normarlizeUrl)(input);
    const expected = 'daydream.netlify.app/path';
    (0, globals_1.expect)(actual).toEqual(expected);
});
(0, globals_1.test)('normarlizeUrl strip http', () => {
    const input = 'http://daydream.netlify.app/path/';
    const actual = (0, index_1.normarlizeUrl)(input);
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
    const actual = (0, index_1.getUrlsFromHTML)(inputHtmlBody, inputBaseUrl);
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
    const actual = (0, index_1.getUrlsFromHTML)(inputHtmlBody, inputBaseUrl);
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
    const actual = (0, index_1.getUrlsFromHTML)(inputHtmlBody, inputBaseUrl);
    const expected = ['https://daydream.netlify.app/link1'];
    (0, globals_1.expect)(actual).toEqual(expected);
});
