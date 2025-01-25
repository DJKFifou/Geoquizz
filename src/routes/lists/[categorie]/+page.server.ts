import { getListCountries } from '$lib/data/countries/datas';
import { getListFlags } from '$lib/data/flags/datas';

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
				const enrichedCountries = await getListCountries(countries.default);
				return {
					data: enrichedCountries
				};
			case 'flags':
				const flags = await import('$lib/data/lists/flags.json');
				const enrichedFlags = await getListFlags(flags.default);
				return {
					data: enrichedFlags
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
