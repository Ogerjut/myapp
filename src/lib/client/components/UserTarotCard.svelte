<script lang='ts'>
	import { useTarotContext } from '../game/context/tarotContext.svelte'
	import MiniCard from './MiniCard.svelte';

	let tarotContext = useTarotContext()
	
	let { user } = $props()

    const betConvertion = {
        1 : "prise",
        2 : "garde",
        3 : "garde sans",
        4 : "garde contre"
    }
	


</script>

<div id="user-card">
	<p class="username">{user?.username ?? "siège vide"}</p>
	<hr />
	{#if user}
	<div class="user-bottom">
		<div class="user-info">
			{#if tarotContext.table.state === "bet" && user.tarot.isSpeaker}
				<i>Parie...</i> 
			{:else if tarotContext.table.state === "bet" && user.tarot.hasBet}
				<p>Annonce : {user.tarot.bet}</p> 
			{:else if tarotContext.table.state === "game" && user.tarot.isPlayer}
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

{#if user?.tarot.hasTaken}
    <div>
        <p id="badge-preneur">P</p>
        <p> {betConvertion[user.tarot.bet]}</p>
    </div>
{/if}

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
		background: green;
		color: white;
		border-radius: 50%;
		text-align: center;
		font-size: 1.1rem;
		font-weight: bold;
		width: 30px;
	
	}
</style>
