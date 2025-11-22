<script lang='ts'>
	import { onMount } from "svelte";
    import UserProfil from "./UserProfil.svelte";
	import {useTarotContext} from '../game/context/tarotContext.svelte'

    // rajouter barre pour scroller, barre de recherche de joueur (filtre)
    let tarotContext = useTarotContext()
 
    let activeUsers = $state()
    let selectedUser = $state()
    const socket = $derived(tarotContext.socket)
    const tableId = $derived(tarotContext.table._id)

    async function fetchActiveUsers() {
        const res = await fetch("/");
        activeUsers = await res.json();
        activeUsers = activeUsers.filter(user => user._id != tarotContext.user._id)
    }

    onMount(()=> {
        fetchActiveUsers()
        const interval = setInterval(fetchActiveUsers, 2000);
        return () => clearInterval(interval);
    })

    async function fetchSelectedUser(userId) {
        console.log("userId :", userId)
        const res = await fetch(`/users/${userId}`);
        selectedUser = await res.json();
    }
    
    
</script>


<div id="listplayers">
    <h1><u> Joueurs actifs :</u> </h1>
    <!-- barre de recherche -->
    <ul>
        {#each activeUsers as activeUser }
            <li> 
                <button id="pseudo-button" onclick={()=> fetchSelectedUser(activeUser._id)}> {activeUser.name} </button> 
                <button id="invite-button" onclick={()=> socket.emit("inviteToPlay", tableId, tarotContext.user.username, activeUser._id)}> Inviter </button>
            </li>
        {/each}
    </ul>
</div>

<!-- faire un lien sur nom du joueur pour afficher le profil -->
{#if selectedUser}
    <UserProfil user={selectedUser} onclick = {()=> selectedUser = null}/>
{/if}

<style>
    #listplayers{
        background : var(--color-bg-box);
        border-radius: 15px;
        margin: 10px;
        padding: 10px;
        height: 252px;
        width : 200px;
        text-align:center
    }

    li{
        border : var(--border-1);
        display: flex;
        justify-content: space-between;
        padding: 3px;
        border-radius: 15px;
    }

    button{
        padding: 3px;
        border-radius: 10px;
    }

    #pseudo-button{
        width: 100px;
        background-color: azure;
        box-shadow: 0px 0px 0px ;
    }

    #invite-button{
        width: auto;
        padding: 3px;
        background-color: var(--color-text-2);
        color : white
    }

</style>