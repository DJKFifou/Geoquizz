import { readFile, writeFile } from 'fs/promises';

export async function readJSON(path: string) {
	const s = await readFile(path + '.json');

	return JSON.parse(s.toString());
}

export function writeJSON(path: string, data: unknown) {
	return writeFile(path + '.json', JSON.stringify(data));
}
