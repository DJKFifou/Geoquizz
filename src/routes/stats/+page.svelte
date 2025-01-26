<script lang="ts">
	let localStorageItems: Record<string, string> = {
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

	let records: Record<string, string> = {};

	if (typeof window !== 'undefined') {
		for (const key of Object.keys(localStorageItems)) {
			records[key] = localStorage.getItem(key)
				? `${localStorage.getItem(key)} / 20`
				: 'Pas encore établi';
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
		<h3 class="text-lg font-bold">Record - quizz :</h3>
		<div class="flex flex-col items-center gap-4">
			{#each Object.keys(localStorageItems) as key}
				<div class="flex gap-2">
					<p>{localStorageItems[key]} :</p>
					<p>{records[key] || 'Loading'}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
