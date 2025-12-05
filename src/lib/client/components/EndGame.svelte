<script lang='ts'>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { useTarotContext } from "../game/context/tarotContext.svelte";
	import { useOpponents } from "../game/updateOpponents.svelte";
	import ScoreBoard from "./ScoreBoard.svelte";

    let {game} = $props()

    const tarotContext = useTarotContext()
    const socket = $derived(tarotContext.socket)
    const table = $derived(tarotContext.table)
    const user = $derived(tarotContext.user)
    const opponents = useOpponents()

    const ranking = new Map()

    onMount(()=>{
        // trier du plus grand au petit score  ou bien surligner en vert le meilleur
        ranking.set(user.username, user.score)
        opponents.map(opponent => {
            ranking.set(opponent.username, opponent.score)
        })
        
    })

    async function backToMenu(){
        socket.emit("endGame", table._id, user._id)
        await goto('/tarot')
    }
</script>



<div>
    <span>Fin de la partie </span> 
    <ScoreBoard {game}/>
    <button onclick={() => backToMenu()}>
        Retour au menu
    </button>
    
</div>



<style>
    div{
        background-color: var(--color-bg-box);
        border-radius: 15px;
        text-align: center;
        display: flex;
        flex-direction: column;
        border: var(--border-2);
        width : 245px
        
    }

    span{
        background-color: var(--color-text);
        color : white;
        width : 100%;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        padding: 5px;
    }

    button{
        border-radius : 0px;
        border-bottom-right-radius: 13px;
        border-bottom-left-radius: 13px;
    }
</style>