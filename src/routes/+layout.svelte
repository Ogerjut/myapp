<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import jouonsentrepotes from '$lib/assets/jouonsentrepotes-icon.png'
	import { enhance } from "$app/forms";
	import { onMount } from 'svelte';
	import { socket } from '$lib/client/socket';
	import { goto } from '$app/navigation';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Menu from '@lucide/svelte/icons/menu';
	import House from '@lucide/svelte/icons/house';
	import UserCog from '@lucide/svelte/icons/user-cog';
	import Admin from '@lucide/svelte/icons/shield-user';
	import Msg from '@lucide/svelte/icons/message-circle';

	import Footer from '$lib/client/components/Footer.svelte'

	let { children, data } = $props();

	let showMenu = $state(true)
	
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
	<link rel="icon" href={jouonsentrepotes} />
</svelte:head>

{#if data.user}
	<nav>
		<button style="background-color: green; color : white" onclick={()=> showMenu = !showMenu}> <Menu/>  </button>
		{#if showMenu}
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
			<a href="/"> <House/> </a>
			<a href="/dashboard"> <UserCog/> </a>
			<a href="/chat"> <Msg/> </a>
			{#if data.user.role ==="admin"}
				<a href="/admin"> <Admin/> </a>
			{/if}
			<!-- <a href="/table">Tarot</a> -->
			<!-- <a href="/yams">Yams</a> -->
		{/if}	
	</nav>

	{#if data.user?.role === "admin"}
	<p>Connected in admin mode</p>
	{/if}

	{#if data.user}
	<p> Bonjour {data.user.name} ({data.user.email})</p>

	{/if}
{/if}


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
	<Footer/>
</footer>




<style>
	
	main {
		background-color : var(--color-bg);
		display : flex;
		align-items: center;
		flex-direction: column;
		min-height: 400px;
		min-width: 400px;
		margin: 5%;
		border-radius: 10px;
		justify-content: center;
		
	}

	nav {
		align-items: center;
		display : flex;
		gap : 5px;
		background-color:lightgreen;
		padding: 10px;
	}

	a {
		border : var(--border-1);
		background-color: var(--color-text);
		color : azure;
		padding : 8px;
		border-radius : 15px;
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
	
  
</style>

