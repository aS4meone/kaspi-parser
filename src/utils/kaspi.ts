import axios from 'axios';
import * as cheerio from 'cheerio';


const headers = {
    'Accept': 'application/json, text/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection': 'keep-alive',
    'Cookie': 'k_stat=eac54892-42fa-4aad-b522-09238d6c8d39; ks.tg=63; kaspi.storefront.cookie.city=750000000',
    'Host': 'kaspi.kz',
    'Referer': 'https://kaspi.kz/shop/c/smartphones/?q=%3Acategory%3ASmartphones%3AmanufacturerName%3AApple%3AavailableInZones%3AMagnum_ZONE1&sort=relevance&sc=',
    'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'X-Ks-City': '750000000'
};

export interface Product {
    title: string;
    brand: string;
    shopLink: string;
    unitPrice: number;
    rating: number;
}

const fetchProducts = async (): Promise<Product[] | null> => {
    const urls = Array.from({ length: 10 }, (_, i) =>
        `https://kaspi.kz/yml/product-view/pl/results?page=${i + 1}&q=%3Acategory%3ASmartphones%3AmanufacturerName%3AApple%3AavailableInZones%3AMagnum_ZONE1&text&sort=relevance&qs&ui=d&i=-1&c=750000000`
    );

    try {
        const responses = await Promise.all(urls.map(url => axios.get(url, { headers })));
        const products: Product[] = [];

        responses.forEach(response => {
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                const pageProducts = response.data.data.map((product: any) => ({
                    title: product.title,
                    brand: product.brand,
                    shopLink: product.shopLink,
                    unitPrice: product.unitPrice,
                    rating: product.rating
                }));
                products.push(...pageProducts);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        });

        return products;
    } catch (error) {
        console.error('Error making request:', error);
        return null;
    }
};

export default fetchProducts;


export interface ProductDetails {
    sku: string;
    heading: string;
    short_specs: string[];
    specs: { header: string; specsList: { term: string; definition: string }[] }[];
    description: string;
}

export const fetchProductDetails = async (url: string): Promise<ProductDetails | null> => {
    try {
        const response = await axios.get(url, {headers});
        const html = response.data;
        const $ = cheerio.load(html);

        const item = $('.item');

        const sku = item.find('.item__sku').text().trim();
        const heading = item.find('.item__heading').text().trim();
        const shortSpecifications = item.find('.short-specifications__text').map((i, el) => $(el).text().trim()).get();

        const specifications = $('#SpecificationsListComponent .specifications-list__el');

        const specs = specifications.map((i, el) => {
            const header = $(el).find('.specifications-list__header').text().trim();
            const specsList = $(el).find('.specifications-list__spec').map((j, specEl) => {
                const term = $(specEl).find('.specifications-list__spec-term-text').text().trim();
                const definition = $(specEl).find('.specifications-list__spec-definition').text().trim();
                return {term, definition};
            }).get();
            return {header, specsList};
        }).get();

        const description = $('.description').text().trim();
        return {
            sku,
            heading,
            short_specs: shortSpecifications,
            specs,
            description
        };

    } catch (error) {
        console.error('Error making request:', error);
        return null;
    }
};


