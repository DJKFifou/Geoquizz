import usaJsonStates from '$lib/data/usa/states.json';
import { removeAccents } from '$lib/utils';

type SvgModule = {
	default: string;
};

interface States {
	usaStates: StateItem[];
}

interface StateItem {
	country: string;
	question: string;
	options: string[];
	answer: string;
	image?: string;
}

interface StateQuestion {
	options: string[];
	answer: string;
}

interface StateCategory {
	country: string;
}

const svgs = import.meta.glob('./svgs/states/*.webp');

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

async function getStates(difficulty: StateQuestion[]) {
	return difficulty.map((item: StateQuestion) => {
		const cleanedAnswer = removeAccents(item.answer);
		const svgPath = `./svgs/states/${cleanedAnswer.toLowerCase().replace(/[\s']/g, '')}.webp`;
		return {
			...item,
			country: item.answer,
			image: loadedSvgs[svgPath],
			question: 'À quel état appartient cette forme ?'
		};
	});
}

export const usaStates: States = {
	usaStates: await getStates(usaJsonStates)
};

export async function getUsaListStates(category: StateCategory[]): Promise<StateCategory[]> {
	return category.map((item: StateCategory) => {
		const cleanedCountry = removeAccents(item.country);
		const svgPath = `./svgs/states/${cleanedCountry.toLowerCase().replace(/[\s']/g, '')}.webp`;
		return {
			...item,
			image: loadedSvgs[svgPath]
		};
	});
}
