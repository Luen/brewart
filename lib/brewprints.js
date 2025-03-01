import * as cheerio from 'cheerio'
import { getIngredients } from '@/lib/ingredients'

export const preferredRegion = ['syd1', 'hnd1']

async function getRating(ratingId) {
    const apiUrl =
        'https://api.bazaarvoice.com/data/display/0.2alpha/product/summary'
    const url = `${apiUrl}?PassKey=l2yrexxvjtmphhn6tzmuxqh0n&productid=${ratingId}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=en_US`
    // May need to update passkey in the future. See https://developer.bazaarvoice.com/conversations-api/reference/v5.4/product-display/product-summary

    try {
        const response = await fetch(url, {
            next: { revalidate: 604800 }, // one week
        })
        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        const data = await response.json()

        const primaryRating = data.reviewSummary?.primaryRating?.average
            ? data.reviewSummary.primaryRating.average
            : '0'
        const recommendedCount =
            data.reviewSummary?.recommended?.distribution.find(
                (d) => d.key === true
            )?.count
        const recommended =
            recommendedCount !== null && recommendedCount !== undefined
                ? recommendedCount
                : '0'

        return { primaryRating, recommended }
    } catch (error) {
        console.error('Error fetching rating data:', error)
        return { primaryRating: '0', recommended: '0' }
    }
}

function getTastesLike(name) {
    const brewprintsTasteLike = require('@/lib/brewprintsTasteLike.json')
    const brew = brewprintsTasteLike.find((b) => b.name === name)
    return brew ? brew.tastesLike : ''
}

