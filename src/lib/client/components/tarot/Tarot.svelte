
<script lang='ts'>
    import ActivePlayerPanel from '$lib/client/components/ActivePlayerPanel.svelte';
	import { onMount } from 'svelte';
    import { beforeNavigate, goto} from '$app/navigation'
    import { useOpponents } from '$lib/client/game/updateOpponents.svelte.js'
    import PlayerSeat from '$lib/client/components/tarot/PlayerSeat.svelte';
	import Table from '$lib/client/components/Table.svelte';
    import Card from '$lib/client/components/tarot/Card.svelte'
	import { listenerSocket } from '$lib/client/game/core/listenerSocket.svelte';
	import { useTarotContext } from '$lib/client/game/context/tarotContext.svelte';
	import { listenerSocketTarot } from '$lib/client/game/tarot/listenerSocketTarot.svelte';
	import Bet from './Bet.svelte';
	import SetupChien from './SetupChien.svelte';
	import PoigneeChelem from './PoigneeChelem.svelte';
	import ShowPoignee from './ShowPoignee.svelte';
	import Round from '../Round.svelte';
	import EndGame from '../EndGame.svelte';
	import Modale from '../Modale.svelte';

    let tarotContext = useTarotContext()
    
    let game = "tarot"
    let userId = $derived(tarotContext.user.id || tarotContext.user._id)
    let tableId = $derived(tarotContext.table._id)
    let socket = $derived(tarotContext.socket)

    // $inspect("tarot / user", tarotContext.user.tarot)
    // $inspect("tarot / table", tarotContext.table)
    // $inspect("table state : ", tarotContext.table.state)

    let opponents = $derived(useOpponents())

    let dialog = $state()

    onMount(() => {
        console.log('Tarot.svelte mounted')
        socket.emit("joinTable", userId, tableId, game)
        
        const cleanupCore = listenerSocket (tarotContext, game)
        const cleanupTarot = listenerSocketTarot(tarotContext)

        return () => {
            cleanupCore()
            cleanupTarot()
        }
    })

    beforeNavigate((nav)=>{
        if (nav.type === "leave" || nav.type === "goto") return
        if (tarotContext.table.state !== "created"){
            Object.assign(tarotContext.url, nav.to?.url.pathname)
            // console.log(dialog)
            // dialog.showModal()
            socket.emit("leaveAllTable", tableId, game)
           
        }
        if (tarotContext.table.state === "created" && !nav.to?.url.pathname.startsWith("/tarot/")){
            socket.emit("leaveTable", tableId, userId, nav.to?.url.pathname, game) 
        }
    })
    
    // if (browser) {
    //     window.addEventListener("beforeunload", () => {
    //     if (tarotContext.table.state === "created") return 
    //     if (tarotContext.table.state !== "created") {
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
        <i>{tarotContext.table.state} mode</i>
        <p>Round : {tarotContext.table.gameState.round} / {tarotContext.table.roundMax} </p>
        <Table/>
        <PlayerSeat {opponents} />
    
        <div style="grid-area: 2 / 2;">
            {#if !tarotContext.table.ready }
                <ActivePlayerPanel context={tarotContext} {game}/>
            {/if}
            {#if tarotContext.table.ready && tarotContext.table.state === 'bet'}
                <div id='bet-container'>
                    <Bet />
                </div>
               
            {/if}
            {#if tarotContext.table.ready && tarotContext.table.state === 'setupChien' && tarotContext.table.gameState.actualBet < 3}
                <div id='chien-container'>
                    <SetupChien/>
                </div>
               
            {/if}
            {#if tarotContext.table.ready && tarotContext.table.state === 'beforeGame'}
                    <PoigneeChelem />
            {/if}
            {#if tarotContext.table.ready && tarotContext.table.state === 'showPoignee'}
                    <ShowPoignee />
            {/if}
            {#if tarotContext.table.ready && tarotContext.table.state === 'game'}
                    <Round context={tarotContext} />
            {/if}
            {#if tarotContext.table.completed && tarotContext.table.state === 'endGame'}
                    <EndGame {game} context={tarotContext} />
            {/if}
        
        </div>
        
    </div>
    
    
    {#if tarotContext.user.tarot?.hand}
        <div id="hand-area">
        {#each tarotContext.user.tarot?.hand as card}
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

    #chien-container{
        background: var(--color-bg-box);
        padding: 10px;
        border:var(--border-4);
        border-radius: 15px;
        justify-items: center;
        justify-content: center;
        
        
    }
    
</style>