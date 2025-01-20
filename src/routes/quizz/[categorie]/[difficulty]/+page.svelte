<script lang="ts">
	import { page } from '$app/stores';
	import { getEasy } from '$lib/data/flags/datas';
	export let data;

	const categorieName: string = $page.params.categorie;
	const difficultyName: string = $page.params.difficulty;

	let currentQuestionIndex: number = 0;
	let selectedOption: string = '';
	let isAnswerCorrect: boolean = false;
	let isOptionSelected: boolean = false;
	let goodAnswers: number = 0;

	let answered = (option: string) => {
		if (isOptionSelected) return;
		console.log(data.data[currentQuestionIndex].answer === option);
		selectedOption = option;
		isAnswerCorrect = data.data[currentQuestionIndex].answer === option;
		goodAnswers += isAnswerCorrect ? 1 : 0;
		isOptionSelected = true;
	};

	const nextQuestion = () => {
		if (currentQuestionIndex < data.data.length - 1 && isOptionSelected) {
			currentQuestionIndex++;
			selectedOption = '';
			isAnswerCorrect = false;
			isOptionSelected = false;
		}
	};
	let datas: any = null;

	getEasy().then((res) => {
		datas = res;
	});
</script>

<div class="flex h-screen w-full flex-col items-center justify-center bg-gray-800 text-white">
	<div
		class="absolute left-1/2 top-4 flex -translate-x-1/2 flex-col items-center justify-center gap-4"
	>
		<p>Catégorie : {categorieName}</p>
		<p>Difficulté : {difficultyName}</p>
		<p>{goodAnswers}/{data.data.length}</p>
	</div>
	<div class="flex flex-col items-center justify-center gap-6">
		<h3 class="text-2xl font-bold">{data.data[currentQuestionIndex].question}</h3>
		{#if datas && categorieName === 'flags'}
			<img src={datas[currentQuestionIndex].image} alt="Réponse" class="h-24 w-24" />
		{/if}
		<div class="grid grid-cols-2 items-center justify-items-center gap-4 text-center">
			{#each data.data[currentQuestionIndex].options as option}
				<button
					on:click={() => answered(option)}
					class="align-center flex h-full w-40 cursor-pointer items-center justify-center rounded-xl border-2 border-white p-6 text-lg font-medium
                        {!selectedOption ? 'hover:bg-white/10' : ''}
						{selectedOption === option ? (isAnswerCorrect ? 'bg-green-500' : 'bg-red-500') : ''}
                        {selectedOption && option === data.data[currentQuestionIndex].answer
						? 'bg-green-500'
						: ''}"
				>
					{option}
				</button>
			{/each}
		</div>
		{#if currentQuestionIndex < data.data.length - 1}
			<button on:click={nextQuestion} class="w-fit rounded bg-blue-600 px-4 py-2 hover:bg-blue-700">
				Suivant
			</button>
		{:else}
			<a href="/" class="w-fit rounded bg-blue-600 px-4 py-2 hover:bg-blue-700">
				Terminer le quizz
			</a>
		{/if}
	</div>
</div>
