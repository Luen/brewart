import BrewprintsServer from "@/components/BrewprintsServer"
import Recipes from "@/components/Recipes"
import Ingredients from "@/components/Ingredients"

export default function Home() {
  return (
    <main className="px-6 mx-auto max-w-2xl">
      <h1 className="mt-12 mb-12 text-3xl text-center dark:text-white">
        BeerArt BeerDroid Brewprints, Ingredients, & Commercial Beer Clones
      </h1>
      <p className="mb-12 text-base text-center dark:text-white">
        This is a fan site for the BrewArt BeerDroid. It is not affiliated with BrewArt.
        The BrewArt BeerDroid is an automated brewing system that allows you to brew beer at home.
        This site provides a list of Brewprints, Commercial Clone Recipes, and Ingredients.
      </p>
      <div className="sticky top-0 bg-black py-2 z-50 text-center">
        <a href="#brewprints" className="mx-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 hover:text-white transition duration-300">Brewprints</a>
        <a href="#recipes" className="mx-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 hover:text-white transition duration-300">Recipes</a>
        <a href="#ingredients" className="mx-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 hover:text-white transition duration-300">Ingredients</a>
      </div>
      <BrewprintsServer />
      <Recipes />
      <Ingredients />
    </main >
  )
}