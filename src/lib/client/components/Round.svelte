<script lang='ts'>
	
	import { useTarotContext } from "../game/context/tarotContext.svelte";
	import Card from "./Card.svelte";

    const tarotContext = useTarotContext()
    const table = $derived(tarotContext.table)


</script>

<div id="card-area">
    {#each Object.values(table.gameState.pli) as card }
        <Card value={card.value} suit={card.suit} /> 
    {/each}
</div>

<style>

#card-area{
    /* background: white; */
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-radius: 15px;
    justify-items: center;
    justify-content: center;
    width: 300px;
    height:150px
}
</style>