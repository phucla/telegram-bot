import axios from 'axios';
import * as cheerio from 'cheerio'

export async function scrapeWebsite(url) {
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        const gia = $('.headerindex2');
        const banRa = $('.headerindex3');
     
        return {giamuavao: $(gia[1]).text().trim(), giabanra: $(banRa[1]).text().trim()}
    } catch (error) {
        console.error(`Scraping error: ${error}`);
        return 'Failed to crawl the website. Check the URL or selectors.';
    }
}
