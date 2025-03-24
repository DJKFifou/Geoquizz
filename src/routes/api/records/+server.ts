import { readJSON, writeJSON } from '$lib/server/io';

interface Record {
	categorie: string;
	difficulty: string;
	currentRecord: number;
}

interface DataStructure {
	records: Record[];
}

export const GET = async ({ url }: { url: URL }): Promise<Response> => {
	console.log('GET');
	const categorie: string | null = url.searchParams.get('categorie');
	const difficulty: string | null = url.searchParams.get('difficulty');

	const res: Response = await fetch(`http://localhost:5173/src/data/records.json`);
	const data: DataStructure = await res.json();
	const filteredData: Record[] = data.records.filter((record: Record) => {
		return (
			(!categorie || record.categorie === categorie) &&
			(!difficulty || record.difficulty === difficulty)
		);
	});

	console.log('filteredData : ', filteredData);

	return new Response(JSON.stringify({ records: filteredData }), { status: 200 });
};

export const POST = async ({ request }: { request: Request }): Promise<Response> => {
	console.log('POST');
	try {
		const {
			categorieName,
			difficultyName,
			currentRecord
		}: { categorieName: string; difficultyName: string; currentRecord: number } =
			await request.json();

		const filePath: string = 'src/data/records';
		const data = await readJSON(filePath);

		const existingRecord: Record | undefined = data.records.find(
			(record: Record) => record.categorie === categorieName && record.difficulty === difficultyName
		);

		if (existingRecord) {
			if (Number(currentRecord) > Number(existingRecord.currentRecord)) {
				existingRecord.currentRecord = currentRecord;

				writeJSON(filePath, data);

				console.log('Record updated successfully');
				return new Response(JSON.stringify({ data, message: 'Record updated successfully' }), {
					status: 200
				});
			} else {
				console.log('New record is not higher');
				return new Response(JSON.stringify({ data, message: 'New record is not higher' }), {
					status: 200
				});
			}
		} else {
			data.records.push({
				categorie: categorieName,
				difficulty: difficultyName,
				currentRecord
			});

			writeJSON(filePath, data);
			console.log('Record created successfully');
			return new Response(JSON.stringify({ data, message: 'Record created successfully' }), {
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
