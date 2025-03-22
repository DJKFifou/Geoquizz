<script>
	const { categorie, difficulty, timer, play } = $props();
</script>

<div class="h-full w-full">
	<h1>Règle du jeu :</h1>
	<h3>Vous avez choisi le niveau {difficulty} de la catégorie {categorie}</h3>
	<div>
		<h4>Les règles du jeu sont les suivantes :</h4>
		<ul></ul>
	</div>
	<div>
		<h5>Voulez-vous mettre un timer ?</h5>
		<div>
			<div>
				<label for="withoutTimer">Non</label>
				<input type="radio" id="withoutTimer" checked />
			</div>
			<div>
				<label for="withTimer">Oui</label>
				<input type="radio" id="withTimer" />
			</div>
		</div>
	</div>
	<button onclick={play}>Jouer</button>
	<p></p>
</div>
