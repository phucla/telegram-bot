import axios from 'axios';
import * as cheerio from 'cheerio'

export async function scrapeWebsite(url) {
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        const results = [];
        const mauvao = [];
        const giaBanRa = []
        // --- Customize your scraping logic here ---
        // Example: Scrape all link texts from the page
        const title = $('.headerindex1');
        const gia = $('.headerindex2');
        const banRa = $('.headerindex3');
        // // loai vang
        // for(let i = 1; i <3; i++) {
        //     const text = $(title[i]).text().trim();
        //     if (text) {
        //         results.push(`[${text}]`);
        //     }
        // }
        
        // // Gia ban ra
        // for(let i = 1; i <3; i++) {
        //     const text = $(banRa[i]).text().trim();
        //     if (text) {
        //         giaBanRa.push(`[${text}]`);
        //     }
        // }

        // // Gia mua vao
        // for(let i = 1; i <3; i++) {
        //     const text = $(gia[i]).text().trim();
        //     if (text) {
        //         mauvao.push(`[${text}]`);
        //     }
        // }
        // // ------------------------------------------
        // let text = ''
        // results.forEach((item, index) => {
        //     text += item + '\t' + mauvao[index] + '\t' + giaBanRa[index] +'\n'
        // })
        return {giamuavao: $(gia[1]).text().trim(), giabanra: $(banRa[1]).text().trim()}
    } catch (error) {
        console.error(`Scraping error: ${error}`);
        return 'Failed to crawl the website. Check the URL or selectors.';
    }
}
