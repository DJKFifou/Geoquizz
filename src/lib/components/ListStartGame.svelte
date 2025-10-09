<script lang="ts">
	const { category, play } = $props();

	const categories: Record<string, string> = {
		capitals: 'la capitale',
		flags: 'le drapeau',
		countries: 'le nom',
		usaCapitals: 'la capitale',
		usaStates: "l'état",
		usaFlags: 'le drapeau',
		frenchCountyTowns: 'le chef-lieu',
		frenchDepartments: 'le département'
	};

	const categoriesName: Record<string, string> = {
		capitals: 'Capitales',
		countries: 'Pays',
		flags: 'Drapeaux',
		general_knowledge: 'Culture générale',
		usaCapitals: 'Capitales des USA',
		usaStates: 'États des USA',
		usaFlags: 'Drapeaux des USA',
		frenchCountyTowns: 'Chefs-lieux français',
		frenchDepartments: 'Départements français'
	};

	const startGame = () => {
		play();
	};
</script>

<div class="flex h-full w-full flex-col items-center justify-center bg-gray-800 text-white">
	<div class="z-10 flex flex-col items-center justify-center gap-6">
		<h1 class="text-3xl font-bold">Règles du jeu :</h1>
		<h3>Vous avez choisi la catégorie « {categoriesName[category]} »</h3>
		<div class="flex flex-col gap-4">
			<h4>Les règles du jeu sont les suivantes :</h4>
			<ul class="list-disc pl-6">
				<li>Trouvez {categories[category]} de tous les pays.</li>
				<li>Chaque bonne réponse vous rapporte 1 point.</li>
				<li>
					Le jeu se termine au bout de 15 minutes ou lorsque vous avez trouvé {categories[
						category
					]}
					de chaque pays.
				</li>
				<li>Vous pouvez retirer le timer et abandonner la partie si vous le souhaitez.</li>
				<li>Faites le meilleur score possible et battez votre record !</li>
			</ul>
			<p>Bonne chance et bon courage ! 😉</p>
		</div>
		<button
			onclick={startGame}
			class="flex items-center justify-center rounded-5xl border-2 border-grey/30 bg-white px-6 py-4 text-grey transition-all duration-300 hover:bg-white/80"
			>Jouer</button
		>
	</div>
</div>
