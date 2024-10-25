'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BrewprintsClient({ initialBrewprints = [] }) {
    const [brewprints, setBrewprints] = useState(initialBrewprints)
    const [isAlphabeticalAsc, setIsAlphabeticalAsc] = useState(true)
    const [isPriceAsc, setIsPriceAsc] = useState(true)
    const [isAlcoholVolumeAsc, setIsAlcoholVolumeAsc] = useState(true)
    const [isBitternessAsc, setIsBitternessAsc] = useState(true)
    const [isColourAsc, setIsColourAsc] = useState(true)
    const [isBrewingTimeAsc, setIsBrewingTimeAsc] = useState(true)

    const sortAlphabetically = () => {
        const sorted = [...brewprints].sort((a, b) => {
            if (isAlphabeticalAsc) {
                return a.name.localeCompare(b.name)
            } else {
                return b.name.localeCompare(a.name)
            }
        })
        setBrewprints(sorted)
        setIsAlphabeticalAsc(!isAlphabeticalAsc)
    }

    const sortByPrice = () => {
        const sorted = [...brewprints].sort((a, b) => {
            if (isPriceAsc) {
                return a.price - b.price
            } else {
                return b.price - a.price
            }
        })
        setBrewprints(sorted)
        setIsPriceAsc(!isPriceAsc)
    }

    const sortByAlcoholVolume = () => {
        const sorted = [...brewprints].sort((a, b) => {
            const volA = parseFloat(a.alcoholByVolume)
            const volB = parseFloat(b.alcoholByVolume)
            return isAlcoholVolumeAsc ? volA - volB : volB - volA
        })
        setBrewprints(sorted)
        setIsAlcoholVolumeAsc(!isAlcoholVolumeAsc)
    }

    const sortByBitterness = () => {
        const sorted = [...brewprints].sort((a, b) => {
            const bitterA = parseFloat(a.bitterness)
            const bitterB = parseFloat(b.bitterness)
            return isBitternessAsc ? bitterA - bitterB : bitterB - bitterA
        })
        setBrewprints(sorted)
        setIsBitternessAsc(!isBitternessAsc)
    }

    const sortByColour = () => {
        const sorted = [...brewprints].sort((a, b) => {
            const colourA = parseFloat(a.colour)
            const colourB = parseFloat(b.colour)
            return isColourAsc ? colourA - colourB : colourB - colourA
        })
        setBrewprints(sorted)
        setIsColourAsc(!isColourAsc)
    }

    const sortByBrewingTime = () => {
        const sorted = [...brewprints].sort((a, b) => {
            const timeAMin = parseFloat(a.approximateBrewingTime.split('-')[0])
            const timeAMax = parseFloat(
                a.approximateBrewingTime.split('0')[0].split('-').pop()
            )
            const timeBMin = parseFloat(b.approximateBrewingTime.split('-')[0])
            const timeBMax = parseFloat(
                b.approximateBrewingTime.split('0')[0].split('-').pop()
            )
            const timeA = (timeAMin + timeAMax) / 2
            const timeB = (timeBMin + timeBMax) / 2
            return isBrewingTimeAsc ? timeA - timeB : timeB - timeA
        })
        setBrewprints(sorted)
        setIsBrewingTimeAsc(!isBrewingTimeAsc)
    }

    return (
        <section id="brewprints" className="mt-6 mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold dark:text-white/90">
                Brewprints
            </h2>
            <div className="flex justify-center gap-4 my-4">
                <button
                    onClick={sortAlphabetically}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                    {isAlphabeticalAsc
                        ? 'Sort Alphabetically (Asc)'
                        : 'Sort Alphabetically (Desc)'}
                </button>
                <button
                    onClick={sortByPrice}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                    {isPriceAsc
                        ? 'Sort by Price (Asc)'
                        : 'Sort by Price (Desc)'}
                </button>
                <button
                    onClick={sortByAlcoholVolume}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                    {isAlcoholVolumeAsc
                        ? 'Sort by Alcohol Volume (Asc)'
                        : 'Sort by Alcohol Volume (Desc)'}
                </button>
                <button
                    onClick={sortByBitterness}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                    {isBitternessAsc
                        ? 'Sort by Bitterness (Asc)'
                        : 'Sort by Bitterness (Desc)'}
                </button>
                <button
                    onClick={sortByColour}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                    {isColourAsc
                        ? 'Sort by Colour (Asc)'
                        : 'Sort by Colour (Desc)'}
                </button>
                <button
                    onClick={sortByBrewingTime}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                    {isBrewingTimeAsc
                        ? 'Sort by Avg Brewing Time (Asc)'
                        : 'Sort by Avg Brewing Time (Desc)'}
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {brewprints.map((item, index) => (
                    <div
                        key={item.url || index}
                        className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800"
                    >
                        <div>
                            <Link href={item.url}>
                                <h3 className="text-xl font-bold dark:text-white/90">
                                    {item.name}
                                </h3>
                                <p className="mt-2 text-base dark:text-white/70">
                                    {item.shortDescription}
                                </p>
                                <img
                                    src={item.imageBanner}
                                    alt={item.name}
                                    className="w-full h-auto mt-2"
                                />
                                <p className="mt-2 text-base dark:text-white/70">
                                    {item.longDescription
                                        .replace(
                                            'PLEASE NOTE: This BrewPrint contains Dry Hops! The Dry Hop Filter is required to filter out hop debris.',
                                            ''
                                        )
                                        .replace(
                                            '** For a Limited Time only the Australian Lager BrewPrint comes with a BONUS Christmas gift wrap, so you can wrap Christmas up early!&nbsp; See T&amp;Cs for full details. **',
                                            ''
                                        )
                                        .replace(/  /g, ' ')
                                        .replace(/\.\./g, '.')
                                        .trim()}
                                </p>
                            </Link>
                            {item.primaryRating != 0 &&
                                item.recommended != 0 && (
                                    <p className="mt-2 text-base dark:text-white/70">
                                        Average Rating:{' '}
                                        {item.primaryRating.toFixed(1)}/5 stars
                                        <br></br>
                                        Recommended by {item.recommended}{' '}
                                        {item.recommended == 1
                                            ? 'person'
                                            : 'people'}
                                    </p>
                                )}
                            <p className="mt-2 text-base dark:text-white/70">
                                Alcohol by Volume: {item.alcoholByVolume}%
                                <br></br>Colour: {item.colour}
                                <br></br>Bitterness: {item.bitterness}
                            </p>
                            <p className="mt-2 text-base dark:text-white/70">
                                Brewing Program:{' '}
                                {item.brewingProgram.includes('Custom') ||
                                (item.brewingProgram !== 'Ale' &&
                                    item.brewingProgram !== 'Lager')
                                    ? 'Custom'
                                    : item.brewingProgram}
                                <br></br>Approximate Brewing Time:{' '}
                                {item.approximateBrewingTime}
                            </p>
                            {/* <p className="mt-2 text-base dark:text-white/70">Brew Notes: {item.brewNotes}</p> */}
                            {item.tastesLike && (
                                <p className="mt-2 text-base dark:text-white/70">
                                    Tastes Like: {item.tastesLike}
                                </p>
                            )}
                            <p className="mt-2 text-base dark:text-white/70">
                                Inside The Box:<br></br>
                                {
                                    [
                                        'cleanses',
                                        'yeasts',
                                        'elements',
                                        'enhancers',
                                        'hops',
                                        'dryHops',
                                        'primers',
                                    ]
                                        .map((key) => item.insideTheBox[key]) // Get the array from each key
                                        .filter(
                                            (arr) =>
                                                Array.isArray(arr) && arr.length
                                        ) // Ensure it's an array and has length
                                        .map((arr) => arr.join(', ')) // Join each array's elements into a string
                                        .join(', ') // Join all strings into one, separated by commas
                                }
                            </p>
                            <p className="mt-2 text-base dark:text-white/70">
                                Country of Origin(s): {item.countryOfOrigin}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-xl font-bold dark:text-white/90">
                                Brewprint: ${item.price}
                                <br></br>Ingredients: $
                                {item.totalPriceOfIngredients}
                                <br></br>
                                <span className="mt-2 text-sm dark:text-white/70">
                                    {item.price > item.totalPriceOfIngredients
                                        ? 'Cheaper buying ingredients individually'
                                        : 'Cheaper buying Brewprint'}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
