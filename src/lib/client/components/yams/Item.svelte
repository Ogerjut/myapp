<script>
	import {YamsController } from "$lib/client/game/yams/controller.svelte";

    let {item} = $props()
    
    let displayValue = $state(item.done ? item.value : item.possibleValue)

    const controller = new YamsController()


</script>

<p class:notdone={!item.done}> <button disabled={item.done} onclick={()=>controller.sendPossibleValue(item)} >{displayValue}</button>   </p>

<style>
    .notdone{
        font-style: italic;
    }

    button{
        padding: 0;
        background-color: var(--color-bg-box);
        box-shadow: 0px 0px 0px;
        padding-right: 3px;
        padding-left: 3px;
    }

    button:disabled{
        cursor:default;
        /* font-size: medium; */
        font-weight: bold;
    }

    /* p{
        font-weight: bold;
    } */
</style>