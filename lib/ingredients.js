import * as cheerio from 'cheerio';

async function getLongDescription(url) {
  try {
    const response = await fetch(url, {
      next: { revalidate: 604800 }, // one week
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const longDescription = $('#brewInfo > .product.attribute.description').text().trim().replace(/<br>|\n|\r/g, '\n').replace(/&nbsp;/g, ' ').replace(/\s{2,}/g, ' ');
    return longDescription;
  } catch (error) {
    console.error(`Error fetching long description from ${url}:`, error);
    return ''; // return an empty string or handle the error as needed
  }
}

export async function getIngredients() {
  const url = 'https://brewart.com/au/store/ingredients';

  try {
    const ingredientsInfo = require('@/lib/ingredientsInfo.json');
    const productOrigins = require('@/lib/productOrigins.json');
    const response = await fetch(url, {
      next: { revalidate: 604800 }, // one week
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    let products = [];
    const items = $('.item');

    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      const url = $(element).find('h4 a').attr('href').trim();
      const image = $(element).find('.product-image-photo').attr('src');
      let id = image.split('/').pop().split('.')[0];
      id = id.split('_')[0].toUpperCase(); // Extract ID before the underscore and convert to uppercase
  
      // Special handling for Dry Hops and Primer
      if (id === 'ICON') {
        const iconNumber = image.split('/').pop().split('.')[0].split('_')[2]; // Extract number for ICON
        id = iconNumber.toUpperCase(); // Assign ID as D followed by the number
      } else if (id === 'PRIMER') {
          id = 'P'; // Assign ID as P for Primer
      }
  
      const name = $(element).find('h4 a').text().trim();
      const shortDescription = $(element).find('.short-desc').text().trim();
      const priceText = $(element).find('.price-box .price-wrapper .price').text().trim().replace('$', '');
      const price = parseFloat(priceText);

      const countryOfOrigin = productOrigins[id] || "";

      let category;
      switch (id[0]) {
          case 'E':
              category = 'Elements';
              break;
          case 'X':
              category = 'Enhancers';
              break;
          case 'H':
              category = 'Hop Oils';
              break;
          case 'D':
              category = 'Dry Hops';
              break;
          case 'Y':
              category = 'Yeast';
              break;
          case 'P':
              category = 'Primer';
              break;
          case 'C':
              category = 'Droid Cleanse';
              break;
          default:
            category = null; 
      }
      const info = (category && id[0] !== 'P' && id[0] !== 'C') ? ingredientsInfo[category][id] : {};

      const longDescription = await getLongDescription(url);

      products.push({ id, category, url, name, image, shortDescription, longDescription, price, countryOfOrigin, info });
    }

    // Get Droid Cleanse
    const droidCleanseUrl = 'https://brewart.com/au/droid-cleanse';
    const droidCleanseResponse = await fetch(droidCleanseUrl, {
      next: { revalidate: 604800 }, // one week
    });
    if (!droidCleanseResponse.ok) {
      throw new Error('Failed to fetch data')
    }
    const droidCleanseHtml = await droidCleanseResponse.text();
    const $droidCleanse = cheerio.load(droidCleanseHtml);
    const name = $droidCleanse('#brewInfo > div.brewName').text().trim();
    const shortDescription = '';
    const longDescription = $droidCleanse('.product.attribute.description').text().trim().replace(/<br>|\n|\r/g, '\n').replace(/&nbsp;/g, ' ').replace(/\s{2,}/g, ' ');
    const priceText = $droidCleanse('.price-box.product-info-price .price').text().trim().replace('$', '');
    const price = parseFloat(priceText);
    const image = $droidCleanse('#image').attr('src');

    products.push({ id: 'C', category: 'Droid Cleanse', url: droidCleanseUrl, name, image, shortDescription, longDescription, price, countryOfOrigin: '', info: {} });
    
    return products;
  } catch (error) {
    console.error('Error in getIngredients:', error);
    return {};
  }
}