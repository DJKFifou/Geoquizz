<script>
	const { name, href, mode = '' } = $props();
</script>

<a
	{href}
	class="flex justify-center rounded-5xl border-2 border-grey/30 bg-white px-6 py-4 text-grey hover:bg-white/90"
	{...mode === 'reload' ? { 'data-sveltekit-reload': true } : {}}
>
	{name}
</a>
