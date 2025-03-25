<script>
	const { link, onclick } = $props();
</script>

<div class="absolute top-0 z-20 h-full w-full bg-black/60">
	<div
		class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-lg bg-white px-10 py-6 text-black"
	>
		<h5 class="text-center">Êtes-vous sur de vouloir quitter ?</h5>
		<div class="flex justify-center gap-6">
			<a
				href={link}
				class="cursor-pointer rounded-lg bg-gray-600 px-2 py-1 text-white hover:bg-gray-700">Oui</a
			>
			<button
				type="button"
				{onclick}
				class="cursor-pointer rounded-lg bg-gray-600 px-2 py-1 text-white hover:bg-gray-700"
				>Non</button
			>
		</div>
	</div>
</div>
