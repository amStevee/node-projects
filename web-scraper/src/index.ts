//
import { JSDOM } from 'jsdom';

export function getUrlsFromHTML(htmlBody: string, baseURL: string) {
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

export function normarlizeUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const domainPath = `${urlObj.hostname}${urlObj.pathname}`;

    if (domainPath.length && domainPath.slice(-1) === '/') {
      return domainPath.slice(0, -1);
    }
    return domainPath;
  } catch (error: any) {
    console.log(error.message);
  }
}
