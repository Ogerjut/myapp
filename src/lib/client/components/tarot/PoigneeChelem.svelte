<script>
	import { onMount } from 'svelte';
    import {useTarotContext} from '../../game/context/tarotContext.svelte'
	import Timer from '../Timer.svelte';

    let tarotContext = useTarotContext()
    const table = $derived(tarotContext.table)
    const user = $derived(tarotContext.user)
    const socket = $derived(tarotContext.socket)
    
    let hasPoignee = $state(false)
    let poigneeSize = $state()


    onMount(()=>{
        if (!user.tarot.poignee) {
            checkPoignee()
        }
       
    })

    function chelem(){
        console.log("le preneur annonce faire un chelem")
        socket.emit("chelem", table._id, user._id)
    }

    function poignee(poigneeSize){
        console.log("le preneur annonce une poignee")
        socket.emit("registerPoignee", table._id, user._id, poigneeSize)
    }

    function checkPoignee(){
        socket.emit('checkPoignee', user._id, (callback) => {
            console.log("callback check poignee :", callback)
            if (callback.hasPoignee){
                hasPoignee = true 
                poigneeSize = callback.poigneeSize
            }
        })
    }

    function skip(){
        console.log("skip / end poignée chelem")
        socket.emit("endPoigneeChelem", table._id)
    }

</script>

<div>
    <Timer duration={7} callback={() => skip()} key={`${table.gameState.currentPlayerId}`}/>
    <h1><u>Poignées & Chelem ? </u></h1>
    {#if hasPoignee}
        <button id="poignee" onclick={()=>poignee(poigneeSize)}> Poignée ({poigneeSize} atouts) </button>
    {:else}
        <p>Pas de poignée à montrer !</p>
    {/if}
    {#if user.tarot.hasTaken && !user.tarot.chelem}
        <button id="chelem" onclick={()=>chelem()}> Chelem </button>
    {/if}
    <!-- {#if user.tarot.hasTaken || hasPoignee }
        <button onclick={()=>skip()}> Passer </button>
    {/if} -->

</div>

<style>
    div{
        background-color: var(--color-bg-box);
        display: flex;
        flex-direction: column;
        padding: 15px;
        gap: 5px;
        border-radius: 15px;
    }
</style>