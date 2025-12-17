<script>
	import { useYamsContext } from "$lib/client/game/context/yamsContext.svelte";
	import { onMount } from "svelte";
	import { listenerSocketYams } from "$lib/client/game/yams/listenerSocketYams.svelte";
	import { listenerSocket } from "$lib/client/game/core/listenerSocket.svelte";
	import Arena from "./Arena.svelte";
	import Scores from "./Scores.svelte";
	import ActivePlayerPanel from "../ActivePlayerPanel.svelte";
	import { beforeNavigate } from "$app/navigation";

	const game = "yams"
	const yamsContext = useYamsContext()
	const socket = $derived(yamsContext.socket)
    const userId = $derived(yamsContext.user.id || yamsContext.user._id)
    const tableId = $derived(yamsContext.table._id)

	const table = $derived(yamsContext.table)
    const state = $derived(table.state)

	// $inspect("yams / user", yamsContext.user)
	// $inspect("yams / user.yams.items", yamsContext.user.yams.items)
	// $inspect("yams / table", yamsContext.table)

	onMount(() => {
		console.log('Yams.svelte mounted')
		
		socket.emit("joinTable", userId, tableId, game)
		
		const cleanupCore = listenerSocket(yamsContext, game)
		const cleanupYams = listenerSocketYams(yamsContext)

		return ()=> {
			cleanupCore()
			cleanupYams()
			
		}
	})

	beforeNavigate((nav)=>{
		// console.log(nav.type)
        if (nav.type === "leave" || nav.type === "goto") return
        if (!nav.to?.url.pathname.startsWith("/yams/")){
            socket.emit("leaveTable", tableId, userId, nav.to?.url.pathname, game) 
        }
    })
    
    // if (browser) {
    //     window.addEventListener("beforeunload", () => {
    //     if (yamsContext.table.state === "created") return 
    //     if (yamsContext.table.state !== "created") {
    //         console.log("before unload triggered")
    //         socket.emit("leaveAllTable", tableId)
    //     }
    // });
    // }

</script>

<div id="game-container">
	{#if !yamsContext.table.ready }
        <ActivePlayerPanel context={yamsContext} {game}/>
    {/if}

	{#if yamsContext.table.ready}
		<div id="game-arena">
			<Arena/>
		</div>
		<div id="scores">
			<Scores />	
		</div>
    {/if}
</div>


<style>
	#game-container{
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: center;
		gap: 10px;
	}
</style>