import { getListCountries } from '$lib/data/countries/datas';
import { getListFlags } from '$lib/data/flags/datas';
import { getUsaListFlags } from '$lib/data/usa/flagsDatas';
import { getUsaListStates } from '$lib/data/usa/statesDatas';
import type { PageServerLoad } from './$types';

type DataItem = {
	country: string;
	capital: string[];
};

function shuffleData<T>(data: T[]): T[] {
	for (let i = data.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[data[i], data[j]] = [data[j], data[i]];
	}
	return data;
}

export const load: PageServerLoad = async ({ params }) => {
	const { categorie } = params;

	try {
		switch (categorie) {
			case 'capitals': {
				const capitals = await import('$lib/data/lists/capitals.json');
				return {
					data: capitals.default as DataItem[]
				};
			}
			case 'countries': {
				const countries = await import('$lib/data/lists/countries.json');
				const enrichedCountries = await getListCountries(countries.default);
				return {
					data: shuffleData(enrichedCountries)
				};
			}
			case 'flags': {
				const flags = await import('$lib/data/lists/flags.json');
				const enrichedFlags = await getListFlags(flags.default);
				return {
					data: shuffleData(enrichedFlags)
				};
			}
			case 'usaFlags': {
				const usaFlags = await import('$lib/data/lists/usaFlags.json');
				const enrichedFlags = await getUsaListFlags(usaFlags.default);
				return {
					data: shuffleData(enrichedFlags)
				};
			}
			case 'usaStates': {
				const usaStates = await import('$lib/data/lists/usaStates.json');
				console.log('usaStates : ', usaStates);
				const enrichedStates = await getUsaListStates(usaStates.default);
				console.log('enrichedStates : ', enrichedStates);
				return {
					data: shuffleData(enrichedStates)
				};
			}
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
