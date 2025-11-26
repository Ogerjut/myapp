<script lang='ts'>
	import { onMount } from "svelte";
	import { useTarotContext } from "../game/context/tarotContext.svelte";

    const tarotContext = useTarotContext()
    const tableId = $derived(tarotContext.table._id)
    
    let users = $state()

    async function fetchActiveUsers() {
        const res = await fetch(`/table/${tableId}`);
        users = await res.json();
    }

    onMount(()=> {
        fetchActiveUsers()
    })


</script>


<table id="score-board">
    <!-- <caption> <u> Score : </u> </caption> -->
    <tbody>
        {#each users as user}
            <tr>
                <th>{user.username} : </th> <td>{user.score} pts </td> 
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
</style>

