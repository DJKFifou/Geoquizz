<script lang="ts">
	import Categories from '$lib/components/Categories.svelte';
</script>

<div
	class="container mx-auto flex h-screen w-full flex-col items-center justify-center gap-6 bg-gray-800 text-white"
>
	<h1 class="text-3xl font-bold uppercase">Listes</h1>
	<h3 class="text-2xl font-medium">Choisissez votre catégorie :</h3>
	<Categories />
</div>
