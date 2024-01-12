import { getIngredients } from '@/lib/ingredients'
import Link from 'next/link'

export default async function Ingredients() {
    let response = await getIngredients();

    // Assuming getIngredients returns an object with a 'products' key that contains an array of ingredients
    let ingredients = response;

    // remove items with blank name for testing
    ingredients = ingredients.filter(item => item.name !== "");

    return (
        <section className="mt-6 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold dark:text-white/90">Ingredients</h2>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {ingredients.map((item, index) => (
                    <div key={item.url || index} className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                        <div>
                            <Link href={item.url}>
                                <h3 className="text-xl font-bold dark:text-white/90">{item.name}</h3>
                                <p className="mt-2 text-base dark:text-white/70">{item.shortDescription}</p>
                                <img src={item.image} alt={item.name} className="w-full h-auto mt-2" />
                            </Link>
                            <p className="mt-2 text-base dark:text-white/70">{item.longDescription}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-xl font-bold dark:text-white/90">${item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
