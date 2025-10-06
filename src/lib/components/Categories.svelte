<script lang="ts">
	import { page } from '$app/stores';
	import PrimaryBtn from '$lib/components/PrimaryLink.svelte';
	import { getQuizzCategories } from '$lib/utils';
	import { getListCategories } from '$lib/utils';

	let currentPage: string = $page.url.pathname;

	let categories: Record<string, string> = {};

	if (currentPage === '/lists') {
		categories = getListCategories();
	} else if (currentPage === '/quizz') {
		categories = getQuizzCategories();
	}

	let filteredCategories = Object.keys(categories).filter(
		(category) => !(category === 'general_knowledge' && currentPage === '/lists')
	);
</script>

<ul class="flex flex-wrap items-center justify-center gap-4">
	{#each filteredCategories as category}
		<li>
			<PrimaryBtn name={categories[category]} href={`${currentPage}/${category}`} />
		</li>
	{/each}
</ul>
