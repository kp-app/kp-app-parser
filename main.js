import { sessionWriter, mainPageUrl } from "./downloader.js"
import { getLinksToCats, getLinksToProducts } from "./linkExtractor.js"
import { parseProducts, putToDB } from "./product.js"

//      main.js - 1. download main page [x], get links to cats [x]
// sessionWriter([{url: mainPageUrl, isProduct: false}])
// let linksToCats = getLinksToCats()
// sessionWriter(linksToCats)
//      2. download cats [x], get links to products [x]
// let linksToProducts = getLinksToProducts()
//      3. download products [x]
let linksToProducts = [{url: "https://technored.ru/catalog/eoat/zakhvatnye_ustroystva/elektromekhanicheskie/Schunk_egh_80.html", isProduct: true}]
sessionWriter(linksToProducts)
//      TODO
//      3.5 parse 'em up
parseProducts()
//      4. put products into mongoose models
// putToDB()