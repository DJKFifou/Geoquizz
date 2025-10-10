import frenchJsonDepartments from '$lib/data/france/departments.json';
import { cleanString } from '$lib/utils';

type SvgModule = {
	default: string;
};

interface Departments {
	frenchDepartments: DepartmentItem[];
}

interface DepartmentItem {
	departement: string;
	question: string;
	options: string[];
	answer: string;
	image?: string;
}

interface DepartmentQuestion {
	options: string[];
	answer: string;
}

interface DepartmentCategory {
	country: string;
}

const svgs = import.meta.glob('./svgs/departments/*.webp');

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

async function getDepartments(difficulty: DepartmentQuestion[]) {
	return difficulty.map((item: DepartmentQuestion) => {
		const cleanedAnswer = cleanString(item.answer);
		const svgPath = `./svgs/departments/${cleanedAnswer}.webp`;
		return {
			...item,
			departement: item.answer,
			image: loadedSvgs[svgPath],
			question: 'Quel est ce département'
		};
	});
}

export const frenchDepartments: Departments = {
	frenchDepartments: await getDepartments(frenchJsonDepartments)
};

export async function getFrenchListDepartments(
	category: DepartmentCategory[]
): Promise<DepartmentCategory[]> {
	return category.map((item: DepartmentCategory) => {
		const cleanedCountries = cleanString(item.country);
		const svgPath = `./svgs/departments/${cleanedCountries}.webp`;
		return {
			...item,
			image: loadedSvgs[svgPath]
		};
	});
}
