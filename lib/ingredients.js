import cheerio from 'cheerio';

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
    const longDescription = $('.product.attribute.description').text().trim();
    return longDescription;
  } catch (error) {
    console.error(`Error fetching long description from ${url}:`, error);
    return ''; // return an empty string or handle the error as needed
  }
}

export async function getIngredients() {
  const url = 'https://brewart.com/au/store/ingredients';

  try {
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

      const longDescription = await getLongDescription(url);

      products.push({ id, url, name, image, shortDescription, longDescription, price });
    }

    return products;
  } catch (error) {
    console.error('Error in getIngredients:', error);
    return {};
  }
}