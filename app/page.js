import BrewprintsServer from '@/components/BrewprintsServer'
import Recipes from '@/components/Recipes'
import Ingredients from '@/components/Ingredients'
import Link from 'next/link'

export const metadata = {
    title: 'BrewArt BeerDroid Brewprints, Ingredients & Commercial Beer Clones',
    description: 'Fan site for the BrewArt BeerDroid automated brewing system. Browse Brewprints, Commercial Clone Recipes, and Ingredients for home brewing.',
    keywords: [
        'BrewArt',
        'BeerDroid',
        'Brewprints',
        'home brewing',
        'beer recipes',
        'commercial beer clones',
        'brewing ingredients',
        'automated brewing',
        'beer making',
    ],
    authors: [{ name: 'BrewArt Fan Community' }],
    creator: 'BrewArt Fan Community',
    publisher: 'BrewArt Fan Community',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://github.com/Luen/brewart',
        title: 'BrewArt BeerDroid Brewprints, Ingredients & Commercial Beer Clones',
        description: 'Fan site for the BrewArt BeerDroid automated brewing system. Browse Brewprints, Commercial Clone Recipes, and Ingredients for home brewing.',
        siteName: 'BrewArt Brewprints',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BrewArt BeerDroid Brewprints, Ingredients & Commercial Beer Clones',
        description: 'Fan site for the BrewArt BeerDroid automated brewing system. Browse Brewprints, Commercial Clone Recipes, and Ingredients for home brewing.',
    },
    alternates: {
        canonical: 'https://github.com/Luen/brewart',
    },
    category: 'Home Brewing',
}

export default function Home() {
    return (
        <main className="px-6 mx-auto max-w-2xl">
            <h1 className="mt-12 mb-12 text-3xl text-center dark:text-white">
                BeerArt BeerDroid Brewprints, Ingredients, & Commercial Beer
                Clones
            </h1>
            <p className="mb-12 text-base text-center dark:text-white">
                This is a fan site for the BrewArt BeerDroid. It is not
                affiliated with BrewArt. See the{' '}
                <Link
                    href="https://github.com/Luen/brewart"
                    className="underline"
                >
                    GitHub Repo
                </Link>
                . The BrewArt BeerDroid is an automated brewing system that
                allows you to brew beer at home. This site provides a list of
                Brewprints, Commercial Clone Recipes, and Ingredients.
            </p>
            <div className="sticky top-0 bg-black py-2 z-50 text-center">
                <a
                    href="#brewprints"
                    className="mx-2 px-4 py-2 bg-gray-300 text-black rounded-sm hover:bg-gray-400 hover:text-white transition duration-300"
                >
                    Brewprints
                </a>
                <a
                    href="#recipes"
                    className="mx-2 px-4 py-2 bg-gray-300 text-black rounded-sm hover:bg-gray-400 hover:text-white transition duration-300"
                >
                    Recipes
                </a>
                <a
                    href="#ingredients"
                    className="mx-2 px-4 py-2 bg-gray-300 text-black rounded-sm hover:bg-gray-400 hover:text-white transition duration-300"
                >
                    Ingredients
                </a>
            </div>
            <BrewprintsServer />
            <Recipes />
            <Ingredients />
        </main>
    )
}
