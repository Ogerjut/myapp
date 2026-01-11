
<script lang='ts'>
    import ActivePlayerPanel from '$lib/client/components/ActivePlayerPanel.svelte';
	import { onMount } from 'svelte';
    import { beforeNavigate, goto} from '$app/navigation'
    import { useOpponents } from '$lib/client/game/updateOpponents.svelte.js'
    import PlayerSeat from '$lib/client/components/belote/PlayersSeats.svelte';
	import Table from '$lib/client/components/Table.svelte';
	import { listenerSocket } from '$lib/client/game/core/listenerSocket.svelte';
	import { useBeloteContext } from '$lib/client/game/context/beloteContext.svelte';

	import Bet from './Bet.svelte';
	import Round from '../Round.svelte';
	import EndGame from '../EndGame.svelte';
	import Modale from '../Modale.svelte';
	import { listenerSocketBelote } from '$lib/client/game/belote/listenerSocketBelote.svelte';
	import Card from './Card.svelte';

    let beloteContext = useBeloteContext()
    
    let game = "belote"
    let userId = $derived(beloteContext.user.id || beloteContext.user._id)
    let tableId = $derived(beloteContext.table._id)
    let socket = $derived(beloteContext.socket)

    $inspect("user.belote", beloteContext.user.belote)
    $inspect("belote / table", beloteContext.table)
    // $inspect("table state : ", beloteContext.table.state)

    let opponents = $derived(useOpponents())

    let dialog

    onMount(() => {
        console.log('Belote.svelte mounted')
        socket.emit("joinTable", userId, tableId, game)
        
        const cleanupCore = listenerSocket(beloteContext, game)
        const cleanupBelote = listenerSocketBelote(beloteContext)

        return () => {
            cleanupCore()
            cleanupBelote()
        }
    })

    beforeNavigate((nav)=>{
        if (nav.type === "leave" || nav.type === "goto") return
        if (beloteContext.table.state !== "created"){
            Object.assign(beloteContext.url, nav.to?.url.pathname)
            // console.log(dialog)
            // dialog.showModal()
            socket.emit("leaveAllTable", tableId, game)
           
        }
        if (beloteContext.table.state === "created" && !nav.to?.url.pathname.startsWith("/belote/")){
            socket.emit("leaveTable", tableId, userId, nav.to?.url.pathname, game) 
        }
    })
    
    // if (browser) {
    //     window.addEventListener("beforeunload", () => {
    //     if (beloteContext.table.state === "created") return 
    //     if (beloteContext.table.state !== "created") {
    //         console.log("before unload triggered")
    //         socket.emit("leaveAllTable", tableId)
    //     }
    // });
    // }

    function quitTable(){
        console.log("leave table from dialog")
        socket.emit("leaveAllTable", tableId)
    }
    
</script>

<!-- faire un composant pour 4joueurs et 5joueurs (plus tard) -->
<div id="game-container">
    <div id="table-area">
        <i>{beloteContext.table.state} mode</i>
        <Table/>
        <PlayerSeat {opponents} />
    
        <div style="grid-area: 2 / 2;">
            {#if !beloteContext.table.ready }
                <ActivePlayerPanel context={beloteContext} {game}/>
            {/if}
            {#if beloteContext.table.ready && beloteContext.table.state === 'bet'}               
                <div id='bet-container'>
                    <Bet />
                </div>
               
            {/if}
            {#if beloteContext.table.ready && beloteContext.table.state === 'game'}
                    <Round context={beloteContext} />
            {/if}
            {#if beloteContext.table.completed && beloteContext.table.state === 'endGame'}
                    <EndGame {game} context={beloteContext} />
            {/if}
        
        </div>
        
    </div>
    
    
    {#if beloteContext.user.belote?.hand}
        <div id="hand-area">
        {#each beloteContext.user.belote?.hand as card}
            <Card value={card.value} suit={card.suit}/> 
        {/each}
        </div>
    {/if}
        
   

</div>

<Modale
    bind:dialog
    text={"Veux-tu vraiment quitter la table en cours ?"}
    action={"Quitter la table"}
    onaction={()=>quitTable()}
    />


<style>
    #table-area{
        display: grid;
        grid-template-columns: 0.1fr 0.1fr 0.1fr;
        grid-template-rows: 0.1fr 1fr 0.1fr 0.1fr;
        align-items: center;
        justify-items: center;
        
    }

    #hand-area {
        display : flex;
        flex-direction:row;
        padding: 3px;
        border-radius: 5px;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
        background: var(--color-bg-box);
        margin-top: -22px;
        border : var(--border-4);
        min-height : 112px;
        
        
    }


    #bet-container {
        display: flex;
        align-items: center;
        gap : 3px;
    }


    
</style>