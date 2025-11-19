
<script lang='ts'>
    import ActivePlayerPanel from '$lib/client/components/ActivePlayerPanel.svelte';
	import { onMount } from 'svelte';
    import { beforeNavigate} from '$app/navigation'
    import { useOpponents } from '$lib/client/game/updateOpponents.svelte.js'
	import {useTarotContext} from '../game/context/tarotContext.svelte'
    import PlayerSeat from '$lib/client/components/PlayerSeat.svelte';
	import Table from '$lib/client/components/Table.svelte';
    import Card from '$lib/client/components/Card.svelte'
	import { listenerSocketTarot } from '../game/listenerSocketTarot.svelte';
	import Bet from './Bet.svelte';
	import SetupChien from './SetupChien.svelte';
	import Round from './Round.svelte';
	import EndGame from './EndGame.svelte';
	import ScoreBoard from './ScoreBoard.svelte';

    let tarotContext = useTarotContext()
    
    let userId = $derived(tarotContext.user.id || tarotContext.user._id)
    let tableId = $derived(tarotContext.table._id)
    let socket = $derived(tarotContext.socket)

    $inspect("tarot / user", tarotContext.user)
    $inspect("tarot / table", tarotContext.table)

    let opponents = $derived(useOpponents())

    // faire un useTarot pour tout le jeu de tarot 
    // dans lib, fichiers .svelte.js 
    //  passer la logique métier coté lib/server 
    // useBet aussi dans client/game .svelte.js 

    onMount(() => {
        // listeners pour loading game / bet / start game...
        // peut etre faire un composant InstallingPlayer
        // Bet, startGame... en fonction du table.state 
        // pour alléger composant Tarot
        
        socket.emit("joinTable", userId, tableId)
        listenerSocketTarot(socket, tableId, userId)

        return ()=> {
            socket.off("leaveAllTable")
            socket.off("tableLeft")
            socket.off("setUserTarot")
            socket.off("updateTable")
            socket.off("startBet")
            socket.off("connect")
            socket.off("newBetTurn")
        }
    })

    beforeNavigate((nav)=>{
        if (nav.type === "leave" || nav.type === "goto") return
        if (tarotContext.table.state !== "created"){
            Object.assign(tarotContext.url, nav.to?.url.pathname) 
            socket.emit("leaveAllTable", tableId)
        }
        if (tarotContext.table.state === "created" && !nav.to?.url.pathname.startsWith("/table/")){
            socket.emit("leaveTable", tableId, userId, nav.to?.url.pathname) 
        }
    })

</script>

<!-- faire un composant pour 4joueurs et 5joueurs (plus tard) -->
<!-- utiliser context au lieu prop drilling dans composants enfants -->
<div id="game-area">
    <i>{tarotContext.table.state} mode</i>
    <Table/>
    <PlayerSeat {opponents} />
    <ScoreBoard/>

    <div style="grid-area: 2 / 2;">
        {#if !tarotContext.table.ready }
            <ActivePlayerPanel/>
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
        {#if tarotContext.table.ready && tarotContext.table.state === 'game'}
                <Round />
        {/if}
        {#if tarotContext.table.completed && tarotContext.table.state === 'endGame'}
                <EndGame />
        {/if}
    
    </div>
    

</div>

<div id="hand-area">
    {#each tarotContext.user.tarot?.hand as card}
        <Card value={card.value} suit={card.suit}/> 
    {/each}
</div>

<style>
    #game-area{
            display: grid;
            border: 2px solid black;
            grid-template-columns: 0.1fr 0.1fr 0.1fr;
            grid-template-rows: 0.1fr 1fr 0.1fr 0.1fr;
            /* justify-items: stretch; */
            align-items: center;
            justify-items: center;
            
    }

    #hand-area {
        display : flex;
        flex-direction:row;
        flex-wrap: wrap;
        border: 1px solid black;
        background: rgb(188, 206, 216);
        margin-top: -30px;
        height: 126px;
        
        
    }

    #bet-container {
        display: flex;
        align-items: center;
        gap : 3px;
    }

    #chien-container{
        background: white;
        padding: 10px;
        border: 1px solid black;
        border-radius: 15px;
        justify-items: center;
        justify-content: center;
        
        
    }
    
</style>