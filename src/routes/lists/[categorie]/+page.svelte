<script lang="ts">
	import { page } from '$app/stores';
	export let data;

	$: categorieName = $page.params.categorie;

	let datas = data?.data || [];
	let inputValue: string = '';
	let revealedCapitals: string[] = [];
	let missingCapitals: string[] = [];
	let timer: number = 15 * 60;
	let timerInterval: NodeJS.Timeout | null = null;
	let gameOver: boolean = false;
	let timerDisabled: boolean = false;

	function cleanString(str: string): string {
		return str
			.normalize('NFD')
			.replace(/[\s\-'"]/g, '')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	function startTimer() {
		if (!timerDisabled && !timerInterval) {
			timerInterval = setInterval(() => {
				if (timer > 0) {
					timer--;
				} else {
					clearInterval(timerInterval!);
					gameOver = true;
				}
			}, 1000);
		}
	}

	function disableTimer() {
		timerDisabled = true;
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
	}

	$: {
		if (!gameOver && timer === 15 * 60 && !timerDisabled) {
			startTimer();
		}
	}

	$: {
		if (!gameOver) {
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
		} else {
			missingCapitals = [];
			datas.forEach((item: any) => {
				if (categorieName === 'capitals') {
					const isFound = revealedCapitals.includes(item.country);
					if (!isFound) {
						missingCapitals.push(item.country);
					}
				} else {
					const isFound = revealedCapitals.includes(item.country);
					if (!isFound) {
						missingCapitals.push(item.country);
					}
				}
			});
		}
	}
</script>

<div
	class="container mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
	<div class="flex w-full flex-col gap-8 p-4">
		<div
			class="sticky top-0 flex flex-col items-center gap-4 border-b-2 border-dashed border-white bg-gray-800 pb-2 pt-4"
		>
			<p class="text-center text-2xl font-bold">
				{gameOver
					? 'Temps écoulé ! Jeu terminé.'
					: `Temps restant : ${timerDisabled ? 'Désactivé' : formatTime(timer)}`}
			</p>
			<p class="text-center text-xl font-medium">{revealedCapitals.length} / {datas.length}</p>
			<div class="flex gap-4">
				{#if !gameOver}
					{#if !timerDisabled}
						<button class="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500" onclick={disableTimer}>
							Désactiver le timer
						</button>
					{/if}
					<button
						class="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500"
						onclick={() => (gameOver = true)}
					>
						Abandonner
					</button>
				{/if}
			</div>

			{#if !gameOver}
				<input
					type="text"
					placeholder="Rechercher un{categorieName === 'capitals' ? 'e capitale' : ' pays'}"
					class="w-full rounded-lg px-6 py-4 text-black"
					bind:value={inputValue}
					autofocus
				/>
			{/if}
		</div>
		{#if categorieName === 'capitals'}
			<div class="grid grid-cols-2 gap-4">
				{#each datas as item (item.country)}
					<div class="rounded bg-gray-700 p-2">
						<p>{item.country}</p>
					</div>
					<div class="rounded bg-gray-700 p-2">
						<p
							class:!text-green-400={gameOver && revealedCapitals.includes(item.country)}
							class:!text-red-400={gameOver && missingCapitals.includes(item.country)}
						>
							{#if revealedCapitals.includes(item.country)}
								{item.capital.join(' / ')}
							{:else if missingCapitals.includes(item.country)}
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
							<p
								class:!text-green-400={gameOver && revealedCapitals.includes(item.country)}
								class:!text-red-400={gameOver && missingCapitals.includes(item.country)}
							>
								{#if revealedCapitals.includes(item.country)}
									{item.country}
								{:else if missingCapitals.includes(item.country)}
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
