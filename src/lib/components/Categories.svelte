<script lang="ts">
	import { page } from '$app/stores';
	import PrimaryBtn from '$lib/components/PrimaryLink.svelte';

	let currentPage: string = $page.url.pathname;

	const categories: Record<string, string> = {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale',
		usa: 'USA'
	};

	let filteredCategories = Object.keys(categories).filter(
		(category) =>
			!((category === 'general_knowledge' || category === 'usa') && currentPage === '/lists')
	);
</script>

<ul class="flex flex-wrap items-center justify-center gap-4">
	{#each filteredCategories as category}
		<li>
			<PrimaryBtn name={categories[category]} href={`${currentPage}/${category}`} />
		</li>
	{/each}
</ul>
