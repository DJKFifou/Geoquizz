<script lang="ts">
	import { page } from '$app/stores';
	let currentPage: string = $page.url.pathname;
	const categorieName: string = $page.params.categorie;
	const difficulties: Record<string, { label: string; color: string }> = {
		easy: { label: 'Facile', color: 'bg-green-500 hover:bg-green-600' },
		medium: { label: 'Moyen', color: 'bg-orange-500 hover:bg-orange-600' },
		hard: { label: 'Difficile', color: 'bg-red-500 hover:bg-red-600' }
	};
</script>

<div class="flex h-screen w-full flex-col items-center justify-center gap-6 bg-gray-800 text-white">
	<h1 class="text-3xl font-bold uppercase">{categorieName}</h1>
	<h3 class="text-2xl font-medium">Choisissez votre niveau :</h3>
	<ul class="grid auto-rows-fr grid-cols-3 items-center gap-4">
		{#each Object.entries(difficulties) as [difficulty, { label, color }]}
			<li>
				<a
					href={`${currentPage}/${difficulty}`}
					class={`flex flex-1 justify-center rounded-lg px-6 py-4 font-bold transition ${color}`}
				>
					{label}
				</a>
			</li>
		{/each}
	</ul>
</div>
