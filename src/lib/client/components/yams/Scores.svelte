<script>
    import { useYamsContext } from "$lib/client/game/context/yamsContext.svelte";
	import { useOpponents } from "$lib/client/game/updateOpponents.svelte";
	import Item from "./Item.svelte";
    
    let opponents = $derived(useOpponents())
    
    const yamsContext = useYamsContext()
    const user = $derived(yamsContext.user)
    const table = $derived(yamsContext.table)
    const state = $derived(table.state)
    let players = $derived([user, ...opponents])
    const playersLoaded = $derived(players.every(p => p.yams?.items?.length === 13))

    // $inspect(players)

    const tableRow1 = [
        "1", "2", "3", "4", "5", "6",
    ]
    const tableRow2 = [
        "brelan", "carré", "full", "petite suite", "grande suite", "yam's", "chance"
    ]
</script>

{#if playersLoaded}
    <table>
        <thead>
            <tr>
                <th></th> 
                {#each players as player}
                    <th>{player.username}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each tableRow1 as item, key }
                <tr>
                    <th class="item">
                        <p>{item}</p>
                    </th>
                    {#each players as player (`${player._id}-${key}-${player.yams.launches}`) }
                        <td> <Item item={player.yams?.items?.[key]} /> </td>
                    {/each}
                </tr>
            {/each}
            <tr>

                <!-- afficher bonus et total 1 si part 1 completed -->
                <th class="endGameItem">Bonus (>63)</th>
                {#if state === "endGame"}
                    {#each players as player, key}
                        <td class="endGameItem"> {player.yams.endGameItems?.hasBonus ? +35 : 0}</td>
                    {/each}
                {/if}
                
            </tr>
            <tr>
                <th class="endGameItem">Total 1</th>
                {#if state === "endGame"}
                    {#each players as player, key}
                        <td class="endGameItem"> {player.yams.endGameItems?.score1}</td>
                    {/each}
                {/if}
                
            </tr>
            {#each tableRow2 as item, key}
                <tr>
                    <th class="item">
                        <p>{item}</p>
                    </th>
                    {#each players as player (`${player._id}-${key}-${player.yams.launches}`)}
                        <td> <Item item={player.yams.items[key+tableRow1.length]} /> </td>
                    {/each}
                </tr>
            {/each}
            <tr>
                <th class="endGameItem">Total 2</th>
                {#if state === "endGame"}
                    {#each players as player, key}
                        <td class="endGameItem"> {player.yams.endGameItems?.score2}</td>
                    {/each}
                {/if}
            </tr>
            <tr>
                <th class="endGameItem">Total</th>
                {#if state === "endGame"}
                    {#each players as player, key}
                        <td class="endGameItem"> {player.yams.endGameItems?.total}</td>
                    {/each}
                {/if}
                
            </tr>
        </tbody>
    </table>
    
{/if}


<style>
    table {
        border-collapse: collapse;
        width: 100%;
        font-size: small;
        background-color: var(--color-bg-box);
    }
    
    th, td {
        border: 1px solid #ddd;
        padding: 2px;
        text-align: center;
    }
    
    thead th {
        font-weight: bold;
    }
    
    tbody th {
        text-align: center;
    }

    
    .endGameItem{
        border-width: 2px;
        /* border-color: brown; */
        color : brown;
        font-weight: bold;
    }


</style>