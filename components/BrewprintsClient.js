'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BrewprintsClient({ initialBrewprints = [] }) {
    const [brewprints, setBrewprints] = useState(initialBrewprints);
    const [isAlphabeticalAsc, setIsAlphabeticalAsc] = useState(true);
    const [isPriceAsc, setIsPriceAsc] = useState(true);
    const [isAlcoholVolumeAsc, setIsAlcoholVolumeAsc] = useState(true);

    const sortAlphabetically = () => {
        const sorted = [...brewprints].sort((a, b) => {
            if (isAlphabeticalAsc) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        setBrewprints(sorted);
        setIsAlphabeticalAsc(!isAlphabeticalAsc); // Toggle the sort order for next click
    };
    
    const sortByPrice = () => {
        const sorted = [...brewprints].sort((a, b) => {
            if (isPriceAsc) {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
        setBrewprints(sorted);
        setIsPriceAsc(!isPriceAsc); // Toggle the sort order for next click
    };    

    const sortByAlcoholVolume = () => {
        const sorted = [...brewprints].sort((a, b) => {
            const volA = parseFloat(a.alcoholByVolume);
            const volB = parseFloat(b.alcoholByVolume);
            return isAlcoholVolumeAsc ? volA - volB : volB - volA;
        });
        setBrewprints(sorted);
        setIsAlcoholVolumeAsc(!isAlcoholVolumeAsc); // Toggle the sort order for next click
    };

    return (
        <section className="mt-6 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold dark:text-white/90">Brewprints</h2>
            <div className="flex justify-center gap-4 my-4">
                <button onClick={sortAlphabetically} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
                    {isAlphabeticalAsc ? 'Sort Alphabetically (Asc)' : 'Sort Alphabetically (Desc)'}
                </button>
                <button onClick={sortByPrice} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
                    {isPriceAsc ? 'Sort by Price (Asc)' : 'Sort by Price (Desc)'}
                </button>
                <button onClick={sortByAlcoholVolume} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
                    {isAlcoholVolumeAsc ? 'Sort by Alcohol Volume (Asc)' : 'Sort by Alcohol Volume (Desc)'}
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {brewprints.map((item, index) => (
                    <div key={item.url || index} className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                        <div>
                            <Link href={item.url}>
                                <h3 className="text-xl font-bold dark:text-white/90">{item.name}</h3>
                                <p className="mt-2 text-base dark:text-white/70">{item.shortDescription}</p>
                                <img src={item.imageBanner} alt={item.name} className="w-full h-auto mt-2" />
                                <p className="mt-2 text-base dark:text-white/70">{item.longDescription.replace("PLEASE NOTE: This BrewPrint contains Dry Hops! The Dry Hop Filter is required to filter out hop debris.","").replace("** For a Limited Time only the Australian Lager BrewPrint comes with a BONUS Christmas gift wrap, so you can wrap Christmas up early! Pouring clean and clear with a bright golden hue, this refreshing brew brims with aromas of stone fruit and citrus. A dash of late hopping adds subtle tropical notes, perfect for sunny days and barbecues. Slow fermentation using traditional lager yeast brings delicate floral notes to the palate as the warm Aussie sun sinks below the horizon.&nbsp; See T&amp;Cs for full details. **","").replace("  "," ").replace("..",".").trim()}</p>
                            </Link>
                            <p className="mt-2 text-base dark:text-white/70">Alcohol by Volume: {item.alcoholByVolume}</p>
                            <p className="mt-2 text-base dark:text-white/70">Colour: {item.colour}</p>
                            <p className="mt-2 text-base dark:text-white/70">Bitterness: {item.bitterness}</p>
                            <p className="mt-2 text-base dark:text-white/70">Brewing Program: {item.brewingProgram}</p>
                            <p className="mt-2 text-base dark:text-white/70">Approximate Brewing Time: {item.approximateBrewingTime}</p>
                            {/* <p className="mt-2 text-base dark:text-white/70">Brew Notes: {item.brewNotes}</p> */}
                            <p className="mt-2 text-base dark:text-white/70">
                                Inside The Box: {
                                    [item.insideTheBox.elements, item.insideTheBox.enhancers, item.insideTheBox.hops, item.insideTheBox.yeasts, item.insideTheBox.primers]
                                        .filter(arr => arr.length)
                                        .map(arr => arr.join(", "))
                                        .join(", ")
                                }
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-xl font-bold dark:text-white/90">Brewprint: ${item.price}</p>
                            <p className="mt-2 text-base dark:text-white/70">Ingredients: ${item.totalPriceOfIngredients}</p>
                            <p className="mt-2 text-sm dark:text-white/70">{item.price > item.totalPriceOfIngredients ? "Cheaper buying ingredients individually" : "Cheaper buying Brewprint"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
