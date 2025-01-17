<script lang="ts">
	import { page } from '$app/stores';

	let currentPage: string = $page.url.pathname;

	const categories: Record<string, string> = {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale'
	};
</script>

<ul class="flex flex-col items-center gap-4">
	{#each Object.keys(categories) as category}
		<li>
			<a href={`${currentPage}/${category}`}>{categories[category]}</a>
		</li>
	{/each}
</ul>
