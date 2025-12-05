
<script>
    let {dialog = $bindable(), text, action, onaction} = $props()

</script>

<dialog bind:this={dialog} closedby="closerequest">
    <p>{text}</p>
    <button onclick={onaction} > {action} </button>
    <button onclick={()=>dialog.close()} >Fermer</button>
</dialog>

<style>
    dialog{
        align-items: center;
        justify-content: center;
    }

</style>