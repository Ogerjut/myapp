<script lang="ts">
	import { useTarotContext } from '../game/context/tarotContext.svelte';
	import UserTarotCard from "./UserTarotCard.svelte";

    let tarotContext = useTarotContext()
    let {opponents} = $props()

</script>

<div class="player" style="grid-area: 2 / 3;">
    <UserTarotCard user = {opponents[0]} />
</div>

<div class="player" style="grid-area: 1 / 2;">
    <UserTarotCard user = {opponents[1]} />
</div>

<div class="player" style="grid-area: 2 / 1;">
    <UserTarotCard user = {opponents[2]} />
</div>

<div class="player" style="grid-area: 3 / 2;">
    <UserTarotCard user = {tarotContext.user}/>
</div>


<style>
    .player{
        display: flex;
        align-items: center;
    }
</style>