<script>
	const { data } = $props();
</script>

<div class="max-h-[60svh] overflow-scroll">
	<table class="w-full border-collapse">
		<thead>
			<tr class="border-b border-gray-300">
				{#if data[0].image}
					<th scope="col" class="text-center">Image</th>
				{/if}
				<th scope="col" class="text-center">Question</th>
				<th scope="col" class="text-center">Options (4)</th>
				<th scope="col" class="text-center">Réponse</th>
				<th scope="col" class="text-center">Réponse donnée</th>
				<th scope="col" class="text-center">Correct ?</th>
			</tr>
		</thead>
		<tbody class="space-y-4">
			{#each data as answer}
				<tr class="border-b border-gray-300">
					{#if answer.image}
						<td class="text-center">
							<img
								src={answer.image}
								alt={answer.answer}
								class="mx-auto h-20 w-20 object-contain"
							/>
						</td>
					{/if}
					<td class="text-center">{answer.question}</td>
					<td class="flex justify-center gap-2">
						{#each answer.options as option}
							<span class="text-center">{option}</span>
						{/each}
					</td>
					<td class="text-center">{answer.question}</td>
					<td class="text-center">{answer.selectedOption || 'Null'}</td>
					{#if answer.isAnswerCorrect}
						<td class="text-center text-green-500">Oui</td>
					{:else}
						<td class="text-center text-red-500">Non</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
