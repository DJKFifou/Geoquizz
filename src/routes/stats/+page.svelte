<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_USE_API } from '$env/static/public';

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
		hardgeneral_knowledgeRecord: 'Culture générale - Difficile',
		capitalsusaRecord: 'USA - Capitales',
		flagsusaRecord: 'USA - Drapeaux',
		statesusaRecord: 'USA - États',
		departmentsfranceRecord: 'France - Départements',
		countyTownsfranceRecord: 'France - Chefs-lieux'
	};

	let localStorageListsItems: Record<string, { name: string; maxScore: number }> = {
		capitalsRecord: { name: 'Capitales', maxScore: 196 },
		countriesRecord: { name: 'Pays', maxScore: 191 },
		flagsRecord: { name: 'Drapeaux', maxScore: 196 },
		usaCapitals: { name: 'Capitales des USA', maxScore: 50 },
		usaStatesRecord: { name: 'États des USA', maxScore: 50 },
		usaFlagsRecord: { name: 'Drapeaux des USA', maxScore: 50 },
		frenchCountyTownsRecord: { name: 'Chefs-lieux français', maxScore: 101 },
		frenchDepartmentsRecord: { name: 'Départements français', maxScore: 101 }
	};

	let quizzRecords: Record<string, string> = {};
	let listsRecords: Record<string, string> = {};
	let apiRecords: Array<{ categorie: string; difficulty: string; currentRecord: string }> = [];

	const apiCategoryTranslations: Record<string, string> = {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale'
	};

	const apiDifficultyTranslations: Record<string, string> = {
		easy: 'Facile',
		medium: 'Moyen',
		hard: 'Difficile'
	};

	onMount(() => {
		if (PUBLIC_USE_API && PUBLIC_USE_API === 'true') {
			fetch('/api/records')
				.then((response) => response.json())
				.then((data) => {
					apiRecords = data.data.records;
				});
		} else {
			for (const key of Object.keys(localStorageQuizzItems)) {
				quizzRecords[key] = localStorage.getItem(key)
					? `${localStorage.getItem(key)} / 20`
					: 'Pas encore établi';
			}

			for (const key of Object.keys(localStorageListsItems)) {
				const record = localStorage.getItem(key);
				const { name, maxScore } = localStorageListsItems[key];
				listsRecords[key] = record ? `${record} / ${maxScore}` : 'Pas encore établi';
			}
		}
	});
</script>

<div
	class="container mx-auto flex h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
	<div
		class="absolute left-1/2 top-10 flex -translate-x-1/2 flex-col items-center justify-center gap-4"
	>
		<h1 class="text-3xl font-medium">Statistiques :</h1>
	</div>
	<div class="z-10 flex flex-col items-center gap-12">
		<h2 class="text-xl font-bold">Records :</h2>
		<div class="grid grid-cols-2 gap-12">
			{#if PUBLIC_USE_API === 'true'}
				<div class="flex flex-col items-center gap-4">
					<h3 class="text-lg font-bold">Quizz :</h3>
					<div class="flex flex-col items-center gap-4">
						{#each apiRecords.filter((record) => record.categorie && record.difficulty) as record}
							<div class="flex gap-2">
								<p>
									{apiCategoryTranslations[record.categorie]} - {apiDifficultyTranslations[
										record.difficulty
									]} :
								</p>
								<p>{record.currentRecord} / 20</p>
							</div>
						{/each}
					</div>
				</div>
				<div class="flex flex-col items-center gap-4">
					<h3 class="text-lg font-bold">Listes :</h3>
					<div class="flex flex-col items-center gap-4">
						{#each apiRecords.filter((record) => record.categorie && !record.difficulty) as record}
							<div class="flex gap-2">
								<p>{apiCategoryTranslations[record.categorie]} :</p>
								<p>
									{record.currentRecord} / {record.categorie === 'countries' ? '190' : '195'}
								</p>
							</div>
						{/each}
					</div>
				</div>
			{:else}
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
								<p>{localStorageListsItems[key].name} :</p>
								<p>{listsRecords[key] || 'Loading'}</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
