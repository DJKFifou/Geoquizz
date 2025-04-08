<script lang="ts">
	const { category, difficulty, timer, play } = $props();
	let withTimer: boolean = $state(false);
	let timerValue: number = $state(10);

	const handleTimerChange = (event: Event) => {
		withTimer = (event.target as HTMLInputElement).value === 'withTimer';
	};

	const startGame = () => {
		play(withTimer, timerValue);
	};
</script>

<div class="flex h-full w-full flex-col items-center justify-center bg-gray-800 text-white">
	<div class="z-10 flex flex-col items-center justify-center gap-6">
		<h1 class="text-3xl font-bold">Règles du jeu :</h1>
		<h3>Vous avez choisi le niveau « {difficulty} » de la catégorie « {category} »</h3>
		<div class="flex flex-col gap-4">
			<h4>Les règles du jeu sont les suivantes :</h4>
			<ul class="list-disc pl-6">
				<li>Trouver la bonne réponse parmi les propositions.</li>
				<li>Chaque bonne réponse vous rapporte 1 point.</li>
				<li>Le jeu se termine après 20 questions.</li>
				<li>Faites le meilleur score possible et battez votre record !</li>
			</ul>
			<p>Bonne chance et bon courage ! 😉</p>
		</div>
		<div class="flex flex-col gap-4">
			<h5>Voulez-vous mettre un timer ?</h5>
			<div>
				<div>
					<input
						type="radio"
						id="withoutTimer"
						name="timer"
						value="withoutTimer"
						checked
						onchange={handleTimerChange}
					/>
					<label for="withoutTimer">Non</label>
				</div>
				<div>
					<input
						type="radio"
						id="withTimer"
						name="timer"
						value="withTimer"
						onchange={handleTimerChange}
					/>
					<label for="withTimer">Oui</label>
				</div>
			</div>
			{#if withTimer}
				<div class="flex flex-col gap-2">
					<label for="timer">Durée du timer :</label>
					<div class="flex gap-2">
						<input
							class="text-black"
							type="number"
							id="timer"
							name="timer"
							bind:value={timerValue}
						/>
						<p>secondes</p>
					</div>
				</div>
			{/if}
		</div>
		<button
			onclick={startGame}
			class="flex items-center justify-center rounded-5xl border-2 border-grey/30 bg-white px-6 py-4 text-grey transition-all duration-300 hover:bg-white/80"
			>Jouer</button
		>
	</div>
</div>
