
<script>
    import Copyright from '@lucide/svelte/icons/copyright'

    const links = [
        {name : "mentions légales", url : "/policies"},
        {name : "à propos", url : "/about"},
        
    ]

    const rules = [
        {name : "tarot", url : "/rules/tarot"},
        {name : "belote", url : "/rules/belote"},
        {name : "yam's", url : "/rules/yams"},
        {name : "échec", url : "/rules/chess"},
    ]
</script>

<footer>
    <nav>
        Règles des jeux :
        {#each rules as link }
        <a href={link.url}>{link.name}</a>
        {/each}
        <hr>
        {#each links as link }
        <a href={link.url}>{link.name}</a>
        {/each}
    
    </nav>
    <span> <p>jouonsentrepotes.fr</p><p><Copyright size={14}/> </p> 2025</span>
    
</footer>


<style>
    footer{
        display: flex;
        flex-direction: column;
        align-items:center;       
        font-size: small;
    }

    nav{
        display: flex;
        align-items: center;
        padding: 15px;
        gap: 10px;
    }

    a{
        text-decoration: underline;
    }

    a:hover{
        color: maroon;
    }


    span{
        display: flex;
        font-size: x-small;
    }

    hr{
        border: 1px solid maroon;
        height: 20px;
    }

</style>