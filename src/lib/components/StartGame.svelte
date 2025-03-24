<script lang="ts">
	const { categorie, difficulty, timer, play } = $props();
	let withTimer: boolean = false;

	const handleTimerChange = (event: Event) => {
		withTimer = (event.target as HTMLInputElement).value === 'withTimer';
	};

	const startGame = () => {
		play(withTimer);
	};
</script>

<div class="flex h-full w-full flex-col items-center justify-center bg-gray-800 text-white">
	<div class="z-10 flex flex-col items-center justify-center gap-6">
		<h1 class="text-3xl font-bold">Règles du jeu :</h1>
		<h3>Vous avez choisi le niveau {difficulty} de la catégorie {categorie}</h3>
		<div class="flex flex-col gap-4">
			<h4>Les règles du jeu sont les suivantes :</h4>
			<ul class="list-disc pl-6">
				<li>Trouver la bonne réponse parmi les propositions</li>
				<li>Chaque bonne réponse vous rapporte 1 point</li>
				<li>Le jeu se termine après 20 questions</li>
				<li>Faites le meilleur score possible et battez votre record !</li>
			</ul>
			<p>Bonne chance et bon courage ! 😉</p>
		</div>
		<div>
			<h5>Voulez-vous mettre un timer ?</h5>
			<div>
				<div>
					<label for="withoutTimer">Non</label>
					<input
						type="radio"
						id="withoutTimer"
						name="timer"
						value="withoutTimer"
						checked
						onchange={handleTimerChange}
					/>
				</div>
				<div>
					<label for="withTimer">Oui</label>
					<input
						type="radio"
						id="withTimer"
						name="timer"
						value="withTimer"
						onchange={handleTimerChange}
					/>
				</div>
			</div>
		</div>
		<button
			onclick={startGame}
			class="flex items-center justify-center rounded-5xl border-2 border-grey/30 bg-white px-6 py-4 text-grey transition-all duration-300 hover:bg-white/80"
			>Jouer</button
		>
	</div>
</div>