async function getBrewprintIngredients(url) {
    try {
        const ingredientsList = await getIngredients()

        const response = await fetch(url, {
            next: { revalidate: 604800 }, // one week
        })
        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }
        const html = await response.text()

        const $brew = cheerio.load(html)

        const name = $brew('.brewName').text().trim()
        if (!name) {
            console.error('Could not get:', url)
        }

        let imageBanner = ''
        let imageIcon = ''

        const backgroundImageStyle = $brew('.brewHero').css('background-image')
        if (backgroundImageStyle) {
            const imageUrlPattern = /url\((['"]?)(.*?)\1\)/
            const imageMatch = backgroundImageStyle.match(imageUrlPattern)
            imageBanner = imageMatch ? imageMatch[2] : ''
            imageIcon = imageBanner
                .replace('banner', 'icon')
                .replace('1440', '600')
        } else {
            //console.error('Background image style not found for:', url);
        }

        const shortDescription = $brew(
            '#brewInfo div.product.attribute.overview'
        )
            .text()
            .trim()
            .replace('-tsar', '-star')
        const longDescription = $brew('.product.attribute.description')
            .text()
            .trim()
            .replace(/\n|\r|&nbsp;|<br>/g, ' ')
            .replace(/\s{2,}/g, ' ')
        const ratingId = $brew('div[data-bv-show="rating_summary"]').attr(
            'data-bv-product-id'
        )
        const priceText = $brew('.price-box.product-info-price .price')
            .text()
            .trim()
            .replace('$', '')
        const price = parseFloat(priceText)
        const alcoholByVolume = parseFloat(
            $brew('.label-name:contains("Alcohol by Volume*")')
                .siblings('.col-xs-2')
                .text()
                .trim()
        )
        const colour = parseFloat(
            $brew('.label-name:contains("Colour")')
                .siblings('.col-xs-2')
                .text()
                .trim()
        )
        const bitterness = parseFloat(
            $brew('.label-name:contains("Bitterness")')
                .siblings('.col-xs-2')
                .text()
                .trim()
        )
        const brewingProgram = $brew('.label-name:contains("Brewing Program:")')
            .siblings('strong')
            .text()
            .trim()
        const approximateBrewingTime = $brew(
            '.label-name:contains("Approximate Brewing Time:")'
        )
            .siblings('strong')
            .text()
            .trim()
        const brewNotes = $brew('.label-name:contains("Brew Notes:")')
            .siblings('strong')
            .text()
            .trim()
        const { primaryRating, recommended } = await getRating(ratingId)

        const tastesLike = getTastesLike(name)

        const elements = []
        const enhancers = []
        const hops = []
        const dryHops = []
        const yeasts = []
        const primers = []
        const items = $brew(
            '[class*=bb-element-], [class*=bb-enhancer-], [class*=bb-hops-], [class*=bb-dry-hop-], [class*=bb-yeast-], [class*=bb-primer]'
        )
        items.each((index, element) => {
            const classAttr = $brew(element).attr('class')
            let matches = classAttr.match(
                /bb-(element|enhancer|hops|dry-hop|yeast|primer)-(\d+)(?:-(\w+))?/i
            )
            if (!matches && classAttr.includes('bb-primer')) {
                primers.push('P')
            } else if (matches) {
                const type = matches[1].toLowerCase()
                if (type === 'dry-hop') {
                    const number = matches[2]
                    dryHops.push('D' + number)
                } else {
                    const className = matches[3] || matches[2]
                    if (className) {
                        switch (type) {
                            case 'element':
                                elements.push(className.toUpperCase())
                                break
                            case 'enhancer':
                                enhancers.push(className.toUpperCase())
                                break
                            case 'hops':
                                hops.push('H' + className)
                                break
                            case 'yeast':
                                yeasts.push('Y' + className)
                                break
                        }
                    }
                }
            }
        })
        const insideTheBox = {
            cleanses: ['C'], // Droid Cleanse
            yeasts,
            elements,
            enhancers,
            hops,
            dryHops,
            primers,
        }

        const totalPriceOfIngredients = getIngredientsTotalPrice(
            insideTheBox,
            ingredientsList
        )

        function getCountryOfOrigins(insideTheBox) {
            const countries = new Set() // Create a new Set to store unique values
            Object.keys(insideTheBox).forEach((key) => {
                if (key === 'C') return 'Unknown' // Droid Cleanse
                insideTheBox[key].forEach((ingredient) => {
                    const item = ingredientsList.find(
                        (item) => item.id === ingredient
                    )
                    if (item) {
                        countries.add(item.countryOfOrigin) // Add to the Set
                    }
                })
            })
            return Array.from(countries).join(', ') // Convert the Set back to an Array and join into a string
        }
        const countryOfOrigin = getCountryOfOrigins(insideTheBox)

        return {
            url,
            name,
            imageIcon,
            imageBanner,
            shortDescription,
            longDescription,
            primaryRating,
            recommended,
            price,
            totalPriceOfIngredients,
            alcoholByVolume,
            colour,
            bitterness,
            brewingProgram,
            approximateBrewingTime,
            tastesLike,
            brewNotes,
            insideTheBox,
            countryOfOrigin,
        }
    } catch (error) {
        console.error(error)
    }
}

function getIngredientPrice(ingredient, ingredientsList) {
    const item = ingredientsList.find((item) => item.id === ingredient)
    if (item) {
        return item.price
    }
    return null
}

function getIngredientsTotalPrice(ingredients, ingredientsList) {
    let totalPrice = 0
    ingredients.elements.forEach((element) => {
        totalPrice += getIngredientPrice(element, ingredientsList)
    })
    ingredients.enhancers.forEach((enhancer) => {
        totalPrice += getIngredientPrice(enhancer, ingredientsList)
    })
    ingredients.hops.forEach((hop) => {
        totalPrice += getIngredientPrice(hop, ingredientsList)
    })
    ingredients.dryHops.forEach((dryHop) => {
        totalPrice += getIngredientPrice(dryHop, ingredientsList)
    })
    ingredients.yeasts.forEach((yeast) => {
        totalPrice += getIngredientPrice(yeast, ingredientsList)
    })
    ingredients.primers.forEach((primer) => {
        totalPrice += getIngredientPrice(primer, ingredientsList)
    })
    ingredients.cleanses.forEach((cleanse) => {
        totalPrice += getIngredientPrice(cleanse, ingredientsList)
    })
    totalPrice = Math.round(totalPrice * 100) / 100
    return totalPrice
}

export async function getBrewprints() {
    const url = 'https://brewart.com/au/store/brewprints/brewart-inspired'
    try {
        const response = await fetch(url, {
            next: { revalidate: 604800 }, // one week
        })
        if (!response.ok) {
            console.error(
                'Failed to fetch brewprints list, using fallback data'
            )
            return [] // Return empty array as fallback
        }
        const html = await response.text()
        const $ = cheerio.load(html)
        const brewprintUrls = []

        // Extract URLs of each brewprint
        $('.product-item-link').each((i, element) => {
            const brewprintUrl = $(element).attr('href')
            if (brewprintUrl && !brewprintUrl.includes('gift-card')) {
                brewprintUrls.push(brewprintUrl)
            }
        })

        // Extract details from each brewprint with error handling
        const brewprints = await Promise.all(
            brewprintUrls.map(async (url) => {
                try {
                    const data = await getBrewprintIngredients(url)
                    return { data }
                } catch (error) {
                    console.error(
                        `Failed to fetch brewprint data for ${url}:`,
                        error
                    )
                    return { data: null }
                }
            })
        )

        // Filter out failed fetches
        return brewprints.filter((bp) => bp.data !== null)
    } catch (error) {
        console.error('Error in getBrewprints:', error)
        return [] // Return empty array as fallback
    }
}
