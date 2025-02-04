import flagsEasy from '$lib/data/flags/easy.json';
import flagsMedium from '$lib/data/flags/medium.json';
import flagsHard from '$lib/data/flags/hard.json';

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

async function getFlags(difficulty: any) {
	return difficulty.map((item: any) => {
		const svgPath = `./svgs/${item.answer.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			image: loadedSvgs[svgPath],
			question: 'À quel pays appartient ce drapeau ?'
		};
	});
}

export const flags: any = {
    easy : await getFlags(flagsEasy),
    medium :await getFlags(flagsMedium),
    hard :await getFlags(flagsHard),
}

export async function getListFlags(categorie: any) {
	return categorie.map((item: any) => {
		const svgPath = `./svgs/${item.country.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			image: loadedSvgs[svgPath]
		};
	});
}
