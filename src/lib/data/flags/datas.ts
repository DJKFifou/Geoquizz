import flagsEasy from '$lib/data/flags/easy.json';
import flagsMedium from '$lib/data/flags/medium.json';
import flagsHard from '$lib/data/flags/hard.json';

type SvgModule = {
	default: string;
};

interface Flags {
	easy: FlagItem[];
	medium: FlagItem[];
	hard: FlagItem[];
}

interface FlagItem {
	country: string;
	question: string;
	options: string[];
	answer: string;
	image?: string;
}

interface FlagQuestion {
	options: string[];
	answer: string;
}

interface FlagCategory {
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

async function getFlags(difficulty: FlagQuestion[]) {
	return difficulty.map((item: FlagQuestion) => {
		const svgPath = `./svgs/${item.answer.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			country: item.answer,
			image: loadedSvgs[svgPath],
			question: 'À quel pays appartient ce drapeau ?'
		};
	});
}

export const flags: Flags = {
	easy: await getFlags(flagsEasy),
	medium: await getFlags(flagsMedium),
	hard: await getFlags(flagsHard)
};

export async function getListFlags(category: FlagCategory[]): Promise<FlagCategory[]> {
	return category.map((item: FlagCategory) => {
		const svgPath = `./svgs/${item.country.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			image: loadedSvgs[svgPath]
		};
	});
}
