import fs from 'fs'
import util from 'util'
import path from 'path'
import cheerio from 'cheerio'

const __dirname = path.resolve()
const encoding = ''
const readdir = util.promisify(fs.readdir)

export const parseProducts = async () => {
    let things = []
    let htmlData;
    
    const forFile = async (file) => {
        let categoryName = ""
        let subcategoryName = ""

        htmlData = fs.readFileSync(`${__dirname}/savedHtml/products/${file}`, encoding)
        const $ = cheerio.load(htmlData)
        
        $('#breadcrumbs li a span').each((i, span) => {
            
            if (i === 2) {
                categoryName = $(span).text()
                
            }
            if (i === 3) {
                subcategoryName = $(span).text()
                
            }
        })
        const pricingData = $('a.price span.priceVal').first().text().trim()
        let pricing;
        if (pricingData) {  
            switch (pricingData[0]) {
                case 'О': 
                    pricing = Number(pricingData.slice(4).split(",").join(""))
                    break
                case '€':
                    pricing = Number(pricingData.slice(1).split(",").join(""))
                    break
                case '$':
                    pricing = Number(pricingData.slice(1).split(",").join(""))
                    break
                default:
                    pricing = 0
            }
        } else {
            pricing = 0
        }
        
        const fullName = $('h1.changeName').text().trim()
        
        let techSpecsKeys = $('#elementProperties table td.name')
        let techSpecs = {}
        let techApplication = {'applicationArea': ''}
        $(techSpecsKeys).each((i, td) => {
            let key = $(td).text().trim()
            let val =  $(td).siblings().not('.right').text().trim()
            
            if (key === 'Область применения') {
                techApplication['applicationArea'] = val
            } else {
                techSpecs = {...techSpecs, [key]: val}
            }
        })
        const product = {fullName: fullName, ...techApplication, specs: techSpecs, pricing: {
            pricelistCost: pricing
        }}
        console.log(product)
        return [product, subcategoryName, categoryName]
    }
    let files = await readdir(`${__dirname}/savedHtml/products`)
    for (let file of files) {
        let thing = await forFile(file)
        things.push(thing)
    }
    return things
}