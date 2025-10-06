export function removeAccents(str: string) {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function getListCategories(): Record<string, string> {
	return {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale',
		usaStates: 'États des USA',
		usaFlags: 'Drapeaux des USA'
	};
}

export function getQuizzCategories(): Record<string, string> {
	return {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale',
		usa: 'USA'
	};
}
