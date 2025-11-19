<script lang='ts'>
	import { onDestroy, onMount } from "svelte";
    let {duration, callback} = $props()

    // ainsi que fonction à déclencher à t=0 (bet, chien, tour de jeu...)
	let interval = $state()
    const DURATION = duration

    onMount(()=>{
        startTimer()
    })

    onDestroy(()=>{
        clearInterval(interval)
        interval = null
    })

    function startTimer(){
        interval = setInterval(()=>{
            duration--
            if (duration <= 0){
                clearInterval(interval)
                callback
            }
        }, 1000)
    }

</script>

<div>
    <progress max={DURATION} value={duration}></progress>
</div>

<!-- <style>
    progress{
       
    }
</style> -->