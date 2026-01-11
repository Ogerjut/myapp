<script lang="ts">
	import { useBeloteContext } from "$lib/client/game/context/beloteContext.svelte";
	import UserBeloteCard from "./UserBeloteCard.svelte";

    let beloteContext = useBeloteContext()
    let {opponents} = $props()

    let playersOrdered = $derived.by(() => {
        const ids = beloteContext.table.playersId
        if (!ids) return []

        const allUsers = [beloteContext.user, ...opponents]

        return ids.map(id => allUsers.find(u => u?._id === id) || undefined)
    })

    let myIndex = $derived.by(() =>
        playersOrdered.findIndex(p => p?._id === beloteContext.user._id)
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
    <UserBeloteCard user = {playersRelative[1]} />
</div>

<div class="player" style="grid-area: 1 / 2;">
    <UserBeloteCard user = {playersRelative[2]} />
</div>

<div class="player" style="grid-area: 2 / 1;">
    <UserBeloteCard user = {playersRelative[3]} />
</div>

<div class="player" style="grid-area: 3 / 2;">
    <UserBeloteCard user = {playersRelative[0]}/>
</div>


<style>
    .player{
        display: flex;
        align-items: center;
    }
</style>