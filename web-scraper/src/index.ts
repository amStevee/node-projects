import { JSDOM } from 'jsdom';

type Page = {
  [key: string]: number;
};
class Crawl {
  docLink: string[] = [];
  async crawlPage(baseURL: string, currentURL: string, pages: Page) {
    let connectionFailCount = 0;
    //================ BASECODE===========================//
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if (baseURLObj.hostname !== currentURLObj.hostname) return pages;

    //   add url to pages and increment if url has already been crawled.
    const normarlizedCurrentUrlAsIndex = this.normarlizeUrl(currentURL);
    if (pages[normarlizedCurrentUrlAsIndex] > 0) {
      pages[normarlizedCurrentUrlAsIndex]++;
      return pages;
    }
    pages[normarlizedCurrentUrlAsIndex] = 1;

    //===============BASECODE ENDS=========================//

    //  Recursive call
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

      const nextUrls = this.getUrlsFromHTML(htmlText, baseURL);

      for (const url of nextUrls) {
        this.correlateDotDocLinks(url)
        pages = (await this.crawlPage(baseURL, url, pages)) || pages;
      }
    } catch (error: any) {
        if (connectionFailCount === 0 || error.toJSON().message === "Network Error") {
            connectionFailCount += 1;

            crl.crawlPage(baseURL,currentURL,{});

            console.log(`Connection error. \n
            Reconnecting to server....`);
        } else if (connectionFailCount === 5) {
            console.error(`Can not connect to server. Try again later.`);
        }
    }
    return pages;
  }

  getUrlsFromHTML(htmlBody: string, baseURL: string): string[] {
      const urls: string[] = [];
   try {
     const dom = new JSDOM(htmlBody);
     const linkElements = dom.window.document.querySelectorAll('a');
 
     for (const link of linkElements) {
       if (link.href.startsWith('/')) {
         // link is relative
           const urlObj = new URL(`${baseURL}${link.href}`);
           urls.push(urlObj.href);
       } else {
         // link is absolute
           const urlObj = new URL(link.href);
           urls.push(urlObj.href);
       }
     }
   } catch (error: any) {
    console.error(error.message)
   }
    return urls;
  }

  normarlizeUrl(url: string): string {
    let domainPath;
    try {
      const urlObj = new URL(url);
      domainPath = `${urlObj.hostname}${urlObj.pathname}`;

      if (domainPath.length && domainPath.slice(-1) === '/') {
        return domainPath.slice(0, -1);
      }
    } catch (error: any) {
      console.log(`error.message`);
    }
    return domainPath || '';
  }

  correlateDotDocLinks(link: string): void {
    for (const docLink of Object.keys(link)) {
      if (docLink.endsWith('.pdf' || '.docx')) {
        this.docLink.push(docLink);
      }
    }
  }
}

const crl = new Crawl();

async function getAllUrl() {
  const pages =
    (await crl.crawlPage(
      'https://duowork.github.io',
      'https://duowork.github.io',
      {}
    )) || {};
    console.log(crl.docLink);
    console.log(pages)

  return pages;
}

console.log(getAllUrl());


export default Crawl;
