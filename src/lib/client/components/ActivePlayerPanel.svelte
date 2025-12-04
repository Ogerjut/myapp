<script lang='ts'>
	import { onMount } from "svelte";
    import UserProfil from "./UserProfil.svelte";

    let {context, game} = $props()
 
    let activeUsers = $state([])
    let selectedUser = $state()
    let searchTerm = $state("")

    const socket = $derived(context.socket)
    const tableId = $derived(context.table._id)
    let filteredUsers = $derived(
        activeUsers?.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    onMount(()=> {
        fetchActiveUsers()
        const interval = setInterval(fetchActiveUsers, 2000);
        return () => clearInterval(interval);
    })

    async function fetchSelectedUser(userId) {
        const res = await fetch(`/users/${userId}`);
        selectedUser = await res.json();
    }

    async function fetchActiveUsers() {
        const res = await fetch("/");
        activeUsers = await res.json();
        activeUsers = activeUsers.filter(user => user._id != context.user._id)
    }
    
</script>


<div id="listplayers">
    <h1><u> Joueurs actifs :</u> </h1>
    <input 
    id="search-bar"
    type="search"
    placeholder="Rechercher un joueur"
    bind:value={searchTerm}
    />

    <ul>
        {#each filteredUsers as activeUser }
            <li> 
                <button id="pseudo-button" onclick={()=> fetchSelectedUser(activeUser._id)}> {activeUser.name} </button> 
                <button id="invite-button" onclick={()=> socket.emit("inviteToPlay", tableId, context.user.username, activeUser._id, game)}> Inviter </button>
            </li>
        {/each}
    </ul>
</div>

{#if selectedUser}
    <UserProfil user={selectedUser} onclick = {()=> selectedUser = null} games={selectedUser.games?.[game]} victories={selectedUser.victories?.[game]}/>
{/if}

<style>
    #listplayers{
        background : var(--color-bg-box);
        border-radius: 15px;
        margin: 10px;
        padding: 10px;
        height: 250px;
        width : 200px;
        text-align:center;
        
    }

    #search-bar{
        margin: 2px;
        padding: 1px;
        font-size: small;
        width : 100%;
        border-radius: 5px;
    }

    li{
        border-bottom : var(--border-1);
        display: flex;
        justify-content: space-between;
        font-size: small;
        
    }

    li:first-child{
        border-top : var(--border-1);
    }

    button{
        padding: 0px;
        border-radius: 5px;
        margin: 2px;
    }

    #pseudo-button{
        width: 100px;
        background-color: azure;
        box-shadow: 0px 0px 0px ;
    }

    #pseudo-button:hover{
        font-weight: bold;
    }

    #invite-button{
        width: auto;
        padding: 3px;
        background-color: var(--color-text-2);
        color : white
    }

</style>