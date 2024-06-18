import axios from 'axios';

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

interface Product {
  title: string;
  brand: string;
  shopLink: string;
  unitPrice: number;
  rating: number;
}

async function fetchProducts(url: string): Promise<Product[] | null> {
  try {
    const response = await axios.get(url, { headers });

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      const products = response.data.data.map((product: any) => ({
        title: product.title,
        brand: product.brand,
        shopLink: product.shopLink,
        unitPrice: product.unitPrice,
        rating: product.rating
      })) as Product[];

      return products;
    } else {
      console.error('Unexpected response format:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error making request:', error);
    return null;
  }
}

// Example usage:
const url = 'https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3ASmartphones%3AmanufacturerName%3AApple%3AavailableInZones%3AMagnum_ZONE1&text&sort=relevance&qs&ui=d&i=-1&c=750000000';
fetchProducts(url).then(products => {
  if (products) {
    console.log(JSON.stringify(products, null, 2));
  }
});
