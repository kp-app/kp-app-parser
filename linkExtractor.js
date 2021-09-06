import fs from 'fs'
import cheerio from 'cheerio'
import path from 'path'

const __dirname = path.resolve()
const encoding = 'utf8'
const baseUrl = 'https://technored.ru/'

export const getLinksToCats = () => {
    const htmlData = fs.readFileSync(`${__dirname}/savedHtml/technored.ru0`, encoding)
    const $ = cheerio.load(htmlData)
    let linksRaw = $('nav a')
    let links = []
    $(linksRaw).each((i, linkRaw) => {
        let href = $(linkRaw).attr('href').split('/').filter(el => el)
        href.length === 2 ? links.push(baseUrl + href.reduce((prev, cur) => prev + "/" + cur)) : null
    });
    return links.map(link => ({url: link, isProduct: false}))
}

export const getLinksToProducts = () => {
    // get all files in directory that don't end in '.ru0'
    let htmlData;
    let links = []
    // Async thing broken, not promisified so can't use async/await syntax
    const forFile = (file) => {
        if (file.slice(-1, -4) !== '.ru0' && file !== 'products') {
            htmlData = fs.readFileSync(`${__dirname}/savedHtml/${file}`, encoding)
            const $ = cheerio.load(htmlData)
            let linksRaw = $('div.productColText a.name')
            $(linksRaw).each((i, linkRaw) => {
                let href = $(linkRaw).attr('href')
                href && href !== '#' ? links.push(baseUrl + href) : null
            });
        }
    }
    let files = fs.readdirSync(`${__dirname}/savedHtml/`)
    files.forEach(forFile)
    return links.map(link => ({url: link, isProduct: true}))
}

