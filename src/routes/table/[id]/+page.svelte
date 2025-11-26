<script lang="ts">
	import Tarot from '$lib/client/components/Tarot.svelte'
    import { setTarotContext } from '$lib/client/game/context/tarotContext.svelte.js'
	import { socket } from '$lib/client/socket.js';
    
    let {data} = $props()

    let game = $state({
        user : data.user,
        table : data.table,
        socket : socket,
    })

    setTarotContext(game)
</script>

<Tarot />

    

