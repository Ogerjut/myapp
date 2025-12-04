<script lang='ts'>
	import { useTarotContext } from '../game/context/tarotContext.svelte'
	import MiniCard from './MiniCard.svelte';
	import Timer from './Timer.svelte';

	let tarotContext = useTarotContext()
	let { user } = $props()

	const userId = $derived(user?.id || user?._id)
    const tableId = $derived(tarotContext.table._id)
    const socket = $derived(tarotContext.socket)
	const currentPlayerId = $derived(tarotContext.table.gameState.currentPlayerId)
	const userIsCurrentPlayer = $derived(userId === currentPlayerId)
    
	const betConvertion = {
		0 : "a passé",
        1 : "prise",
        2 : "garde",
        3 : "garde sans",
        4 : "garde contre"
    }

	function playRandomCard(){
		console.log('random card event')
		socket.emit("playRandomCard", tableId, userId)
	}
</script>

<div id="user-card">
	<!-- {#if userIsCurrentPlayer && tarotContext.table.state === "game" && browser }
		<div id="timer">
			<Timer duration={5} callback={() => playRandomCard()}  key={`${currentPlayerId}`}/>
		</div>
	{/if} -->
	<p class="username">{user?.username ?? "siège vide"}</p>
	<hr />
	{#if user}
	<div class="user-bottom">
		<div class="user-info">
			{#if tarotContext.table.state === "bet" && user.tarot.isSpeaker}
				<i>Parie...</i> 
			{:else if tarotContext.table.state === "bet" && user.tarot.hasBet}
				<p>{betConvertion[user.tarot.bet]}</p> 
			{:else if tarotContext.table.state === "game" &&  userIsCurrentPlayer}
				<i>Joue...</i>

			{:else if tarotContext.table.state === "game" && user.tarot.hasPlayed && user.tarot.playedCard}
				<MiniCard value={user.tarot.playedCard.value} suit={user.tarot.playedCard.suit} />
			{/if}
		</div>
		<div class="score">
			<p>{user.score.tarot || 0} pts</p>
		</div>
	</div>
	{/if}
	
	
</div>


<div id="badge">

	{#if user?.tarot.hasTaken}
		<div>
			<p id="badge-preneur">P</p>
			<p class="text-badge"> {betConvertion[user.tarot.bet]}</p>
		</div>
	{/if}

	{#if user?.tarot.chelem}
		<div>
			<p id="badge-chelem">C</p>
			<p class="text-badge">Chelem</p>
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

	#badge-chelem {
		background: orangered;;
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

	.text-badge{
		font-size: small;
		margin-top: -3px;
		
	}

</style>
