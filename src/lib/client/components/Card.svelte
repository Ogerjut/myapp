<script lang='ts'>
	import { fade, fly } from "svelte/transition";
	import { useTarotContext } from "../game/context/tarotContext.svelte";
	import { CardController } from "../game/controllers/cardsController.svelte";

    let {value, suit} = $props()
    
    let tarotContext = useTarotContext()
    const isPlayableCard = $derived(tarotContext.isPlayableCard)
    const activeCard = $derived(tarotContext.activeCard)
    const controller = new CardController()
    
    let mapValue = {
        14 : "R",
        13 : "D",
        12 : "C",
        11 : "V",
    }
    let mapSuit = {
        spade : "&#9824", 
        heart : "&#9829",
        diamond : "&#9830", 
        club : "&#9827"
    }
    
    let color = $derived((suit === "heart" || suit === "diamond") ? "red" : suit === "atout" ? 'blue' : 'black')

    $effect( ()=> {
        const isActiveCard = value === activeCard?.value && suit === activeCard?.suit
        if (isActiveCard && isPlayableCard ){
            controller.onPlayableCard({value, suit})
        }
    })
    
    
</script>

    <div class="card"
        style="--color : {color}"
        aria-roledescription="button-card"
        onmousedown={() => controller.onCardClick({value, suit})}
        class:playable={isPlayableCard}
        class:invalid={isPlayableCard === false}
        transition:fly={{ y: -100, duration: 1000 }}

    >
        <p>{suit != "atout" && mapValue[value] || value}</p>
        <p id='suit'> {@html mapSuit[suit]}</p>
    </div>

<style>
    
    .card{
        background:white;
        color : var(--color);
        width: 58px;
        height: 100px;
        border: 2px solid var(--color);
        padding: 2px;
        border-radius: 5px;
        font-size: large;
        cursor: grab;
        align-self: center;
    }

    #suit{
        justify-self: center;
        font-size: xx-large;
    }

    .card:active{
        cursor:grabbing
    }

    .card:hover{
        zoom: 1.2;
        border: 3px solid var(--color);
    }


</style>