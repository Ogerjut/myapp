<script lang='ts'>
	
	import { useTarotContext } from "../game/context/tarotContext.svelte";
	import Card from "./Card.svelte";
	import Timer from "./Timer.svelte";

    const tarotContext = useTarotContext()
    const table = $derived(tarotContext.table)
    const socket = $derived(tarotContext.socket)


</script>

<div id="poignee-container">
    <Timer duration={10} callback={socket.emit("endShowPoignee", table._id) } />
     
    {#each Object.entries(table.gameState.poignees) as [username, cards], ind}
        <p>Poignée de <strong>{username}</strong> ({cards.length})</p>
        <div id="card-area">
        {#each cards as card}
            <Card value={card.value} suit={card.suit}/>
        {/each}
        </div>
    {/each}
   

</div>



<style>

    #card-area{
        display: flex;
        flex-direction: row;
        padding: 10px;
        border-radius: 15px;
        justify-items: center;
        justify-content: center;
    }

    #poignee-container{
        background-color: var(--color-bg-box);
        align-items: stretch;
        justify-items: center;
        padding: 10px;
        border-radius: 15px;

    }
</style>