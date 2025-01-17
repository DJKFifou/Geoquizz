<script lang="ts">
	import { page } from '$app/stores';
	let currentPage: string = $page.url.pathname;
	const categorieName: string = $page.params.categorie;
	const difficulties: Record<string, string> = {
		easy: 'Facile',
		medium: 'Moyen',
		hard: 'Difficile'
	};
</script>

<div class="flex h-screen w-full flex-col items-center justify-center gap-6 bg-gray-800 text-white">
	<h1 class="text-3xl font-bold uppercase">{categorieName}</h1>
	<h3 class="text-2xl font-medium">Choisissez votre niveau :</h3>
	<ul class="flex flex-col items-center gap-4">
		{#each Object.keys(difficulties) as difficulty}
			<li>
				<a href={`${currentPage}/${difficulty}`}>{difficulties[difficulty]}</a>
			</li>
		{/each}
	</ul>
</div>
