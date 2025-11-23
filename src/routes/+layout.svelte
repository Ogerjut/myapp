<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { enhance } from "$app/forms";
	import { onMount } from 'svelte';
	import { socket } from '$lib/client/socket';
	import { goto } from '$app/navigation';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Menu from '@lucide/svelte/icons/menu';

	let { children, data } = $props();

	let showMenu = $state(false)
	
	let signout = $state(false)

	let showInvite = $state(false)
	let inviter = $state(null)
	let tableId = $state(null)

	async function acceptInvite(){
		showInvite = false
		goto(`/table/${tableId}`)
	}

	function declineInvite(){
		showInvite = false
	}

	onMount(() => {
    	socket.emit("registerUserSocket", data?.user?.id);
	})

	$effect(()=>{
		socket.on("invitationToPlay", (tableID, from)=>{
			console.log("invitation to play from", from)
			showInvite = true
			inviter = from 
			tableId = tableID
		})

		return ()=>{
			socket.off("invitationToPlay")
		}
	})

</script>


<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="flex gap-2">

	{#if data.user}
	<form method="POST" action="/dashboard?/signout"
		use:enhance ={() => {
			signout = true
		return async ({ update, result }) => {
			await update()
			signout = false	
			};
		}}>
		<button id="logout" type="submit" disabled={signout}> <LogOut/> </button>
  	</form>
		<div id="menu">
			<button onclick={()=> showMenu = !showMenu}> <Menu/> </button>
		{#if showMenu}
		<a href="/">Menu</a>
		<a href="/dashboard">Account</a>
		<a href="/table">Tarot</a>
		<!-- <a href="/yams">Yams</a> -->
		{/if}
		</div>
	  
	
			
		
	
	
	{:else}
	<a href="/login">Se connecter</a>
	<a href="/signup">S'inscrire</a>
	{/if}

	
</nav>

<main>
	{@render children?.()}

	{#if showInvite}
	<div id="invite-modal">
		<p>{inviter} t'invite à rejoindre une partie !</p>
		<div id="button-modal">
		<button onclick={acceptInvite}>Accepter</button>
		<button onclick={declineInvite}>Refuser</button>
		</div>

	</div>
		
{/if}
</main>

<footer>
	<div>
		footer
	</div>
</footer>




<style>
	
	main {
		background-color : var(--color-bg);
		display : flex;
		align-items: center;
		flex-direction: column;
		min-height: 500px;
		margin: 5%;
		margin-top: -5px;
		border-radius: 10px;
		
	}

	nav {
		margin : 5px;
		padding: 5px;
		align-items: center;
		justify-content: center;
		font-size: medium;
	}

	a {
		border : var(--border-1);
		background-color: var(--color-text);
		color : azure;
		padding : 10px;
		border-radius : 10px;
		min-width: 20px;
		text-align: center;
	}

	#invite-modal {
		display: flex;
		position: absolute;
		border : var(--border-1);
		padding : 15px;
		border-radius : 15px;
		flex-direction: column;
		justify-self: center;
		background: var(--color-bg-box);
		opacity : 90%; 
	}

	#button-modal{
		display: flex;
		justify-content: space-around;
		padding: 3px;
	}


	a:hover{
		color : var(--color-bg-box);
		box-shadow: 0px 0px 5px var(--color-text-2);
	}

	#logout{
		background-color: crimson;
		color : white;
	}

	#logout:hover {
		box-shadow: 0px 0px 3px red;
	}
	
	#menu{
		justify-content: center;
		display : flex;
		gap : 5px;
		background-color: beige;
		padding: 5px;
		border-radius: 15px;
	}


  
</style>

