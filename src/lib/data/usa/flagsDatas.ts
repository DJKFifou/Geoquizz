import usaJsonFlags from '$lib/data/usa/flags.json';

type SvgModule = {
	default: string;
};

interface Flags {
	usaFlags: FlagItem[];
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

const svgs = import.meta.glob('./svgs/flags/*.svg');

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
		const svgPath = `./svgs/flags/${item.answer.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			country: item.answer,
			image: loadedSvgs[svgPath],
			question: 'À quel état appartient ce drapeau ?'
		};
	});
}

export const usaFlags: Flags = {
	usaFlags: await getFlags(usaJsonFlags)
};

export async function getUsaListFlags(category: FlagCategory[]): Promise<FlagCategory[]> {
	return category.map((item: FlagCategory) => {
		const svgPath = `./svgs/flags/${item.country.toLowerCase().replace(/[\s']/g, '')}.svg`;
		return {
			...item,
			image: loadedSvgs[svgPath]
		};
	});
}
