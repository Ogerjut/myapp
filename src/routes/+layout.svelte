<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { enhance } from "$app/forms";
	import { onMount } from 'svelte';
	import { socket } from '$lib/client/socket';
	import { goto } from '$app/navigation';

	let { children, data } = $props();
	
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
		<button type="submit" disabled={signout}> {signout ? "Loging out..." : "Log out"} </button>
  	</form>
	<a href="/">Home</a>
	<a href="/dashboard">Account</a>
	<a href="/table">Tarot</a>
	<a href="/yams">Yams</a>
	
	
	{:else}
	<a href="/login">Log in</a>
	<a href="/signup">Sign up</a>
	{/if}

	
</nav>

<main>
	{@render children?.()}

	{#if showInvite}
	<div class="invite-modal">
		<p>{inviter} t'invite à rejoindre une partie !</p>
		<button onclick={acceptInvite}>Accepter</button>
		<button onclick={declineInvite}>Refuser</button>
	  </div>
		
	{/if}
	
</main>

