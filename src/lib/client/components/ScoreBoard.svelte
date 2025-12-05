<script lang='ts'>
	import { onMount } from "svelte";
	import { useTarotContext } from "../game/context/tarotContext.svelte";

    let {game} = $props()

    const tarotContext = useTarotContext()
    const tableId = $derived(tarotContext.table._id)
    
    let users = $state()
    let max = $state()

    async function fetchActiveUsers() {
        const res = await fetch(`/${game}/${tableId}`);
        users = await res.json();
    }

    onMount(()=> {
        fetchActiveUsers()
    })

    function getHigherScore(){
        let scores = users.map(user => user.score[game] )
        max = Math.max(scores, 0)
    }


</script>


<table id="score-board">
    <!-- <caption> <u> Score : </u> </caption> -->
    <tbody>
        {#each users as user}
            <tr class:winner={user.score[game]=== max}>
                <th>{user.username} : </th> <td>{user.score[game]} pts </td> 
            </tr>
        {/each}
    </tbody>
</table>


<style>
    #score-board{
        background-color: white;
        border-collapse: separate;
        border-radius:  15px;
    
    }

    th, td {
        padding: 10px;
    }

    .winner{
        background-color: lightgreen;
    }
</style>

