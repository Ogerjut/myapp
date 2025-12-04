<script lang="ts">
	import { useTarotContext } from '../game/context/tarotContext.svelte';
	import UserTarotCard from "./UserTarotCard.svelte";

    let tarotContext = useTarotContext()
    let {opponents} = $props()

    let playersOrdered = $derived.by(() => {
        const ids = tarotContext.table.playersId
        if (!ids) return []

        const allUsers = [tarotContext.user, ...opponents]

        return ids.map(id => allUsers.find(u => u?._id === id) || undefined)
    })

    let myIndex = $derived.by(() =>
        playersOrdered.findIndex(p => p?._id === tarotContext.user._id)
    )

    let playersRelative = $derived.by(() => {
        if (!playersOrdered.length) return []

        return [
            playersOrdered[(myIndex + 0) % 4], // toi → bottom
            playersOrdered[(myIndex + 1) % 4], // droite
            playersOrdered[(myIndex + 2) % 4], // haut
            playersOrdered[(myIndex + 3) % 4]  // gauche
        ]
    })

</script>

<div class="player" style="grid-area: 2 / 3;">
    <UserTarotCard user = {playersRelative[1]} />
</div>

<div class="player" style="grid-area: 1 / 2;">
    <UserTarotCard user = {playersRelative[2]} />
</div>

<div class="player" style="grid-area: 2 / 1;">
    <UserTarotCard user = {playersRelative[3]} />
</div>

<div class="player" style="grid-area: 3 / 2;">
    <UserTarotCard user = {playersRelative[0]}/>
</div>


<style>
    .player{
        display: flex;
        align-items: center;
    }
</style>