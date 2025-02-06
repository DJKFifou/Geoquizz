<script>
	const { name, href, mode = '' } = $props();
</script>

{#if mode === 'reload'}
	<a
		data-sveltekit-reload
		{href}
		class="border-grey/30 rounded-5xl text-grey flex justify-center border-2 bg-white px-6 py-4 hover:bg-white/90"
	>
		{name}
	</a>
{:else}
	<a
		{href}
		class="border-grey/30 rounded-5xl text-grey flex justify-center border-2 bg-white px-6 py-4 hover:bg-white/90"
	>
		{name}
	</a>
{/if}
