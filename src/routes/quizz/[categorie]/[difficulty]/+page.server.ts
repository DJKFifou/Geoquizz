import fs from 'node:fs/promises';

type Params = {
	categorie: string;
	difficulty: string;
};

export const load = async ({ params }: { params: Params }) => {
	const { categorie, difficulty } = params;
	const filePath = `src/lib/data/${categorie}/${difficulty}.json`;

	try {
		const data = await fs.readFile(filePath, 'utf-8');
		const parsedData = JSON.parse(data);

		const shuffledData = parsedData
			.map((question: any) => {
				const shuffledOptions = question.options.sort(() => 0.5 - Math.random());
				return { ...question, options: shuffledOptions };
			})
			.sort(() => 0.5 - Math.random());

		const selectedData = shuffledData.slice(0, 20);

		return {
			data: selectedData
		};
	} catch (err) {
		console.error(err);

		return {
			error: 'Données introuvables',
			status: 404
		};
	}
};
