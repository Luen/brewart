import { getBrewprints } from '@/lib/brewprints';
import Link from 'next/link';

export default async function Brewprints() {
    let response = await getBrewprints();
    let brewprints = response.map(item => item.data);

    // test
    brewprints = brewprints.filter(item => item.name !== "");

    return (
        <section className="mt-6 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold dark:text-white/90">Brewprints</h2>
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
                            <p className="mt-2 text-base dark:text-white/70">Brew Notes: {item.brewNotes}</p>
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
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
