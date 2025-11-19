<script>
	import Dice from "./Dice.svelte";

	function launchDice(){
		
	}

</script>


<!-- grille, dés -->

<!-- grille composée d'items  -->

<!-- faire un dossier constantes pour initialiser le jeu coté server -->

<!-- dés à locker par passage ou clique souris -->


<Dice value={undefined}/>

<button onclick={()=> launchDice()}>
	Launch dices
</button>