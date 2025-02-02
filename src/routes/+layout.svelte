<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	let { children } = $props();

	const currentPath = derived(page, ($page) => $page.url.pathname);
	const pathSegments = derived(currentPath, ($currentPath) =>
		$currentPath.split('/').filter(Boolean)
	);

	const previousPage = derived(currentPath, ($currentPath) => {
		const segments = $currentPath.split('/').filter(Boolean);
		segments.pop();
		return '/' + segments.join('/');
	});
</script>

{#if $page.url.pathname !== '/' && $pathSegments.length < 3}
	<a
		href={$previousPage}
		class="absolute left-4 top-4 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-700">⬅</a
	>
{/if}

<a
	href="https://github.com/DJKFifou"
	target="_blank"
	class="fixed bottom-2 right-2 text-2xl font-bold text-white">Github</a
>

{@render children()}
