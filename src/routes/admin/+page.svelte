<script lang='ts'>
	import { enhance } from '$app/forms';

    let {data} = $props()
    let {users, tarotTables} = $state(data)

    let showUsers = $state(true)
    let showTarotTables = $state(false)
    let searchTerm = $state("")

    let filteredUsers = $derived(
        users?.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    // ajouter possibilité de modifier un role d'un joueur (sauf si admin ou role supérieur)
    // clic sur lien table goto(table.id) mode spectateur
    // bouton raffraichissmeent data (fetch encore)

</script>

<button onclick={()=>showUsers = !showUsers}> {showUsers ? "Cacher joueurs" : "Afficher joueurs" }   </button>
<div id="users">
    {#if showUsers}
    <input 
    id="search-bar"
    type="search"
    placeholder="Rechercher un joueur"
    bind:value={searchTerm}
    />
    
    <table>
        <thead>
            <tr>
                <th>username</th>
                <th>e-mail</th>
                <th>verified email</th>
                <th>in Game</th>
                <th>Active</th>
                <th>Role</th>
            </tr>
        </thead>
        <tbody>
            {#each filteredUsers as user}
                <tr>
                    <th>{user.username} </th>
                    <td>{user.email} </td>
                    <td>{user.emailVerified} </td>
                    <td>{user.inGame}</td>
                    <td>{user.isActive} </td>
                    <td>{user.role} </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {/if}
    
</div>


<div style="display:flex;">
    <button onclick={()=>showTarotTables = !showTarotTables}> {showTarotTables ? "Cacher tables tarot" : "Afficher tables tarot" }   </button>
    {#if showTarotTables}
    <form method="POST" action="?/deleteCompletedTables" use:enhance>
        <button type="submit">Supprimer tables complètes</button>
    </form>    {/if}
</div>

<div id="tarot-tables">
    {#if showTarotTables}
    <table>
        <thead>
            <tr>
                <th>id</th>
                <th>size</th>
                <th>ready</th>
                <th>completed</th>
                <th>round</th>
            </tr>
        </thead>
        <tbody>
            {#each tarotTables as table}
                <tr>
                    <th>{table._id} </th>
                    <td>{table.size} </td>
                    <td>{table.ready} </td>
                    <td>{table.completed}</td>
                    <td>{table.roundMax} </td>
                    <td>
                        <form method="POST" action="?/deleteTable" use:enhance>
                            <input type="hidden" name="tableId" value={table._id} />
                            <button type="submit">X</button>
                        </form>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {/if}
    
</div>


<style>
    table, th, td{
        border : var(--border-1);
        border-collapse: collapse;
        text-align: center;
        padding: 2px;
        background-color: azure;
    }
</style>