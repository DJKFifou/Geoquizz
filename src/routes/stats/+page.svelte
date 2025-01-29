<script lang="ts">
	let localStorageQuizzItems: Record<string, string> = {
		easycapitalsRecord: 'Capitales - Facile',
		mediumcapitalsRecord: 'Capitales - Moyen',
		hardcapitalsRecord: 'Capitales - Difficile',
		easycountriesRecord: 'Pays - Facile',
		mediumcountriesRecord: 'Pays - Moyen',
		hardcountriesRecord: 'Pays - Difficile',
		easyflagsRecord: 'Drapeaux - Facile',
		mediumflagsRecord: 'Drapeaux - Moyen',
		hardflagsRecord: 'Drapeaux - Difficile',
		easygeneral_knowledgeRecord: 'Culture générale - Facile',
		mediumgeneral_knowledgeRecord: 'Culture générale - Moyen',
		hardgeneral_knowledgeRecord: 'Culture générale - Difficile'
	};

	let localStorageListsItems: Record<string, string> = {
		capitalsRecord: 'Capitales',
		countriesRecord: 'Pays',
		flagsRecord: 'Drapeaux'
	};

	let quizzRecords: Record<string, string> = {};
	let listsRecords: Record<string, string> = {};

	if (typeof window !== 'undefined') {
		for (const key of Object.keys(localStorageQuizzItems)) {
			quizzRecords[key] = localStorage.getItem(key)
				? `${localStorage.getItem(key)} / 20`
				: 'Pas encore établi';
		}

		for (const key of Object.keys(localStorageListsItems)) {
			for (const key of Object.keys(localStorageListsItems)) {
				const record = localStorage.getItem(key);
				listsRecords[key] = record
					? `${record} / ${key === 'countriesRecord' ? 190 : 195}`
					: 'Pas encore établi';
			}
		}
	}
</script>

<div
	class="container mx-auto flex h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
	<div
		class="absolute left-1/2 top-4 flex -translate-x-1/2 flex-col items-center justify-center gap-4"
	>
		<h1 class="text-3xl font-medium">Statistiques :</h1>
	</div>
	<div class="flex flex-col items-center gap-12">
		<h2 class="text-xl font-bold">Records :</h2>
		<div class="grid grid-cols-2 gap-12">
			<div class="flex flex-col items-center gap-4">
				<h3 class="text-lg font-bold">Quizz :</h3>
				<div class="flex flex-col items-center gap-4">
					{#each Object.keys(localStorageQuizzItems) as key}
						<div class="flex gap-2">
							<p>{localStorageQuizzItems[key]} :</p>
							<p>{quizzRecords[key] || 'Loading'}</p>
						</div>
					{/each}
				</div>
			</div>
			<div class="flex flex-col items-center gap-4">
				<h3 class="text-lg font-bold">Listes :</h3>
				<div class="flex flex-col items-center gap-4">
					{#each Object.keys(localStorageListsItems) as key}
						<div class="flex gap-2">
							<p>{localStorageListsItems[key]} :</p>
							<p>{listsRecords[key] || 'Loading'}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
