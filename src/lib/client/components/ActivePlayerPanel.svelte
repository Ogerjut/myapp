<script lang='ts'>
	import { onMount } from "svelte";
    import UserProfil from "./UserProfil.svelte";
	import {useTarotContext} from '../game/context/tarotContext.svelte'

    let tarotContext = useTarotContext()
 
    let activeUsers = $state()
    let selectedUser = $state()
    const socket = $derived(tarotContext.socket)
    const tableId = $derived(tarotContext.table._id)
    
    $inspect("activeUsers : ", activeUsers)

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
    <h1> Active Players : </h1>
    <ul>
        {#each activeUsers as activeUser }
            <li> 
                <button onclick={()=> fetchSelectedUser(activeUser._id)}> {activeUser.name} </button> 
                <button onclick={()=> socket.emit("inviteToPlay", tableId, tarotContext.user.username, activeUser._id)}> Inviter </button>
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
        background : white;
        opacity: 60%;
        border-radius: 15px;
        margin: 10px;
        padding: 10px;
    }

</style>