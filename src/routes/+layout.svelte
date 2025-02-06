<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import BackArrow from '$lib/components/BackArrow.svelte';

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
	<BackArrow href={$previousPage} />
{/if}

<div
	class="fixed -bottom-3/4 -right-full h-screen w-[200%] rounded-full blur-[100px]"
	style="background: radial-gradient(#13D8CC, #405869);"
></div>

<a
	href="https://github.com/DJKFifou/Geoquizz"
	target="_blank"
	class="fixed bottom-2 right-2 z-10 text-lg font-medium text-white">Github</a
>

{@render children()}
