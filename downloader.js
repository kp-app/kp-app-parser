import puppeteer from 'puppeteer';
import fs from 'fs'
import cheerio from 'cheerio'
import path from 'path'


export const mainPageUrl = "https://technored.ru/";
const __dirname = path.resolve()

// open in puppeteer
export const sessionWriter = async (urls) => {
    const browser = await puppeteer.launch();
    for (let urlObj of urls) {
        let url = urlObj.url
        let isProduct = urlObj.isProduct
        if (!url.includes("avtomatizaciya_proizvodstva") && !url.includes("eoat")) {
            let pages = await downloadHtml(browser, url);
            let fileSuffix;
            isProduct ? fileSuffix = url.split("/").slice(-1)[0] : fileSuffix = url.split("/").slice(-2, -1)[0]
            pages.forEach((page, index) => {
                fs.writeFile(`${__dirname}/savedHtml${isProduct ? '/products' : ''}/${fileSuffix ? fileSuffix + index : 'default'}`, 
                page, { flag: 'w+' }, err => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(`Written in savedHtml${isProduct ? '/products' : ''}/${fileSuffix ? fileSuffix + index : 'default'}`)
                    }
                })
                
            })
        }
    }
    await browser.close();
}
const downloadHtml = async (browser, url) => {
    console.log(url)
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900})
    await page.goto(url);

    let newContent = await page.content()
    let content = [newContent]
    let $ = cheerio.load(newContent)
    
    while ($('div.bx-pagination ul li.bx-pag-next a').html()) {
        let [response] = await Promise.all([
            page.waitForNavigation({waitUntil: "networkidle0"}),
            page.click('div.bx-pagination ul li.bx-pag-next'),
        ]);  
        newContent = await page.content()
        content.push(newContent)
        $ = cheerio.load(newContent)
    }
    return content
};

// USAGE EXAMPLE
// sessionWriter([{url: mainPageUrl, isProduct: false}])

const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }