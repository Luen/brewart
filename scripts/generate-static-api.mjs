import { mkdirSync, writeFileSync } from 'node:fs'
import { getBrewprints } from '../lib/brewprints.js'
import { getIngredients } from '../lib/ingredients.js'
import recipes from '../lib/recipesClones.json' with { type: 'json' }

const outputDir = new URL('../public/api/', import.meta.url)

mkdirSync(outputDir, { recursive: true })

const [brewprints, ingredients] = await Promise.all([
    getBrewprints(),
    getIngredients(),
])

writeFileSync(
    new URL('brewprints.json', outputDir),
    JSON.stringify(brewprints, null, 2)
)
writeFileSync(
    new URL('ingredients.json', outputDir),
    JSON.stringify(ingredients, null, 2)
)
writeFileSync(
    new URL('recipes.json', outputDir),
    JSON.stringify(recipes, null, 2)
)

console.log('Generated static API JSON in public/api/')
