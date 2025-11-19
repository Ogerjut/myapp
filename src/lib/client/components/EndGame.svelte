<script lang='ts'>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { useTarotContext } from "../game/context/tarotContext.svelte";
	import { useOpponents } from "../game/updateOpponents.svelte";
	import ScoreBoard from "./ScoreBoard.svelte";

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
        await goto('/')
    }
</script>



<div>
    End Game
    <ScoreBoard/>
    
</div>

<button onclick={() => backToMenu()}>
    Back to menu
</button>