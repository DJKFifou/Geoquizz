<script>
	const { onclick } = $props();

	import backArrow from '$lib/assets/back-arrow.svg';
</script>

<button {onclick} class="fixed left-4 top-4 z-10 flex cursor-pointer items-center gap-2 text-sm">
	<img src={backArrow} alt="Flèche retour en arrière" />
	<p>Quitter la partie</p>
</button>
