<script lang="ts">
	import { page } from '$app/stores';
	type Country = {
		country: string;
		capital?: string[];
		image?: string;
	};
	export let data: { data: Country[] };

	$: categorieName = $page.params.categorie;

	let datas: Country[] = data?.data || [];
	let inputValue: string = '';
	let revealedAnswers: string[] = [];
	let missingAnswers: string[] = [];
	let lastCountrySelected: string = datas[0]?.country || '';
	let currentCountryIndex: number = 0;
	let timer: number = 15 * 60;
	let timerInterval: NodeJS.Timeout | null = null;
	let timerDisabled: boolean = false;
	let gameOver: boolean = false;

	function handleCountryClick(country: string, index: number) {
		inputValue = '';
		lastCountrySelected = country;
		currentCountryIndex = index;
	}

	function handleTabKey(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			e.preventDefault();
			if (datas.length > 0) {
				currentCountryIndex = (currentCountryIndex + 1) % datas.length;
				handleCountryClick(datas[currentCountryIndex].country, currentCountryIndex);
			}
		}
	}

	function moveToNextCountry() {
		const nextUnrevealedCountryIndex = datas.findIndex(
			(item, index) => !revealedAnswers.includes(item.country) && index > currentCountryIndex
		);

		if (nextUnrevealedCountryIndex !== -1) {
			currentCountryIndex = nextUnrevealedCountryIndex;
			handleCountryClick(datas[currentCountryIndex].country, currentCountryIndex);
		} else {
			currentCountryIndex = (currentCountryIndex + 1) % datas.length;
			handleCountryClick(datas[currentCountryIndex].country, currentCountryIndex);
		}
	}

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

				if (matchingCountry && !revealedAnswers.includes(matchingCountry.country)) {
					revealedAnswers = [...revealedAnswers, matchingCountry.country];
					inputValue = '';
				}
			} else if (
				lastCountrySelected &&
				cleanString(inputValue) === cleanString(lastCountrySelected)
			) {
				revealedAnswers = [...revealedAnswers, lastCountrySelected];
				lastCountrySelected = '';
				inputValue = '';
				moveToNextCountry();
			}
		} else {
			missingAnswers = [];
			datas.forEach((item: any) => {
				const isFound = revealedAnswers.includes(item.country);
				if (!isFound) {
					missingAnswers.push(item.country);
				}
			});
		}
	}
</script>

<div
	class="container mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
	<div class="flex w-full flex-col gap-8 p-4">
		<div class="sticky top-0 flex flex-col items-center gap-4 bg-gray-800 pb-2 pt-4">
			<p class="text-center text-2xl font-bold">
				{gameOver
					? 'Temps écoulé ! Jeu terminé.'
					: `Temps restant : ${timerDisabled ? 'Désactivé' : formatTime(timer)}`}
			</p>
			<p class="text-center text-xl font-medium">{revealedAnswers.length} / {datas.length}</p>
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
					onkeydown={handleTabKey}
				/>
			{/if}
		</div>
		{#if categorieName === 'capitals'}
			<div class="grid grid-cols-2 gap-4">
				{#each datas as item, index (item.country)}
					<div class="rounded bg-gray-700 p-2">
						<p>{item.country}</p>
					</div>
					<div class="rounded bg-gray-700 p-2">
						<p
							class:!text-green-400={gameOver && revealedAnswers.includes(item.country)}
							class:!text-red-400={gameOver && missingAnswers.includes(item.country)}
						>
							{#if revealedAnswers.includes(item.country)}
								{item.capital?.join(' / ') || 'No capital available'}
							{:else if missingAnswers.includes(item.country)}
								{item.capital?.join(' / ') || 'No capital available'}
							{/if}
						</p>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-wrap justify-center gap-4">
				{#each datas as item, index (item.country)}
					<div class="flex flex-col gap-4">
						<div class="flex justify-center rounded bg-gray-700 p-2">
							<img src={item.image} alt="Réponse" class="h-28 w-40 object-contain" />
						</div>
						<div
							role="button"
							class="h-10 cursor-pointer rounded bg-gray-700 p-2 {!gameOver &&
							currentCountryIndex === index
								? 'bg-yellow-700'
								: ''} "
							onfocus={() => handleCountryClick(item.country, index)}
							onclick={() => handleCountryClick(item.country, index)}
							onkeydown={(e) =>
								e.key === 'Enter' || e.key === ' ' ? handleCountryClick(item.country, index) : null}
							tabindex="0"
						>
							<p
								class:!text-green-400={gameOver && revealedAnswers.includes(item.country)}
								class:!text-red-400={gameOver && missingAnswers.includes(item.country)}
							>
								{#if revealedAnswers.includes(item.country)}
									{item.country}
								{:else if missingAnswers.includes(item.country)}
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
