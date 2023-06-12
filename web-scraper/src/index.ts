//
import { JSDOM } from 'jsdom';

type Page = {
  [key: string]: number;
};

console.log(crawlPage('https://blog.logrocket.com', 'https://blog.logrocket.com', {}));

export async function crawlPage(
  baseURL: string,
  currentURL: string,
  pages: Page
) {
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
    const res = await fetch(currentURL);
    if (
      res.status > 399 ||
      !res.headers.get('content-type')?.includes('text/html')
    ) {
      console.log(
        `error handling response for ${currentURL} with status ${res.status}`
      );
      return;
    }

    const htmlText = await res.text();

    const nextUrls = getUrlsFromHTML(htmlText, currentURL);

    for (const url of nextUrls){
        pages = await crawlPage(baseURL, url, pages) || pages;
    }

  } catch (error) {
    console.log(error);
  }

  return pages
}

export function getUrlsFromHTML(htmlBody: string, baseURL: string): string[] {
  const urls: string[] = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll('a');

  for (const link of linkElements) {
    if (link.href.startsWith('/')) {
      // link is relative
      try {
        const urlObj = new URL(`${baseURL}${link.href}`);
        urls.push(urlObj.href);
      } catch (error: any) {
        console.log(error.message);
      }
    } else {
      // link is absolute
      try {
        const urlObj = new URL(link.href);
        urls.push(urlObj.href);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }
  return urls;
}

export function normarlizeUrl(url: string): string {
  let domainPath;
  try {
    const urlObj = new URL(url);
    domainPath = `${urlObj.hostname}${urlObj.pathname}`;

    if (domainPath.length && domainPath.slice(-1) === '/') {
      return domainPath.slice(0, -1);
    }
  } catch (error: any) {
    console.log(error.message);
  }
  return domainPath || '';
}
