<script>
	const { href } = $props();

	import backArrow from '$lib/assets/back-arrow.svg';
</script>

<a {href} class="fixed left-4 top-4 z-10 flex cursor-pointer items-center gap-2 text-sm">
	<img src={backArrow} alt="Retour en arrière" />
	<p>Retour</p>
</a>
