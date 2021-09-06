import puppeteer from 'puppeteer';
import fs from 'fs'
import cheerio from 'cheerio'
import axios from 'axios'
import path from 'path'
import iconv from 'iconv'

export const mainPageUrl = "https://technored.ru/";
const __dirname = path.resolve()

// open in puppeteer
export const sessionWriter = async (urls) => {
    const browser = await puppeteer.launch();
    for (let urlObj of urls) {
        let url = urlObj.url
        let isProduct = urlObj.isProduct
        let pages = await downloadHtml(browser, url);
        let fileSuffix = url.split("/").slice(-2, -1)[0]
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
    await browser.close();
}
const downloadHtml = async (browser, url) => {
    if (url.split(".").slice(-1)[0] !== "html") {
        const page = await browser.newPage();
        await page.setViewport({ width: 1400, height: 900})
        await page.goto(url);

        let newContent = await page.content()
        let content = [newContent]
        let $ = cheerio.load(newContent)
        console.log($('div.bx-pagination').html())
        while ($('div.bx-pagination ul li.bx-pag-next a').html()) {
            // if output is paginated, toggle the items/page or just append html
            // select#selectCountElements option - toggle as an alternative
            let [response] = await Promise.all([
                page.waitForNavigation({waitUntil: "networkidle0"}),
                page.click('div.bx-pagination ul li.bx-pag-next'),
            ]);  
            newContent = await page.content()
            content.push(newContent)
            $ = cheerio.load(newContent)
            console.log($('div.bx-pagination').html())
        }
        return content
    } else {
        // pure html download, pre-rendered
        // set encoding?
        axios.interceptors.response.use(response => {
            // let ctype = response.headers["content-type"];
            // const $ = cheerio.load(response.data)
            // let metaTags = $('meta')
            // let encoding = 'windows-1251'
            // $(metaTags).each(() => {
            //     encoding = $(this).attr('http-equiv') ? $(this).attr('content').split("charset=")[1] : encoding
            // })
            response.data = iconv.Iconv('windows-1251', 'utf8').convert(response.data).toString()
            return response;
          })
        let content = [(await axios.get(url)).data]
        return content
    }
    
};

// USAGE EXAMPLE
// sessionWriter([{url: mainPageUrl, isProduct: false}])