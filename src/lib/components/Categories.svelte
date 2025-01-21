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

<ul class="flex items-center gap-4">
	{#each Object.keys(categories) as category}
		<li>
			<a
				href={`${currentPage}/${category}`}
				class="align-center flex cursor-pointer items-center justify-center rounded-lg border-2 border-white px-6 py-4 text-lg font-medium hover:bg-white/10"
				>{categories[category]}</a
			>
		</li>
	{/each}
</ul>
