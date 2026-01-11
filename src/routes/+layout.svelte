<script lang="ts">
	import '../app.css';
	import jouonsentrepotes from '$lib/assets/jouonsentrepotes-icon.png'
	import { onMount } from 'svelte';
	import { socket } from '$lib/client/socket';
	import { goto } from '$app/navigation';

	import Footer from '$lib/client/components/Footer.svelte'
	import Header from '$lib/client/components/Header.svelte';
	import Nav from '$lib/client/components/Nav.svelte';
	
	let { children, data } = $props();

	let showInvite = $state(false)
	let inviter = $state(null)
	let tableID = $state(null)
	let gameType = $state("")

	async function acceptInvite(){
		showInvite = false
		goto(`/${gameType}/${tableID}`)
	}

	function declineInvite(){
		showInvite = false
	}

	function registerUser(){
		if (data?.user?.id){
			socket.emit("registerUserSocket", data?.user?.id);
		}
	}

	onMount(() => {
    	registerUser()

		socket.on("connect", () => {
            console.log("Socket connected/reconnected");
            registerUser();
        });

		socket.on("invitationToPlay", (tableId, from, game)=>{
			console.log("invitation to play from", from)
			showInvite = true
			inviter = from 
			tableID = tableId
			gameType = game
		})

		return ()=>{
			socket.off("invitationToPlay")
		}
	
	})

</script>

<svelte:head>
	<link rel="icon" href={jouonsentrepotes} />
</svelte:head>

<Header {data} />

<Nav {data} />

<main>
	{@render children?.()}

	{#if showInvite}
		<div id="invite-modal">
			<p>{inviter} t'invite à rejoindre une partie de {gameType} !</p>
			<div id="button-modal">
			<button onclick={acceptInvite}>Accepter</button>
			<button onclick={declineInvite}>Refuser</button>
			</div>
		</div>
	{/if}
</main>


<Footer/>





<style>
	
	main {
		background-color : var(--color-bg-2);
		display : flex;
		align-items: center;
		flex-direction: column;
		min-height: 400px;
		min-width: 400px;
		border-radius: 15px;
		justify-content: center;
		margin-top: 5px;
		
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
	}

	#button-modal{
		display: flex;
		justify-content: space-around;
		padding: 3px;
	}


  
</style>

