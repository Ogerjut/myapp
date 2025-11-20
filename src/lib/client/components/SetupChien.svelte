<script lang='ts'>
	import {useTarotContext} from '../game/context/tarotContext.svelte'
	import Card from "./Card.svelte";
	import Timer from './Timer.svelte';

    let tarotContext = useTarotContext()
    const table = $derived(tarotContext.table)
    const socket = $derived(tarotContext.socket)


    const maxCards = $derived(table.size === 2 ? 6 : 3)
    let disabledButton = $derived(tarotContext.user.tarot.cardsWon.length !== maxCards)

    const duration = 60

    function randomCard(){
        console.log("select random card")
        socket.emit("registerRandomChien", table._id, tarotContext.user._id)
    }

    function validateChien(){
        console.log("chien validé")
        socket.emit("registerChien", table._id, tarotContext.user._id)
    }

</script>

<p>Chien : </p>
<div class="chien">
    {#each table.gameState.chien as card }
        <Card value={card.value} suit={card.suit} /> 
    {/each}
</div>

{#if tarotContext.user.tarot.hasTaken}
    <Timer {duration} callback={randomCard()}/>
    <p>Nouveau chien : </p>
    <div class="chien">
        {#each tarotContext.user.tarot.cardsWon as card }
            <Card value={card.value} suit={card.suit}/> 
        {/each}
    </div>
    <button disabled={disabledButton} onclick={()=>validateChien()}> Valider </button>
{/if}



<style>
    .chien{
        gap: 3px;
        display: flex;
        flex-direction: row;
    }

    button:disabled{
        cursor: not-allowed;
        color : red;
    }
    button{
        cursor:pointer;
        color : green;
    }
</style>