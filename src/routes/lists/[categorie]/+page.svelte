<script lang="ts">
	export let data;
	console.log(data);
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
		const matchingCountry = datas.find((item) =>
			item.capital.some((cap) => cleanString(cap) === cleanString(inputValue))
		);

		if (matchingCountry && !revealedCapitals.includes(matchingCountry.country)) {
			revealedCapitals = [...revealedCapitals, matchingCountry.country];
			inputValue = '';
		}
	}
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 text-white">
	<div class="flex w-2/3 flex-col gap-8 p-4">
		<input
			type="text"
			placeholder="Rechercher une capitale"
			class="sticky top-4 rounded-lg px-6 py-4 text-black"
			bind:value={inputValue}
		/>
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
	</div>
</div>
