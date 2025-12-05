
<script lang='ts'>
    import ActivePlayerPanel from '$lib/client/components/ActivePlayerPanel.svelte';
	import { onMount } from 'svelte';
    import { beforeNavigate, goto} from '$app/navigation'
    import { useOpponents } from '$lib/client/game/updateOpponents.svelte.js'
	import {useTarotContext} from '../../game/context/tarotContext.svelte'
    import PlayerSeat from '$lib/client/components/tarot/PlayerSeat.svelte';
	import Table from '$lib/client/components/Table.svelte';
    import Card from '$lib/client/components/Card.svelte'
	import { listenerSocketTarot } from '../../game/listenerSocketTarot.svelte';
	import Bet from './Bet.svelte';
	import SetupChien from './SetupChien.svelte';
	import Round from './Round.svelte';
	import EndGame from '../EndGame.svelte';
	import ScoreBoard from '../ScoreBoard.svelte';
	import { browser } from '$app/environment';
	import PoigneeChelem from './PoigneeChelem.svelte';
	import ShowPoignee from './ShowPoignee.svelte';
	import Modale from '../Modale.svelte';

    let tarotContext = useTarotContext()
    
    let game = "tarot"
    let userId = $derived(tarotContext.user.id || tarotContext.user._id)
    let tableId = $derived(tarotContext.table._id)
    let socket = $derived(tarotContext.socket)

    // $inspect("tarot / user", tarotContext.user.tarot)
    // $inspect("tarot / table", tarotContext.table)
    $inspect("table state : ", tarotContext.table.state)

    let opponents = $derived(useOpponents())

    let dialog

    // faire un useTarot pour tout le jeu de tarot 
    // dans lib, fichiers .svelte.js 
    //  passer la logique métier coté lib/server 
    // useBet aussi dans client/game .svelte.js 

    onMount(() => {
        // listeners pour loading game / bet / start game...
        // peut etre faire un composant InstallingPlayer
        // Bet, startGame... en fonction du table.state 
        // pour alléger composant Tarot
        console.log('Tarot.svelte mounted')
        socket.emit("joinTable", userId, tableId)
        listenerSocketTarot(tarotContext)

        return ()=> {
            socket.off("leaveAllTable")//
            socket.off("tableLeft")//
            socket.off("setUserTarot")//
            socket.off("updateTable")//
            socket.off("startBet")//
            socket.off("connect")//
            socket.off("isPlayableCard")//
            socket.off("updateTarotContext")//
            socket.off("showPoignee")//
            socket.off("updateUser")//
            socket.off("endPlayableCard")//
        }
    })

    beforeNavigate((nav)=>{
        if (nav.type === "leave" || nav.type === "goto") return
        if (tarotContext.table.state !== "created"){
            Object.assign(tarotContext.url, nav.to?.url.pathname)
            // console.log(dialog)
            // dialog.showModal()
            socket.emit("leaveAllTable", tableId)
           
        }
        if (tarotContext.table.state === "created" && !nav.to?.url.pathname.startsWith("/tarot/")){
            socket.emit("leaveTable", tableId, userId, nav.to?.url.pathname) 
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
                    <Round />
            {/if}
            {#if tarotContext.table.completed && tarotContext.table.state === 'endGame'}
                    <EndGame {game} />
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