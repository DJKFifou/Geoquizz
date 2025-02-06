<script>
	const { name, onclick, className } = $props();
</script>

<button {onclick} class={className}>
	{name}
</button>
