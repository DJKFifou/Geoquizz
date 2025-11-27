<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import ExitArrow from '$lib/components/ExitArrow.svelte';
	import Exit from '$lib/components/Exit.svelte';
	import ListStartGame from '$lib/components/ListStartGame.svelte';
	import { cleanStringWithoutDash } from '$lib/utils';

	type Country = {
		country: string;
		capital?: string[];
		image?: string;
	};

	let { data }: PageProps = $props();

	let categorieName = page.params.categorie;
	console.log('categorieName', categorieName);
	let previousPage = page.url.pathname.split('/').slice(0, -1).join('/');

	let currentRecord = `${categorieName}Record`;
	let currentRecordValue: string | null = $state('0');
	let datas: Country[] = (data?.data as Country[]) || [];
	let inputValue: string = $state('');
	let revealedAnswers: string[] = $state([]);
	let missingAnswers: string[] = $state([]);
	let lastCountrySelected: string = datas[0]?.country || '';
	let currentCountryIndex: number = $state(0);
	let totalTime: number = 15 * 60;
	let timer: number = $state(15 * 60);
	let timerInterval: NodeJS.Timeout | null = null;
	let timerDisabled: boolean = $state(false);
	let startGame: boolean = $state(true);
	let gameOver: boolean = $state(false);
	let exit = $state(false);

	function handleCountryClick(country: string, index: number) {
		inputValue = '';
		lastCountrySelected = country;
		currentCountryIndex = index;

		setTimeout(() => {
			const input = document.querySelector('input[type="text"]') as HTMLInputElement;
			input?.focus();
		}, 0);
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

	function localStorageGetOrPostItem() {
		const currentValue = Number(localStorage.getItem(currentRecord)) || 0;

		if (currentValue < revealedAnswers.length) {
			localStorage.setItem(currentRecord, revealedAnswers.length.toString());
		}

		currentRecordValue = localStorage.getItem(currentRecord);
	}

	function ApiPostItem() {
		fetch(`/api/records`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				categorieName,
				currentRecord: revealedAnswers.length.toString()
			})
		})
			.then((res) => res.json())
			.then(({ record }) => {
				currentRecordValue = record.currentRecord;
			});
	}

	$effect(() => {
		if (!startGame && !gameOver && timer === 15 * 60 && !timerDisabled) {
			startTimer();
		}

		if (!gameOver) {
			if (revealedAnswers.length === datas.length) {
				gameOver = true;
			}
			if (
				(categorieName === 'capitals' ||
					categorieName === 'frenchCountyTowns' ||
					categorieName === 'usaCapitals') &&
				inputValue
			) {
				const matchingCountry = datas.find((item: Country) =>
					item.capital?.some(
						(cap: string) => cleanStringWithoutDash(cap) === cleanStringWithoutDash(inputValue)
					)
				);

				if (matchingCountry && !revealedAnswers.includes(matchingCountry.country)) {
					revealedAnswers = [...revealedAnswers, matchingCountry.country];
					inputValue = '';
				}
			} else if (
				lastCountrySelected &&
				cleanStringWithoutDash(inputValue) === cleanStringWithoutDash(lastCountrySelected) &&
				!revealedAnswers.includes(lastCountrySelected)
			) {
				revealedAnswers = [...revealedAnswers, lastCountrySelected];
				lastCountrySelected = '';
				inputValue = '';
				moveToNextCountry();
			}
		} else {
			missingAnswers = datas
				.filter((item) => !revealedAnswers.includes(item.country))
				.map((item) => item.country);
			if (env.PUBLIC_USE_API === 'true') {
				ApiPostItem();
			} else {
				localStorageGetOrPostItem();
			}
		}
	});

	const startGameHandler = () => {
		startGame = false;
	};
</script>

<div
	class="container mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
	<ExitArrow onclick={() => (exit = true)} />
	{#if exit}
		<Exit link={previousPage} onclick={() => (exit = false)} />
	{/if}
	{#if startGame}
		<ListStartGame category={categorieName} play={startGameHandler} />
	{:else}
		<div class="relative flex w-full flex-col gap-8 px-4">
			{#if !timerDisabled}
				<div
					class="fixed bottom-0 left-0 h-2 transition-all duration-300"
					style="width: {(timer * 100) / totalTime}%;
					background-color: {timer > totalTime * 0.5
						? 'green'
						: timer > totalTime * 0.2
							? 'orange'
							: 'red'};"
				></div>
			{/if}
			<div class="sticky top-0 flex flex-col items-center gap-4 bg-gray-800 pb-2 pt-10">
				<p class="text-center text-2xl font-bold">
					{gameOver
						? 'Temps écoulé ! Jeu terminé.'
						: `Temps restant : ${timerDisabled ? 'Désactivé' : formatTime(timer)}`}
				</p>
				<p class="text-center text-xl font-medium">
					{revealedAnswers.length} / {datas.length}
				</p>
				{#if gameOver && data?.data}
					<h3>
						Votre record est {currentRecordValue}/{data.data.length}
					</h3>
				{/if}
				<div class="flex gap-4">
					{#if !gameOver}
						{#if !timerDisabled}
							<button
								class="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500"
								onclick={disableTimer}
							>
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
			{#if categorieName === 'capitals' || categorieName === 'frenchCountyTowns' || categorieName === 'usaCapitals'}
				<div class="mb-8 grid grid-cols-2 gap-4">
					{#each datas as item (item.country)}
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
				<div class="mb-8 flex grid-cols-2 flex-wrap justify-center gap-4 4xs:grid 2xs:flex">
					{#each datas as item, index (item.country)}
						<div
							class="flex flex-col gap-4"
							role="button"
							onfocus={() => handleCountryClick(item.country, index)}
							onclick={() => handleCountryClick(item.country, index)}
							onkeydown={(e) =>
								e.key === 'Enter' || e.key === ' '
									? handleCountryClick(item.country, index)
									: null}
							tabindex="0"
						>
							<div class="flex justify-center rounded bg-gray-700 p-2">
								<img src={item.image} alt="Drapeau" class="h-28 w-40 object-contain" />
							</div>
							<div
								class="h-10 cursor-pointer rounded bg-gray-700 p-2 {!gameOver &&
								currentCountryIndex === index
									? 'bg-yellow-700'
									: ''} "
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
	{/if}
</div>
