<script lang='ts'>
	import { fade, fly } from "svelte/transition";

    let {value, suit} = $props()

    // let tarotContext = useTarotContext()
    // const isPlayableCard = $derived(tarotContext.isPlayableCard)
    // const activeCard = $derived(tarotContext.activeCard)
    const controller = null

    let mapValue = {
        14 : "A",
        13 : "10",
        12 : "R",
        11 : "D",
        10 : "V"
    }
    let mapSuit = {
        spade : "&#9824", 
        heart : "&#9829",
        diamond : "&#9830", 
        club : "&#9827"
    }
    
    let displayValue =  mapValue[value] || value
    let displaySuit = $derived(mapSuit[suit]) 

    let color = $derived((suit === "heart" || suit === "diamond") ? "#CC0000" : suit === "atout" ? '#0000CC' : 'black')

    // $effect( ()=> {
    //     const isActiveCard = value === activeCard?.value && suit === activeCard?.suit
    //     if (isActiveCard && isPlayableCard ){
    //         controller.onPlayableCard()
    //     }
    // })
    
    
</script>

    <div
        role="button"
        tabindex=0
        class="card"
        style="--color : {color};"
        onmousedown={() => controller?.onCardClick({value, suit})}
        transition:fly={{ y: -100, duration: 1000 }}

    >
        <p id="value">{displayValue}</p>
        <p id='suit'> {@html displaySuit}</p>
    </div>

<style>
    
    .card{
        background:white;
        color : var(--color);
        width: 58px;
        height: 100px;
        border: 2px solid var(--color);
        padding: 2px;
        border-radius: 6px;
        font-size: x-large;
        font-weight: bold;
        cursor: grab;
        align-self: center;
        margin-top : 6px;
        margin-bottom : 6px;
        font-family: 'Kurale';
       
        
    }

    .card:not(:first-child) {
        margin-left: -21px; /* seulement pour les suivantes */
    }

    #suit{
        font-size:32px;
        margin-top: -10px;
    }

    .card:active{
        cursor:grabbing
    }

    .card:hover{
        margin-top : 0px;
        margin-bottom : 0px;
        zoom: 1.1;
        border: 3px solid var(--color);
    }

  


</style>