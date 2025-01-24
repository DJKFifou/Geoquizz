type Params = {
	categorie: string;
};

type DataItem = {
	country: string;
	capital: string[];
};

export const load = async ({ params }: { params: Params }) => {
	const { categorie } = params;

	try {
		switch (categorie) {
			case 'capitals':
				const capitals = await import('$lib/data/lists/capitals.json');
				return {
					data: capitals.default as DataItem[]
				};
			case 'countries':
				const countries = await import('$lib/data/lists/countries.json');
				return {
					data: countries.default as DataItem[]
				};
			case 'flags':
				const flags = await import('$lib/data/lists/flags.json');
				return {
					data: flags.default as DataItem[]
				};
			default:
				return {
					error: 'Données introuvables',
					status: 404
				};
		}
	} catch (error) {
		console.error("Erreur lors de l'importation :", error);
		return {
			error: 'Erreur interne',
			status: 500
		};
	}
};
