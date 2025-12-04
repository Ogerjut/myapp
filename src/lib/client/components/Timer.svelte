<script lang='ts'>
	import { onDestroy, onMount } from "svelte";
	import { TimerController } from "../game/controllers/timerController.svelte";
    
    let {duration, callback, key} = $props()
    
    const DURATION : number = duration
	let interval : number 
    let endTime : number
    let timerController

    window.timerInstances ??= 0;

    onMount(async()=>{

        cleanup()
        window.timerInstances++;
        console.log('Timer mounted', window.timerInstances);
        timerController = new TimerController(duration)

        const storedEndTime = localStorage.getItem(key)
        
        if (storedEndTime){
            endTime = parseInt(storedEndTime)
        } else {
            endTime = await timerController.getEndTime()
			localStorage.setItem(key, endTime.toString())
        }

        startTimer()
    })

    onDestroy(()=>{
        cleanup()
        window.timerInstances--;
        console.log('Timer destroyed', window.timerInstances)
    })

    function cleanup() {
        if (interval) {
            clearInterval(interval)
        }
        localStorage.removeItem(key)
    }

    function startTimer() {
		updateTime();

		interval = window.setInterval(() => {
			updateTime();
		}, 1000);
	}

	function updateTime() {
		const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
		duration = remaining;

		if (duration <= 0) {
			cleanup()
			callback()
		}
	}

</script>

<div>
    <progress
        class:end={duration < (duration / 4)}
        class:soonEnd={duration < (duration / 2) && duration >= (duration / 4)}
        max={DURATION}
        value={duration}>
    </progress>
   
</div>

<style>
    progress {
        border-radius: 10px;
        appearance: none;
        width : 100%;
        height: 15px;
    }

    /* webkit */
    progress::-webkit-progress-bar {
        background-color: lightgrey;
        border-radius: 10px;
    }

    progress::-webkit-progress-value {
        background-color: green;
        border-radius: 10px;
    }

    progress.end::-webkit-progress-value {
        background-color: red;
    }

    progress.soonEnd::-webkit-progress-value {
        background-color: orange;
    }

    /* firefox */
    progress::-moz-progress-bar {
        background-color: green;
    }

    progress.end::-moz-progress-bar {
        background-color: red;
    }

    progress.soonEnd::-moz-progress-bar {
        background-color: orange;
    }

</style>