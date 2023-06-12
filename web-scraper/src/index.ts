//
import { JSDOM } from 'jsdom';

export async function crawlPage(
  baseURL: string,
  currentURL: string,
  pages: string
) {
  let result;
  try {
    const res = await fetch(currentURL);
    if (
      res.status < 399 &&
      res.headers.get('content-type')?.includes('text/html')
    ) {
      result = await res.text();
    } else {
      console.log(`error handling your response for ${currentURL}`);
      return;
    }
  } catch (error) {
    console.log(error);
  }
  return result;
}

export function getUrlsFromHTML(htmlBody: string, baseURL: string): object {
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
