<script lang='ts'>
	import { browser } from "$app/environment";
    import {enhance} from "$app/forms"
	import { useBeloteContext } from "$lib/client/game/context/beloteContext.svelte";
	import Timer from "../Timer.svelte";
	import Card from "./Card.svelte";

    let beloteContext = useBeloteContext ()
    const socket = $derived(beloteContext.socket)
    let table = $derived(beloteContext.table)
    let user = $derived(beloteContext.user)
    let belote = $derived(beloteContext.user.belote)
    let betRound = $derived(beloteContext.table.gameState.betRound)
    let potentialAtout = $derived(table.gameState.potentialAtout)
    
    const mapSuits = new Map()
    mapSuits.set("spade", "Pique")
    mapSuits.set("heart", "Coeur")
    mapSuits.set("diamond", "Carreau")
    mapSuits.set("club" , "Trêfle")
    mapSuits.delete(potentialAtout.suit)
    
    const duration = $state(15) //s

    function sendBet(bet, card, suit = ""){
        // console.log("bet sent : ", bet)
        socket.emit("playerHasBet", table._id, user._id, bet, card, suit)
    }

</script>

<Card value={potentialAtout.value} suit={potentialAtout.suit}/>
<div id="bet">
    <!-- {#if belote.isSpeaker && browser}
      <Timer {duration} callback={() => sendBet(0)}/>
    {/if} -->
    
    <p> {belote.isSpeaker ? "Choisis ton annonce ! " : "Ce n'est pas ton tour !"} </p>
    <div id="buttons">
        <button disabled = {!belote.isSpeaker} onclick={()=>sendBet(0, potentialAtout)}> Passer </button>
        {#if betRound === 1 }
            <button disabled = {!belote.isSpeaker} onclick={()=>sendBet(1, potentialAtout)}> Prendre </button>
        {:else if betRound === 2}
            {#each mapSuits.entries() as [key, val]}
            <button disabled = {!belote.isSpeaker} onclick={()=>sendBet(1, potentialAtout, key)}> {val} </button>
            {/each}
        {/if}
    </div>
    
        

</div>

<style>
    #bet {
        display : flex; 
        background: var(--color-bg-box);
        padding: 10px;
        border: var(--border-4);
        border-radius: 10px;
        align-items: center;
        flex-direction: column;
        color : var(--color-text-2)

    }
    
    button:disabled{
      cursor:not-allowed;
    }

    #buttons{
        display: flex;
        flex-direction: column-reverse;
        gap: 4px;
    }
  
</style>