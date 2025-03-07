// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

async function scrapeCarousell(keywords) {
    const encodedKeywords = encodeURIComponent(keywords);
    const URL = `https://www.carousell.com.my/search/${encodedKeywords}`;
    let browser;
    browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--no-zygote",
        ],
        executablePath:
          process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
        headless: true,
      });
  
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(URL, { waitUntil: 'networkidle2' });

    // Print the HTML content for debugging
    // const htmlContent = await page.content();
    // console.log(htmlContent);

    // WARNING: Do not remove
    await page.waitForSelector(".D_la.D_or");

    const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll(".D_la.D_or");
        const all_products = [];
        productElements.forEach((product, index) => {
            if (index < 8) {
                const nameElement = product.querySelector("a.D_jw > p.D_jY");
                const priceElement = product.querySelector("a.D_jw > div.D_nv > p.D_jY");
                const imgElement = product.querySelector("a.D_jw > div.D_nk > div.D_UJ > img");
                const linkElement = product.querySelector("a.D_jw[href*='/p/']");

                const name = nameElement ? nameElement.innerText.trim() : "N/A";
                const price = priceElement ? priceElement.innerText.trim() : "N/A";
                const imgLink = imgElement ? imgElement.src : "N/A";
                const productLink = linkElement ? linkElement.href : "N/A";

                all_products.push({
                    name: name,
                    price: price,
                    img_link: imgLink,
                    product_link: productLink
                });
            }
        });
        return all_products;
    });
    // WARNING: must comment out when running app.py
    // uncomment only when testing this script ->
    // node puppeteer_scripts/scrape_carousell.js "leather bag"
    // console.log(JSON.stringify(products));
    await browser.close();
    return products;
} 


const keywords = process.argv[2];
scrapeCarousell(keywords).then(products => {
    console.log(JSON.stringify(products));
});

// // ----------------------------------------------------------------------------------
// // FALLBACK CODE
// // ----------------------------------------------------------------------------------
// async function scrapeCarousell(keywords) {
//     const encodedKeywords = encodeURIComponent(keywords);
//     const URL = `https://www.carousell.com.my/search/${encodedKeywords}`;
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(URL, { waitUntil: 'networkidle2' });

//     // Print the HTML content for debugging
//     // const htmlContent = await page.content();
//     // console.log(htmlContent);

//     // WARNING: Do not remove
//     await page.waitForSelector(".D_la.D_or");

//     const products = await page.evaluate(() => {
//         const productElements = document.querySelectorAll(".D_la.D_or");
//         const all_products = [];
//         productElements.forEach((product, index) => {
//             if (index < 8) {
//                 const nameElement = product.querySelector("a.D_jw > p.D_jY");
//                 const priceElement = product.querySelector("a.D_jw > div.D_nv > p.D_jY");
//                 const imgElement = product.querySelector("a.D_jw > div.D_nk > div.D_UJ > img");
//                 const linkElement = product.querySelector("a.D_jw[href*='/p/']");

//                 const name = nameElement ? nameElement.innerText.trim() : "N/A";
//                 const price = priceElement ? priceElement.innerText.trim() : "N/A";
//                 const imgLink = imgElement ? imgElement.src : "N/A";
//                 const productLink = linkElement ? linkElement.href : "N/A";

//                 all_products.push({
//                     name: name,
//                     price: price,
//                     img_link: imgLink,
//                     product_link: productLink
//                 });
//             }
//         });
//         return all_products;
//     });
//     // WARNING: must comment out when running app.py
//     // uncomment only when testing this script ->
//     // node puppeteer_scripts/scrape_carousell.js "leather bag"
//     // console.log(JSON.stringify(products));
//     await browser.close();
//     return products;
// } 


// const keywords = process.argv[2];
// scrapeCarousell(keywords).then(products => {
//     console.log(JSON.stringify(products));
// });