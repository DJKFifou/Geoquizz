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

{@render children()}
