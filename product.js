import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'

const __dirname = path.resolve()
const encoding = ''

export const parseProducts = () => {
    let htmlData;
    let links = []
    // Async thing broken, not promisified so can't use async/await syntax
    const forFile = (file) => {
        htmlData = fs.readFileSync(`${__dirname}/savedHtml/products/${file}`, encoding)
        const $ = cheerio.load(htmlData)
        
        let techSpecKeys = $('#elementProperties table td.name')
        $(techSpecKeys).each((i, td) => {
            console.log($(td).html())
        })
        // let linksRaw = $('div.productColText a.name')
        
        // $(linksRaw).each((i, linkRaw) => {
        //     let href = $(linkRaw).attr('href')
        //     href && href !== '#' ? links.push(baseUrl + href) : null
        // });
        
    }
    let files = fs.readdirSync(`${__dirname}/savedHtml/products`)
    files.forEach(forFile)
}

export const putToDB = () => {
    
}