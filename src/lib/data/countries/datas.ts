import countriesEasy from '$lib/data/countries/easy.json';
import countriesMedium from '$lib/data/countries/medium.json';
import countriesHard from '$lib/data/countries/hard.json';

type SvgModule = {
	default: string;
};

interface Countries {
	easy: CountryItem[];
	medium: CountryItem[];
	hard: CountryItem[];
}

interface CountryItem {
	country: string;
	question: string;
	options: string[];
	answer: string;
	image?: string;
}

interface CountryQuestion {
	options: string[];
	answer: string;
}

interface CountryCategory {
	country: string;
}

const svgs = import.meta.glob('./svgs/*.svg');

const svgPromises = Object.keys(svgs).reduce(
	(acc, key) => {
		acc[key] = svgs[key]() as Promise<SvgModule>;
		return acc;
	},
	{} as Record<string, Promise<SvgModule>>
);

const svgModules = await Promise.all(Object.values(svgPromises));

const loadedSvgs = Object.keys(svgPromises).reduce(
	(acc, key, index) => {
		acc[key] = svgModules[index].default;
		return acc;
	},
	{} as Record<string, string>
);

export async function getCountries(difficulty: CountryQuestion[]) {
	return difficulty.map((item: CountryQuestion) => {
		const svgPath = `./svgs/${item.answer.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			country: item.answer,
			image: loadedSvgs[svgPath],
			question: 'À quel pays appartient cette forme ?'
		};
	});
}

export const countries: Countries = {
	easy: await getCountries(countriesEasy),
	medium: await getCountries(countriesMedium),
	hard: await getCountries(countriesHard)
};

export async function getListCountries(categorie: CountryCategory[]) {
	return categorie.map((item: CountryCategory) => {
		const svgPath = `./svgs/${item.country.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			image: loadedSvgs[svgPath]
		};
	});
}
