<script lang="ts">
	import { page } from '$app/stores';
	export let data;

	$: categorieName = $page.params.categorie;

	let datas = data?.data || [];

	let inputValue = '';
	let revealedCapitals: string[] = [];

	function cleanString(str: string): string {
		return str
			.normalize('NFD')
			.replace(/[\s\-'"]/g, '')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}
	$: {
		if (categorieName === 'capitals') {
			const matchingCountry = datas.find((item: any) =>
				item.capital.some((cap: any) => cleanString(cap) === cleanString(inputValue))
			);

			if (matchingCountry && !revealedCapitals.includes(matchingCountry.country)) {
				revealedCapitals = [...revealedCapitals, matchingCountry.country];
				inputValue = '';
			}
		} else {
			const matchingCountry = datas.find(
				(item: any) => cleanString(item.country) === cleanString(inputValue)
			);

			if (matchingCountry && !revealedCapitals.includes(matchingCountry.country)) {
				revealedCapitals = [...revealedCapitals, matchingCountry.country];
				inputValue = '';
			}
		}
	}
</script>

<div
	class="container mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
	<div class="flex w-full flex-col gap-8 p-4">
		<input
			type="text"
			placeholder="Rechercher un{categorieName === 'capitals' ? 'e capitale' : ' pays'}"
			class="sticky top-4 rounded-lg px-6 py-4 text-black"
			bind:value={inputValue}
		/>
		{#if categorieName === 'capitals'}
			<div class="grid grid-cols-2 gap-4">
				{#each datas as item (item.country)}
					<div class="rounded bg-gray-700 p-2">
						<p>{item.country}</p>
					</div>
					<div class="rounded bg-gray-700 p-2">
						<p>
							{#if revealedCapitals.includes(item.country)}
								{item.capital.join(' / ')}
							{/if}
						</p>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-wrap justify-center gap-4">
				{#each datas as item (item.country)}
					<div class="flex flex-col gap-4">
						<div class="rounded bg-gray-700 p-2">
							<img src={item.image} alt="Réponse" class="h-28 w-40" />
						</div>
						<div class="h-10 rounded bg-gray-700 p-2">
							<p>
								{#if revealedCapitals.includes(item.country)}
									{item.country}
								{/if}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
