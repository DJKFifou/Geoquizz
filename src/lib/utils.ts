export function cleanString(str: string): string {
	return str
		.normalize('NFD')
		.replace(/[\s'"]/g, '')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

export function cleanStringWithoutDash(str: string): string {
	return str
		.normalize('NFD')
		.replace(/-/g, ' ')
		.replace(/[\s'"]/g, '')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

export function getListCategories(): Record<string, string> {
	return {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale',
		usaCapitals: 'Capitales des USA',
		usaStates: 'États des USA',
		usaFlags: 'Drapeaux des USA',
		frenchCountyTowns: 'Chefs-lieux français',
		frenchDepartments: 'Départements français'
	};
}

export function getQuizzCategories(): Record<string, string> {
	return {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale',
		usa: 'USA',
		france: 'France'
	};
}
