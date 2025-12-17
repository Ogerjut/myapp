
<script>
	import { goto } from "$app/navigation";
	import { useYamsContext } from "$lib/client/game/context/yamsContext.svelte";
	import Dice from "./Dice.svelte";

    const yamsContext = useYamsContext()
    const socket = $derived(yamsContext.socket)
    const userId = $derived(yamsContext.user.id || yamsContext.user._id)
    const tableId = $derived(yamsContext.table._id)
    const user = $derived(yamsContext.user)
    const table = $derived(yamsContext.table)
    const currentPlayerId = $derived(table.gameState.currentPlayerId)
    const dicesArray = $derived(table.gameState.dices)
    const launches = $derived(user?.yams.launches)
    let userIsCurrentPlayer = $derived(currentPlayerId === userId)

    function launchDices(){
        socket.emit("launchDices", tableId, userId, dicesArray)
    }

    function quitGame(){
        socket.emit("leaveTable", tableId, userId, "/", "yams")
    }
    
</script>

<div id="table" >
    <div id="dices-container">
        {#each dicesArray as dice, key }
            <Dice id={key}  bind:selected={dice.selected} value={dice.value} {launches}/>
        {/each}
    </div>

    
</div>
<div id="user-action">
    {#if userIsCurrentPlayer}
        <button disabled={table.state === "endGame"} onclick={()=>launchDices()}>LANCER LES DÉS !</button>
        <p> Lancés restants : {user.yams.launches}</p>
    {/if}
    {#if table.state==="endGame"}
        <button onclick={()=>quitGame()}>Retour au menu</button>
    {/if}
    


</div>

<style>
    #table {
        height: 300px;
        width: 300px;
        border: 10px solid black;
        background-color: darkgreen;
        border-radius: 50%;
        align-content: center;
        margin-left: 10px;
        box-shadow: 0px 10px 10px saddlebrown;
    }

    #dices-container{
        display: flex;
        width : 100%;
        background-color: green;
        border-radius: 45%;
        /* height: 50%; */

    }

    /* #table:first-child{
        
    } */

    #user-action{
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: small;
        align-items: center;
        margin-top: 3px;
    }

    button:disabled{
        cursor:not-allowed;
        opacity: 60%;
    }

</style>