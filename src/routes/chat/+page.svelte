<script>
    import Chat from '$lib/client/components/Chat.svelte';
    let {data} = $props()
</script>

<Chat {data} />