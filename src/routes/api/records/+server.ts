import { readJSON, writeJSON } from '$lib/server/io';

interface Record {
	categorie: string;
	difficulty: string;
	currentRecord: number;
}

export const GET = async ({ url }: { url: URL }): Promise<Response> => {
	const categorie: string | null = url.searchParams.get('categorie');
	const difficulty: string | null = url.searchParams.get('difficulty');

	const filePath: string = 'src/lib/data/records';
	const data = await readJSON(filePath);

	const record: Record[] = data.records.filter((record: Record) => {
		return (
			(!categorie || record.categorie === categorie) &&
			(difficulty !== null ? record.difficulty === difficulty : !record.difficulty)
		);
	});

	return new Response(JSON.stringify({ data, record }), { status: 200 });
};

export const POST = async ({ request }: { request: Request }): Promise<Response> => {
	try {
		const {
			categorieName,
			difficultyName,
			currentRecord
		}: { categorieName: string; difficultyName?: string; currentRecord: number } =
			await request.json();

		const filePath: string = 'src/lib/data/records';
		const data = await readJSON(filePath);

		const existingRecord: Record | undefined = data.records.find(
			(record: Record) =>
				record.categorie === categorieName &&
				(difficultyName ? record.difficulty === difficultyName : !record.difficulty)
		);

		if (existingRecord) {
			if (Number(currentRecord) > Number(existingRecord.currentRecord)) {
				existingRecord.currentRecord = currentRecord;
				writeJSON(filePath, data);
			}
			return new Response(JSON.stringify({ record: existingRecord }), {
				status: 200
			});
		} else {
			const record = difficultyName
				? { categorie: categorieName, difficulty: difficultyName, currentRecord }
				: { categorie: categorieName, currentRecord };

			data.records.push(record);
			writeJSON(filePath, data);

			return new Response(JSON.stringify({ record }), {
				status: 201
			});
		}
	} catch (error) {
		console.error('Error while saving record: ', error);
		return new Response(JSON.stringify({ message: 'Error while saving the record' }), {
			status: 500
		});
	}
};
