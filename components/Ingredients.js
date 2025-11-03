import { getIngredients } from '@/lib/ingredients'
import Link from 'next/link'
import Image from 'next/image'

export default async function Ingredients() {
    let response = await getIngredients()

    let ingredients = response

    // remove items with blank name for testing
    ingredients = ingredients.filter((item) => item.name !== '')

    return (
        <section id="ingredients" className="mt-6 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold dark:text-white/90">
                Ingredients
            </h2>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {ingredients.map((item, index) => (
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
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-auto mt-2"
                                    unoptimized
                                />
                            </Link>
                            <p className="mt-2 text-base dark:text-white/70">
                                {item.longDescription}
                            </p>
                            <p className="mt-2 text-base dark:text-white/70">
                                Country of Origin:{' '}
                                {item.countryOfOrigin || 'Unknown'}
                            </p>
                            {item.info && Object.keys(item.info).length > 0 && (
                                <>
                                    <div className="mt-2 text-base dark:text-white/70">
                                        <ul>
                                            {Object.keys(item.info).map(
                                                (key) => (
                                                    <li key={key}>
                                                        {key}: {item.info[key]}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-xl font-bold dark:text-white/90">
                                ${item.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
