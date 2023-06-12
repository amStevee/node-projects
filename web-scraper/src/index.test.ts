import Crawl from './index';
import { test, expect } from '@jest/globals';

const crawler = new Crawl();

test('normarlizeUrl strip protocol', () => {
  const input = 'https://daydream.netlify.app/path';
  const actual = crawler.normarlizeUrl(input);
  const expected = 'daydream.netlify.app/path';
  expect(actual).toEqual(expected);
});

test('normarlizeUrl strip slash', () => {
  const input = 'https://daydream.netlify.app/path/';
  const actual = crawler.normarlizeUrl(input);
  const expected = 'daydream.netlify.app/path';
  expect(actual).toEqual(expected);
});

test('normarlizeUrl strip http', () => {
  const input = 'http://daydream.netlify.app/path/';
  const actual = crawler.normarlizeUrl(input);
  const expected = 'daydream.netlify.app/path';
  expect(actual).toEqual(expected);
});

test('getUrlsFromHTML for absolute urls', () => {
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
  expect(actual).toEqual(expected);
});

test('getUrlsFromHTML for relative urls', () => {
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
  expect(actual).toEqual(expected);
});

test('getUrlsFromHTML check for invalid links', () => {
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
  expect(actual).toEqual(expected);
});
