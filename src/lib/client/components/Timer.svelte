<script lang='ts'>
	import { onDestroy, onMount } from "svelte";
	import { TimerController } from "../game/controllers/timerController.svelte";
    
    let {duration, callback} = $props()
    
    const DURATION : number = duration
	let interval : number 
    let endTime : number
    let timerController

    onMount(async()=>{
        timerController = new TimerController(duration)

        const storedEndTime = localStorage.getItem("endTimer")
        
        if (storedEndTime){
            endTime = parseInt(storedEndTime)
        } else {
            endTime = await timerController.getEndTime()
			localStorage.setItem("endTimer", endTime.toString())
        }

        startTimer()
    })

    onDestroy(()=>{
        clearInterval(interval)
        localStorage.removeItem("endTimer")
    })

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
			clearInterval(interval);
			localStorage.removeItem("endTimer");
			callback
		}
	}

</script>

<div>
    <progress
        class:end={duration < 6}
        class:soonEnd={duration < 16 && duration >= 6}
        max={DURATION}
        value={duration}>
    </progress>
   
</div>

<style>
    progress {
        height: 20px;
        border-radius: 10px;
        appearance: none;
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