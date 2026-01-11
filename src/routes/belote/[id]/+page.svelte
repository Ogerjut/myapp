<script lang="ts">
	import { setBeloteContext } from '$lib/client/game/context/beloteContext.svelte.js';
	import { socket } from '$lib/client/socket.js';
    import Belote from "$lib/client/components/belote/Belote.svelte"
    
    let {data} = $props()

    let game = $state({
        user : data.user,
        table : data.table,
        socket : socket,
    })

    setBeloteContext(game)
</script>

<Belote />

    

