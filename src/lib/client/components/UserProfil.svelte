
<script lang='ts'>

    let {user, onclick}= $props()

</script>


<div class="flexbox absolute border-2 p-5 w-40 ">

    
        <b><p>{user.name}</p></b>
        <p>Parties : {user.games}</p>
        <p>Victoires : {user.victories}</p>
        <!-- <p>En jeu : {user.inGame} </p> -->
        <button type="button"  onclick={() => onclick()}> Fermer </button>

    

</div>

<style>

    div{
        background-color: white;
        border-radius: 15px;
        align-items: center;
        justify-content: center;
        justify-items: center;
        opacity: 90%;
    }
</style>