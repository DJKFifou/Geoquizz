import capitalsEasy from '$lib/data/capitals/easy.json';
import capitalsMedium from '$lib/data/capitals/medium.json';
import capitalsHard from '$lib/data/capitals/hard.json';
import generalKnowledgeEasy from '$lib/data/general_knowledge/easy.json';
import generalKnowledgeMedium from '$lib/data/general_knowledge/medium.json';
import generalKnowledgeHard from '$lib/data/general_knowledge/hard.json';

import { countries } from '$lib/data/countries/datas';
import { flags } from '$lib/data/flags/datas';

type Params = {
	categorie: string;
	difficulty: string;
};

function shuffleData(data: any) {
	const shuffledQuestions = data.map((question: any) => {
		const shuffledOptions = question.options.sort(() => 0.5 - Math.random());
		return { ...question, options: shuffledOptions };
	});

	const shuffledData = shuffledQuestions.sort(() => 0.5 - Math.random());
	const selectedData = shuffledData.slice(0, 20);

	return {
		data: selectedData
	};
}

export const load = async ({ params }: { params: Params }) => {
	const { categorie, difficulty } = params;

	switch (categorie) {
		case 'capitals':
			switch (difficulty) {
				case 'easy':
					return shuffleData(capitalsEasy);
				case 'medium':
					return shuffleData(capitalsMedium);
				case 'hard':
					return shuffleData(capitalsHard);
				default:
					return {
						error: 'Données introuvables',
						status: 404
					};
			}
		case 'countries': {
			return shuffleData(countries[difficulty]);
		}
		case 'flags': {
			return shuffleData(flags[difficulty]);
		}
		case 'general_knowledge':
			switch (difficulty) {
				case 'easy':
					return shuffleData(generalKnowledgeEasy);
				case 'medium':
					return shuffleData(generalKnowledgeMedium);
				case 'hard':
					return shuffleData(generalKnowledgeHard);
				default:
					return {
						error: 'Données introuvables',
						status: 404
					};
			}
		default:
			return {
				error: 'Données introuvables',
				status: 404
			};
	}
};
