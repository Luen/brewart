import BrewprintsServer from "@/components/BrewprintsServer"
import Recipes from "@/components/Recipes"
import Ingredients from "@/components/Ingredients"

export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <h1 className="mt-12 mb-12 text-3xl text-center dark:text-white">
        BeerArt BeerDroid Brewprints, Ingredients, & Clones
      </h1>
      <BrewprintsServer />
      <Recipes />
      <Ingredients />
    </main >
  )
}