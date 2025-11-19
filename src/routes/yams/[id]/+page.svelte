<script>
	import Yams from "$lib/client/components/yams/Yams.svelte";
	import { setYamsContext } from '$lib/client/game/context/yamsContext.svelte.js'
	import { socket } from '$lib/client/socket.js';
	
	let {data} = $props()

	let game = $state({
		user : data.user,
		table : data.table,
		socket : socket
	})
	setYamsContext(game)

</script>

<Yams/>