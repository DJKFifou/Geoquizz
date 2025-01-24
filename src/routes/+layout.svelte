<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	let { children } = $props();
	let currentPath = $derived($page.url.pathname);
	let pathSegments = $derived(currentPath.split('/').filter(Boolean));
</script>

{#if $page.url.pathname !== '/' && pathSegments.length < 3}
	<button
		type="button"
		onclick={() => window.history.back()}
		class="absolute left-4 top-4 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-700"
		>⬅
	</button>
{/if}

<a
	href="https://github.com/DJKFifou"
	target="_blank"
	class="absolute bottom-2 right-2 text-2xl font-bold text-white">Github</a
>

{@render children()}
