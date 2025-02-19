import * as cheerio from 'cheerio'

export const preferredRegion = ['syd1', 'hnd1']

async function getLongDescription(url) {
    try {
        const response = await fetch(url, {
            next: { revalidate: 604800 }, // one week
        })
        if (!response.ok) {
            console.error(`Failed to fetch long description from ${url}`)
            return '' // Return empty string as fallback
        }
        const html = await response.text()
        const $ = cheerio.load(html)
        const longDescription = $('#brewInfo > .product.attribute.description')
            .text()
            .trim()
            .replace(/<br>|\n|\r/g, '\n')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s{2,}/g, ' ')
        return longDescription
    } catch (error) {
        console.error(`Error fetching long description from ${url}:`, error)
        return '' // return an empty string as fallback
    }
}

export async function getIngredients() {
    const url = 'https://brewart.com/au/store/ingredients'

    try {
        const ingredientsInfo = require('@/lib/ingredientsInfo.json')
        const productOrigins = require('@/lib/productOrigins.json')

        // Try to fetch ingredients page
        const response = await fetch(url, {
            next: { revalidate: 604800 }, // one week
        })
        if (!response.ok) {
            console.error(
                'Failed to fetch ingredients list, using fallback data'
            )
            return [] // Return empty array as fallback
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        let products = []
        const items = $('.item')

        // Process each ingredient with error handling
        for (let i = 0; i < items.length; i++) {
            try {
                const element = items[i]
                const url = $(element).find('h4 a').attr('href')?.trim()
                const image = $(element)
                    .find('.product-image-photo')
                    .attr('src')

                if (!url || !image) {
                    console.error('Missing required data for ingredient', i)
                    continue
                }

                let id = image.split('/').pop().split('.')[0]
                id = id.split('_')[0].toUpperCase()

                if (id === 'ICON') {
                    const iconNumber = image
                        .split('/')
                        .pop()
                        .split('.')[0]
                        .split('_')[2]
                    id = iconNumber.toUpperCase()
                } else if (id === 'PRIMER') {
                    id = 'P'
                }

                const name = $(element).find('h4 a').text().trim()
                const shortDescription = $(element)
                    .find('.short-desc')
                    .text()
                    .trim()
                const priceText = $(element)
                    .find('.price-box .price-wrapper .price')
                    .text()
                    .trim()
                    .replace('$', '')
                const price = parseFloat(priceText)

                if (!name || isNaN(price)) {
                    console.error('Missing required data for ingredient', id)
                    continue
                }

                const countryOfOrigin = productOrigins[id] || ''

                let category
                switch (id[0]) {
                    case 'C':
                        category = 'Droid Cleanse'
                        break
                    case 'Y':
                        category = 'Yeast'
                        break
                    case 'E':
                        category = 'Elements'
                        break
                    case 'X':
                        category = 'Enhancers'
                        break
                    case 'H':
                        category = 'Hop Oils'
                        break
                    case 'D':
                        category = 'Dry Hops'
                        break
                    case 'P':
                        category = 'Primer'
                        break
                    default:
                        category = null
                }

                const info =
                    category && id[0] !== 'P' && id[0] !== 'C'
                        ? ingredientsInfo[category]?.[id] || {}
                        : {}
                const longDescription = await getLongDescription(url)

                products.push({
                    id,
                    category,
                    url,
                    name,
                    image,
                    shortDescription,
                    longDescription,
                    price,
                    countryOfOrigin,
                    info,
                })
            } catch (error) {
                console.error('Error processing ingredient:', error)
                continue
            }
        }

        // Try to fetch Droid Cleanse data
        try {
            const droidCleanseUrl = 'https://brewart.com/au/droid-cleanse'
            const droidCleanseResponse = await fetch(droidCleanseUrl, {
                next: { revalidate: 604800 },
            })

            if (droidCleanseResponse.ok) {
                const droidCleanseHtml = await droidCleanseResponse.text()
                const $droidCleanse = cheerio.load(droidCleanseHtml)

                const name = $droidCleanse('#brewInfo > div.brewName')
                    .text()
                    .trim()
                const longDescription = $droidCleanse(
                    '.product.attribute.description'
                )
                    .text()
                    .trim()
                    .replace(/<br>|\n|\r/g, '\n')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/\s{2,}/g, ' ')
                const priceText = $droidCleanse(
                    '.price-box.product-info-price .price'
                )
                    .text()
                    .trim()
                    .replace('$', '')
                const price = parseFloat(priceText)
                const image = $droidCleanse('#image').attr('src')

                if (name && !isNaN(price) && image) {
                    products.push({
                        id: 'C',
                        category: 'Droid Cleanse',
                        url: droidCleanseUrl,
                        name,
                        image,
                        shortDescription: '',
                        longDescription,
                        price,
                        countryOfOrigin: '',
                        info: {},
                    })
                }
            }
        } catch (error) {
            console.error('Error fetching Droid Cleanse data:', error)
        }

        // Reorder products by category
        const categoryOrder = [
            'Droid Cleanse',
            'Yeast',
            'Elements',
            'Enhancers',
            'Hop Oils',
            'Dry Hops',
            'Primer',
        ]
        products.sort((a, b) => {
            const orderA = categoryOrder.indexOf(a.category)
            const orderB = categoryOrder.indexOf(b.category)
            return orderA - orderB
        })

        return products
    } catch (error) {
        console.error('Error in getIngredients:', error)
        return [] // Return empty array as fallback
    }
}
