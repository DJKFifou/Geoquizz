<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import BackArrow from '$lib/components/BackArrow.svelte';

	let { children } = $props();

	let currentPath = $derived(page.url.pathname);
	let pathSegments = $derived(currentPath.split('/').filter(Boolean));

	let previousPage = $derived.by(() => {
		const segments = pathSegments;
		segments.pop();
		return '/' + segments.join('/');
	});

	let firsPathnameItem = $derived(pathSegments[0] ?? '');
</script>

{#if currentPath !== '/' && (pathSegments.length < 2 || (firsPathnameItem !== 'lists' && pathSegments.length < 3))}
	<BackArrow href={previousPage} />
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
