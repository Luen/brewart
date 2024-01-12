export default async function Recipes() {
    const recipesClones = require('@/lib/recipesClones.json');

    const brewsArray = Object.entries(recipesClones).map(([name, ingredients]) => ({ name, ingredients }));

    return (
        <section className="mt-6 mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold dark:text-white/90">Clones</h2>
            <div className="grid grid-cols-3 gap-4 mt-6">
                {brewsArray.map((brew, index) => (
                    <div key={index} className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                        <div>
                            <h3 className="text-xl font-bold dark:text-white/90">{brew.name}</h3>
                            <p className="mt-2 text-base dark:text-white/70">Ingredients:<br></br>{brew.ingredients.join(', ')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

}
