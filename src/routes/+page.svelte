<script>
	import PrimaryBtn from '$lib/components/PrimaryLink.svelte';
	import Ping from '$lib/assets/ping.png';
</script>

<div
	class="container mx-auto flex h-svh w-full flex-col items-center justify-center gap-8 bg-gray-800 text-white"
>
	<div class="z-10 flex flex-col items-center justify-center gap-8">
		<div class="flex flex-col items-center gap-4">
			<img src={Ping} alt="Ping" />
			<h1 class="font-sans text-5xl font-bold"><span class="text-turquoise">Geo</span>Quizz</h1>
			<h4 class="text-center text-2xl font-medium">Teste tes connaissances en géographie</h4>
		</div>
		<ul class="flex gap-4">
			<li>
				<PrimaryBtn href="/quizz" name="Quizz" />
			</li>
			<li>
				<PrimaryBtn href="/lists" name="Listes" />
			</li>
		</ul>
		<a href="/stats" class="text-lg font-medium underline">Stats</a>

		<div
			class="fixed bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center text-center text-white"
		>
			<h5 class="text-sm">Version bêta</h5>
			<p class="text-xs">
				Développé par <a href="https://github.com/DJKFifou" target="_blank" class="underline"
					>Maxime Lust</a
				>
			</p>
			<p class="text-xs">
				Designé par <a href="https://www.behance.net/leilo" target="_blank" class="underline"
					>Leïly Coquard-Misono</a
				>
			</p>
		</div>
	</div>
</div>
