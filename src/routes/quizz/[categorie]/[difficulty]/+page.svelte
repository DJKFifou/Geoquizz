<script lang="ts">
	import { page } from '$app/stores';
	export let data;

	$: categorieName = $page.params.categorie;
	$: difficultyName = $page.params.difficulty;
	$: previousPage = $page.url.pathname.split('/').slice(0, -1).join('/');

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
	let endGame: boolean = false;
	let exit = false;

	let answered = (option: string) => {
		if (isOptionSelected) return;
		selectedOption = option;
		isAnswerCorrect = data.data[currentQuestionIndex].answer === option;
		goodAnswers += isAnswerCorrect ? 1 : 0;
		isOptionSelected = true;
	};

	const nextQuestion = () => {
		if (isOptionSelected) {
			if (currentQuestionIndex < data.data.length - 1) {
				currentQuestionIndex++;
				selectedOption = '';
				isAnswerCorrect = false;
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
</script>

<div class="flex h-screen w-full flex-col items-center justify-center bg-gray-800 text-white">
	<div
		class="absolute left-1/2 top-4 flex -translate-x-1/2 flex-col items-center justify-center gap-4"
	>
		<p>Catégorie : {categories[categorieName]}</p>
		<p>Difficulté : {difficultyName}</p>
		<p>{currentQuestionIndex + 1}/{data.data.length}</p>
	</div>
	<button
		type="button"
		onclick={() => (exit = true)}
		class="absolute right-4 top-4 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-700"
		>❌
	</button>
	{#if exit}
		<div class="absolute h-full w-full bg-black/60">
			<div
				class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-lg bg-white px-10 py-6 text-black"
			>
				<h5>Êtes-vous sur de vouloir quitter ?</h5>
				<div class="flex justify-center gap-6">
					<a
						href={previousPage}
						class="cursor-pointer rounded-lg bg-gray-600 px-2 py-1 text-white hover:bg-gray-700"
						>Oui
					</a>
					<button
						type="button"
						onclick={() => (exit = false)}
						class="cursor-pointer rounded-lg bg-gray-600 px-2 py-1 text-white hover:bg-gray-700"
						>Non
					</button>
				</div>
			</div>
		</div>
	{/if}
	{#if !endGame}
		<div class="flex flex-col items-center justify-center gap-6">
			<h3 class="text-center text-2xl font-bold">{data.data[currentQuestionIndex].question}</h3>
			{#if categorieName === 'flags' || categorieName === 'countries'}
				<img src={data.data[currentQuestionIndex].image} alt="Réponse" class="h-28 w-40" />
			{/if}
			<div
				class="grid auto-rows-fr grid-cols-2 items-stretch justify-items-center gap-4 text-center"
			>
				{#each data.data[currentQuestionIndex].options as option}
					<button
						onclick={() => answered(option)}
						class="align-center flex h-full w-40 cursor-pointer items-center justify-center rounded-lg border-2 border-white p-6 text-lg font-medium
							{!selectedOption ? 'hover:bg-white/10' : ''}
							{selectedOption === option ? (isAnswerCorrect ? 'bg-green-500' : 'bg-red-500') : ''}
							{selectedOption && option === data.data[currentQuestionIndex].answer ? 'bg-green-500' : ''}"
					>
						{option}
					</button>
				{/each}
			</div>
			<button onclick={nextQuestion} class="w-fit rounded bg-blue-500 px-4 py-2 hover:bg-blue-600">
				{currentQuestionIndex < data.data.length - 1 ? 'Suivant' : 'Terminer le quizz'}
			</button>
		</div>
	{:else}
		<h3>Vous avez fait {goodAnswers}/{data.data.length}</h3>
		<h3>Votre record est {localStorage.getItem(currentRecord)}/{data.data.length}</h3>
	{/if}
</div>
