import { getIngredients } from '@/lib/ingredients';
import Link from 'next/link';

export default async function Recipes() {
    const recipesClones = require('@/lib/recipesClones.json');

    // Get prices of ingredients
    let response = await getIngredients();
    let ingredientsAll = response;

    // Function to calculate price for a brew
    const calculatePrice = (ingredients) => {
        if (!Array.isArray(ingredients)) {
            console.error('Ingredients is not an array:', ingredients);
            return 0;
        }
    
        const total = ingredients.map(ingredient => {
            const ingredientData = ingredientsAll.find(({ id }) => id === ingredient);
            return ingredientData ? ingredientData.price : 0;
        }).reduce((total, price) => total + price, 0);
    
        return total.toFixed(2); // Format to 2 decimal places
    };
    

    return (
        <section id="recipes" className="mt-6 mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold dark:text-white/90">Commercial Clones</h2>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {Object.entries(recipesClones).map(([name, brew], index) => (
                    <div key={index} className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                        {brew.link && (
                            <Link href={brew.link}>
                                <h3 className="text-xl font-bold dark:text-white/90">{name}</h3>
                            </Link>
                        )}
                        {!brew.link && (
                            <h3 className="text-xl font-bold dark:text-white/90">{name}</h3>
                        )}
                        <p className="text-base dark:text-white/70">{brew.description}</p>
                        <p className="mt-2 text-base dark:text-white/70">Ingredients:<br/>{brew.ingredients.join(', ')}</p>
                        {(brew.brewingProgram) && <p className="mt-2 text-base dark:text-white/70">Notes:<br/>{brew.brewingProgram}</p>}
                        {(brew.instructions) && <p className="mt-2 text-base dark:text-white/70">Instructions:<br/>{brew.instructions}</p>}
                        <p className="text-xl font-bold dark:text-white/90">Cost: ${calculatePrice(brew.ingredients)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}