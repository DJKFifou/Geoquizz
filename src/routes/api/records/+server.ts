import { promises as fs } from 'fs';
import path from 'path';

export const GET = async ({ url }) => {
	console.log('GET');
	const categorie = url.searchParams.get('categorie');
	const difficulty = url.searchParams.get('difficulty');

	const res = await fetch(`http://localhost:5173/src/data/records.json`);
	const data = await res.json();
	const filteredData = data.records.filter((record) => {
		return (
			(!categorie || record.categorie === categorie) &&
			(!difficulty || record.difficulty === difficulty)
		);
	});

	console.log('filteredData : ', filteredData);

	return new Response(JSON.stringify({ records: filteredData }), { status: 200 });
};

export const POST = async ({ request }) => {
	console.log('POST');
	try {
		const { categorieName, difficultyName, currentRecord } = await request.json();

		const filePath = path.resolve('src/data/records.json');
		const fileData = await fs.readFile(filePath, 'utf-8');
		const data = JSON.parse(fileData);

		const existingRecord = data.records.find(
			(record) => record.categorie === categorieName && record.difficulty === difficultyName
		);

		if (existingRecord) {
			if (Number(currentRecord) > Number(existingRecord.currentRecord)) {
				existingRecord.currentRecord = currentRecord;

				await fs.writeFile(filePath, JSON.stringify(data, null, 2));

				console.log('Record updated successfully');
				return new Response(
					JSON.stringify({ data: data, message: 'Record updated successfully' }),
					{
						status: 200
					}
				);
			} else {
				console.log('New record is not higher');
				return new Response(JSON.stringify({ data: data, message: 'New record is not higher' }), {
					status: 400
				});
			}
		} else {
			data.records.push({
				categorie: categorieName,
				difficulty: difficultyName,
				currentRecord
			});

			await fs.writeFile(filePath, JSON.stringify(data, null, 2));
			console.log('Record created successfully');
			return new Response(JSON.stringify({ data: data, message: 'Record created successfully' }), {
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
