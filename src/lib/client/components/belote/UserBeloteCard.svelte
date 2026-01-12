<script lang='ts'>
	import { useBeloteContext } from '$lib/client/game/context/beloteContext.svelte';
	import MiniCard from '../MiniCard.svelte';
	import Timer from '../Timer.svelte';

	let beloteContext = useBeloteContext()
	let { user } = $props()

	const userId = $derived(user?.id || user?._id)
    const tableId = $derived(beloteContext.table._id)
    const socket = $derived(beloteContext.socket)
	const currentPlayerId = $derived(beloteContext.table.gameState.currentPlayerId)
	const userIsCurrentPlayer = $derived(userId === currentPlayerId)
    
	const betConvertion = {
		0 : "a passé",
        1 : "a pris",
    }

</script>

<div id="user-card">
	<!-- {#if userIsCurrentPlayer && beloteContext.table.state === "game" && browser }
		<div id="timer">
			<Timer duration={5} callback={() => playRandomCard()}  key={`${currentPlayerId}`}/>
		</div>
	{/if} -->
	<p class="username">{user?.username ?? "siège vide"}</p>
	<hr />
	{#if user}
	<div class="user-bottom">
		<div class="user-info">
			{#if beloteContext.table.state === "bet" && user.belote.isSpeaker}
				<i>Parie...</i> 
			{:else if beloteContext.table.state === "bet" && user.belote.hasBet}
				<p>{betConvertion[user.belote.bet]}</p> 
			{:else if beloteContext.table.state === "game" &&  userIsCurrentPlayer}
				<i>Joue...</i>

			{:else if beloteContext.table.state === "game" && user.belote.hasPlayed && user.belote.playedCard}
				<MiniCard value={user.belote.playedCard.value} suit={user.belote.playedCard.suit} />
			{/if}
		</div>
		<div class="score">
			<p>{user.score.belote || 0} pts</p>
		</div>
	</div>
	{/if}
	
	
</div>


<div id="badge">

	{#if user?.belote.hasTaken}
		<div>
			<p id="badge-preneur">P</p>
		</div>
	{/if}


</div>


<style>
	#user-card {
		border: var(--border-4);
		border-radius: 10px;
		max-width: 150px;
		width: 130px;
		padding: 6px;
		margin: 5px;
		background: var(--color-bg-box);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.username {
		text-align: center;
		font-weight: bold;
		color : black
	}

	hr {
		border: none;
		border-top: var(--border-1);
		margin: 4px;
	}

	.user-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}

	.user-info {
		flex: 1;
		text-align: left;
		font-size: 0.9rem;
	}

	.score {
		text-align: right;
		font-style: italic;
		color : var(--color-text-2)
	}

	#badge-preneur {
		background: blueviolet;
		color: white;
		border-radius: 50%;
		text-align: center;
		font-size: 1.1rem;
		font-weight: bold;
		width: 30px;
		font-family: "Kurale" ;
		box-shadow: 1px 1px 2px grey;
	
	}

	
	#badge{
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 5px;
	}


</style>
