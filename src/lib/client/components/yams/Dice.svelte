<script lang="ts">

    let {value} = $props()
    let isSelected = $state(false)

    // rajouter une icone cadenas sous le dé séléctionné

    const diceMap = {
        1 : "&#9856", 
        2 : "&#9857",
        3 : "&#9858", 
        4 : "&#9859",
        5 : "&#9860", 
        6 : "&#9861",

    }

    $inspect(isSelected)

    function toggleisSelected(){
        isSelected = !isSelected
    }

</script>

  
<button id="dice" onclick={() => toggleisSelected()} onmouseenter={() => toggleisSelected()}  class:selected={isSelected}>
    {@html diceMap[value] || "?" }
</button>
    


<style>

    #dice {
        font-size:xx-large;
        zoom: 2;
    }

    #dice.selected{
        opacity: 80%;
        color : grey;
    }

</style>