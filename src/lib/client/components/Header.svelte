<script>
    import Title from "./Title.svelte";
	import logo from '$lib/assets/logo.png'

    let {data} = $props()


</script>

<header>
    <img src={logo} alt="logo">

    <Title />
	
    <!-- {#if data.user}
        <div id="user-info">
            <p > Bonjour {data.user.name} ({data.user.email})</p>
            {#if data.user?.role === "admin"}
            <p>Admin mode</p>
            {/if}
        </div>
    {/if} -->


</header>


<style>
  
	header{
		display: flex;
		align-content: center;
		background-color:var(--color-bg);
		align-items: center;
        gap: 10px;
        margin-top: 5px;
       
	}

    #user-info{
		text-align: center;
		width: 300px;

	}

    img{
        zoom : 0.2;
    }

</style>