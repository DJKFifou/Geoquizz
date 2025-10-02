<script lang="ts">
	import { page } from '$app/stores';
	import PrimaryBtn from '$lib/components/PrimaryLink.svelte';

	let currentPage: string = $page.url.pathname;
	const categorieName: string = $page.params.categorie;
	const categories: Record<string, string> = {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale',
		usa: 'USA'
	};

	let difficulties: Record<string, { label: string }> = {};

	if (currentPage !== '/quizz/usa') {
		difficulties = {
			easy: { label: 'Facile' },
			medium: { label: 'Moyen' },
			hard: { label: 'Difficile' }
		};
	} else {
		difficulties = {
			capitals: { label: 'Capitales' },
			flags: { label: 'Drapeaux' },
			states: { label: 'États' }
		};
	}

	console.log(difficulties);
</script>

<div
	class="container mx-auto flex h-screen w-full flex-col items-center justify-center gap-6 bg-gray-800 text-white"
>
	<div class="z-10 flex w-full flex-col items-center justify-center gap-6">
		<h1 class="text-3xl font-bold uppercase">{categories[categorieName]}</h1>
		<h3 class="text-2xl font-medium">Choisissez votre niveau :</h3>
		<ul class="flex items-center gap-4">
			{#each Object.entries(difficulties) as [difficulty, { label }]}
				<li>
					<PrimaryBtn name={label} href={`${currentPage}/${difficulty}`} />
				</li>
			{/each}
		</ul>
	</div>
</div>
