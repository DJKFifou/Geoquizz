<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { onMount, onDestroy } from 'svelte';
	import { PUBLIC_USE_API } from '$env/static/public';
	import ExitArrow from '$lib/components/ExitArrow.svelte';
	import AnswerBtn from '$lib/components/AnswerBtn.svelte';
	import PrimaryLink from '$lib/components/PrimaryLink.svelte';
	import QuizzStartGame from '$lib/components/QuizzStartGame.svelte';
	import QuizzResults from '$lib/components/QuizzResults.svelte';
	import Exit from '$lib/components/Exit.svelte';

	let { data }: PageProps = $props();

	interface AnswersArray {
		image?: string;
		question: string;
		options: string[];
		answer: string;
		selectedOption: string;
		isAnswerCorrect: boolean;
	}

	const categorieName = page.params.categorie;
	const difficultyName = page.params.difficulty;
	const previousPage = page.url.pathname.split('/').slice(0, -1).join('/');
	const currentPage = page.url.pathname;

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

	const currentRecord: string = `${difficultyName}${categorieName}Record`;
	let currentRecordValue: string | null = $state('0');
	let currentQuestionIndex: number = $state(0);
	let selectedOption: string = $state('');
	let isAnswerCorrect: boolean = $state(false);
	let isOptionSelected: boolean = $state(false);
	let goodAnswers: number = $state(0);
	let startGame: boolean = $state(true);
	let endGame: boolean = $state(false);
	let exit = $state(false);
	let timer: number = $state(10);
	let interval: ReturnType<typeof setInterval>;
	let withTimer: boolean = $state(false);
	let timerQuantity: number;
	let answersArray: AnswersArray[] = [];
	let showResults: boolean = $state(false);

	const startTimer = () => {
		if (withTimer) {
			timer = timerQuantity;
			interval = setInterval(() => {
				if (!isOptionSelected) {
					if (timer > 0) {
						timer--;
					} else {
						isOptionSelected = true;
						stopTimer();
					}
				} else {
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

		if (data.data) isAnswerCorrect = data.data[currentQuestionIndex].answer === option && timer > 0;
		goodAnswers += isAnswerCorrect ? 1 : 0;
		isOptionSelected = true;
	};

	const nextQuestion = () => {
		if (isOptionSelected) {
			if (data.data && currentQuestionIndex < data.data.length) {
				answersArray.push({
					image: data.data[currentQuestionIndex].image ?? undefined,
					question: data.data[currentQuestionIndex].question,
					options: data.data[currentQuestionIndex].options,
					answer: data.data[currentQuestionIndex].answer,
					selectedOption,
					isAnswerCorrect
				});
				if (currentQuestionIndex < data.data.length - 1) {
					currentQuestionIndex++;
					selectedOption = '';
					isAnswerCorrect = false;
					isOptionSelected = false;
					startTimer();
					const activeElement = document.activeElement as HTMLElement;
					activeElement?.blur();
				} else {
					if (PUBLIC_USE_API === 'true') {
						ApiPostItem();
					} else {
						localStorageGetOrPostItem();
					}
					endGame = true;
				}
			}
		}
	};

	const ApiPostItem = () => {
		fetch(`/api/records`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				categorieName,
				difficultyName,
				currentRecord: goodAnswers.toString()
			})
		})
			.then((res) => res.json())
			.then(({ record }) => {
				currentRecordValue = record.currentRecord;
			});
	};

	const localStorageGetOrPostItem = () => {
		const currentValue = Number(localStorage.getItem(currentRecord)) || 0;

		if (currentValue < goodAnswers) {
			localStorage.setItem(currentRecord, goodAnswers.toString());
		}

		currentRecordValue = localStorage.getItem(currentRecord);
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (!endGame && !exit) {
			if (event.key === 'Enter' && isOptionSelected) {
				event.preventDefault();
				nextQuestion();
			} else if (['1', '2', '3', '4'].includes(event.key) && data.data) {
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

	const startGameHandler = (timerStatus: boolean, timerValue: number) => {
		withTimer = timerStatus;
		timerQuantity = timerValue;
		timer = timerQuantity;
		startGame = false;
		startTimer();
	};

	const getClass = (timer: number) => {
		if (timer < 3) return 'text-red-500';
		if (timer < 5) return 'text-orange-500';
		if (timer < 7) return 'text-yellow-500';
		return 'text-white';
	};

	let titleColor = $derived(getClass(timer));
</script>

<div
	class="container mx-auto flex h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
	{#if !endGame && withTimer}
		<p class={titleColor}>
			{timer ? `${timer} secondes restantes` : 'Temps écoulé'}
		</p>
	{/if}
	<ExitArrow onclick={() => (exit = true)} />
	{#if exit}
		<Exit link={previousPage} onclick={() => (exit = false)} />
	{/if}
	{#if startGame}
		<QuizzStartGame
			category={categories[categorieName]}
			difficulty={difficulties[difficultyName]}
			timer={withTimer}
			play={startGameHandler}
		/>
	{:else if !endGame && data.data}
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
									{selectedOption && option === data.data[currentQuestionIndex].answer ? '!bg-green-500' : ''}
									{timer === 0 && option === data.data[currentQuestionIndex].answer ? '!bg-red-500' : ''}"
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
	{:else if data.data}
		<div class="z-10 flex flex-col gap-4">
			<div class="flex flex-col items-center gap-4">
				<h3>Vous avez fait {goodAnswers}/{data.data.length}</h3>
				<h3>Votre record est {currentRecordValue}/{data.data.length}</h3>
			</div>
			<button class="underline" onclick={() => (showResults = !showResults)}
				>{showResults ? 'Cacher' : 'Voir'} les résultats</button
			>
			{#if showResults}
				<QuizzResults data={answersArray} />
			{/if}
			<div class="flex justify-center gap-4">
				<PrimaryLink mode="reload" name="Rejouer" href={currentPage} />
				<PrimaryLink name="Stats" href="/stats" />
			</div>
		</div>
	{/if}
</div>
