const svgs = import.meta.glob('./svgs/*.svg');
console.log('svgs', svgs);

const svgPromises = Object.keys(svgs).reduce(
	(acc, key) => {
		acc[key] = svgs[key]();
		return acc;
	},
	{} as Record<string, Promise<any>>
);
console.log('svgPromises', svgPromises);

const svgModules = await Promise.all(Object.values(svgPromises));
console.log('svgModules', svgModules);

const loadedSvgs = Object.keys(svgPromises).reduce(
	(acc, key, index) => {
		acc[key] = svgModules[index].default;
		return acc;
	},
	{} as Record<string, string>
);
console.log('loadedSvgs', loadedSvgs);

export async function getCountries(difficulty: any) {
	return difficulty.map((item: any) => {
		const svgPath = `./svgs/${item.answer.toLowerCase().replace(/[\s']/g, '')}.svg`;
		console.log('svgPath', svgPath);
		return {
			...item,
			image: loadedSvgs[svgPath],
			question: 'À quel pays appartient cette forme ?'
		};
	});
}
