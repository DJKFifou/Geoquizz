<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import ExitArrow from '$lib/components/ExitArrow.svelte';
	import AnswerBtn from '$lib/components/AnswerBtn.svelte';
	import PrimaryLink from '$lib/components/PrimaryLink.svelte';
	import StartGame from '$lib/components/StartGame.svelte';

	export let data;
	console.log('data : ', data);

	$: categorieName = $page.params.categorie;
	$: difficultyName = $page.params.difficulty;
	$: previousPage = $page.url.pathname.split('/').slice(0, -1).join('/');

	const currentPage = $page.url.pathname;

	const difficulties: Record<string, string> = {
		easy: 'Facile',
		medium: 'Moyen',
		hard: 'Difficile'
	};

	const categories: Record<string, string> = {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale'
	};

	let currentRecord = `${$page.params.difficulty}${$page.params.categorie}Record`;
	let currentQuestionIndex: number = 0;
	let selectedOption: string = '';
	let isAnswerCorrect: boolean = false;
	let isOptionSelected: boolean = false;
	let goodAnswers: number = 0;
	let startGame: boolean = true;
	let endGame: boolean = false;
	let exit = false;
	let timer: number = 10;
	let interval: any;
	let withTimer: boolean = false;

	const startTimer = () => {
		if (withTimer) {
			timer = 10;
			interval = setInterval(() => {
				if (timer > 0) {
					timer--;
				} else {
					isOptionSelected = true;
					isAnswerCorrect = false;
					stopTimer();
				}
			}, 1000);
		}
	};

	const stopTimer = () => {
		clearInterval(interval);
	};

	let answered = (option: string) => {
		if (isOptionSelected) return;
		selectedOption = option;

		isAnswerCorrect = data.data[currentQuestionIndex].answer === option && timer > 0;
		goodAnswers += isAnswerCorrect ? 1 : 0;
		isOptionSelected = true;
	};

	const nextQuestion = () => {
		if (isOptionSelected) {
			if (currentQuestionIndex < data.data.length - 1) {
				currentQuestionIndex++;
				selectedOption = '';
				isAnswerCorrect = false;
				isOptionSelected = false;
				startTimer();
				const activeElement = document.activeElement as HTMLElement;
				activeElement?.blur();
			} else {
				if (localStorage.getItem(currentRecord)) {
					Number(localStorage.getItem(currentRecord)) < goodAnswers &&
						localStorage.setItem(currentRecord, goodAnswers.toString());
				} else {
					localStorage.setItem(currentRecord, goodAnswers.toString());
				}
				endGame = true;
			}
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (!endGame && !exit) {
			if (event.key === 'Enter' && isOptionSelected) {
				event.preventDefault();
				nextQuestion();
			} else if (['1', '2', '3', '4'].includes(event.key)) {
				event.preventDefault();
				const index = parseInt(event.key, 10) - 1;
				const selectedOption = data.data[currentQuestionIndex]?.options?.[index];
				if (selectedOption && !isOptionSelected) {
					answered(selectedOption);
				}
			}
		}
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeydown);
		}
		startTimer();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
		stopTimer();
	});

	const startGameHandler = (timerStatus: boolean) => {
		withTimer = timerStatus;
		startGame = false;
	};
</script>

<div
	class="container mx-auto flex h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
	{#if !endGame && withTimer}
		<p class="text-xl font-bold">{timer} secondes restantes</p>
	{/if}
	<ExitArrow onclick={() => (exit = true)} />
	{#if exit}
		<div class="absolute z-20 h-full w-full bg-black/60">
			<div
				class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-lg bg-white px-10 py-6 text-black"
			>
				<h5 class="text-center">Êtes-vous sur de vouloir quitter ?</h5>
				<div class="flex justify-center gap-6">
					<a
						href={previousPage}
						class="cursor-pointer rounded-lg bg-gray-600 px-2 py-1 text-white hover:bg-gray-700"
						>Oui</a
					>
					<button
						type="button"
						onclick={() => (exit = false)}
						class="cursor-pointer rounded-lg bg-gray-600 px-2 py-1 text-white hover:bg-gray-700"
						>Non</button
					>
				</div>
			</div>
		</div>
	{/if}
	{#if startGame}
		<StartGame
			categorie={categories[categorieName]}
			difficulty={difficulties[difficultyName]}
			timer={withTimer}
			play={startGameHandler}
		/>
	{:else if !endGame}
		<div class="z-10 flex flex-col items-center justify-center gap-6 p-4">
			<p>Question {currentQuestionIndex + 1}/{data.data.length}</p>
			<h3 class="text-center text-2xl font-bold">{data.data[currentQuestionIndex].question}</h3>
			{#if categorieName === 'flags' || categorieName === 'countries'}
				<img src={data.data[currentQuestionIndex].image} alt="Réponse" class="m-4 h-40" />
			{/if}
			<div class="flex flex-col items-center justify-center gap-6">
				<div
					class="grid auto-rows-fr grid-cols-2 items-stretch justify-items-center gap-4 text-center"
				>
					{#each data.data[currentQuestionIndex].options as option}
						<AnswerBtn
							onclick={() => answered(option)}
							className="border-grey/30 rounded-5xl text-grey flex items-center justify-center border-2 bg-white px-6 py-4 w-full transition-all duration-300
									{!selectedOption ? 'hover:bg-white/80' : ''}
									{selectedOption === option ? (isAnswerCorrect ? '!bg-green-500' : '!bg-red-500') : ''}
									{selectedOption && option === data.data[currentQuestionIndex].answer ? '!bg-green-500' : ''}"
							name={option}
						/>
					{/each}
				</div>
				<AnswerBtn
					onclick={nextQuestion}
					className="w-full rounded-5xl px-4 py-2 {isOptionSelected
						? 'bg-blue-500 hover:bg-blue-600'
						: 'bg-grey'}"
					name={currentQuestionIndex < data.data.length - 1 ? 'Suivant' : 'Terminer le quizz'}
				/>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			<div class="flex flex-col items-center gap-4">
				<h3>Vous avez fait {goodAnswers}/{data.data.length}</h3>
				<h3>Votre record est {localStorage.getItem(currentRecord)}/{data.data.length}</h3>
			</div>
			<div class="flex gap-4">
				<PrimaryLink mode="reload" name="Rejouer" href={currentPage} />
				<PrimaryLink name="Stats" href="/stats" />
			</div>
		</div>
	{/if}
</div>
