<script lang='ts'>
    let {value, suit} = $props()
    
    const mapValue = {
        14 : "R",
        13 : "D",
        12 : "C",
        11 : "V",
    }
    const mapSuit = {
        spade : "&#9824", 
        heart : "&#9829",
        diamond : "&#9830", 
        club : "&#9827"
    }
    
    let color = $derived((suit === "heart" || suit === "diamond") ? "red" : suit === "atout" ? 'blue' : 'black')

</script>

<div class="card"
    style="--color : {color}"
>
    <p>{suit != "atout" && mapValue[value] || value}</p>
    <p id='suit'> {@html mapSuit[suit]}</p>
</div>

<style>
    .card{
        background:white;
        color : var(--color);
        width: 26px;
        height: 50px;
        border: 2px solid var(--color);
        padding: 2px;
        gap: 20px;
        border-radius: 5px;
        cursor: none;
        align-self: center;
    }

    #suit{
        justify-self: center;
        font-size: large;
    }
    
</style>