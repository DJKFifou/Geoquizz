import countriesEasy from '$lib/data/countries/easy.json';
import countriesMedium from '$lib/data/countries/medium.json';
import countriesHard from '$lib/data/countries/hard.json';

const svgs = import.meta.glob('./svgs/*.svg');

const svgPromises = Object.keys(svgs).reduce(
	(acc, key) => {
		acc[key] = svgs[key]();
		return acc;
	},
	{} as Record<string, Promise<any>>
);

const svgModules = await Promise.all(Object.values(svgPromises));

const loadedSvgs = Object.keys(svgPromises).reduce(
	(acc, key, index) => {
		acc[key] = svgModules[index].default;
		return acc;
	},
	{} as Record<string, string>
);

export async function getCountries(difficulty: any) {
	return difficulty.map((item: any) => {
		const svgPath = `./svgs/${item.answer.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			image: loadedSvgs[svgPath],
			question: 'À quel pays appartient cette forme ?'
		};
	});
}

export const countries: any = {
    easy : await getCountries(countriesEasy),
    medium :await getCountries(countriesMedium),
    hard :await getCountries(countriesHard),
}

export async function getListCountries(categorie: any) {
	return categorie.map((item: any) => {
		const svgPath = `./svgs/${item.country.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			image: loadedSvgs[svgPath]
		};
	});
}
