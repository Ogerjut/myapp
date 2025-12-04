<script>
    import LogOut from '@lucide/svelte/icons/log-out';
	import Menu from '@lucide/svelte/icons/menu';
	import House from '@lucide/svelte/icons/house';
	import UserCog from '@lucide/svelte/icons/user-cog';
	import Admin from '@lucide/svelte/icons/shield-user';
	import Msg from '@lucide/svelte/icons/message-circle';
    import { enhance } from "$app/forms";

    let {data} = $props()
    
    const MENU = [
        {name : "menu", url : "/"},
        {name : "tarot", url : "/table"},
		{name : "belote", url : "/belote"},
		{name : "yam's", url : "/yams"},
		{name : "échec", url : "/chess"},
		{name : "chat", url : "/chat"},
		{name : "compte", url : "/dashboard"},
    ]

    let showMenu = $state(true)
	let signout = $state(false)

</script>

<!-- {#if data.user}
<nav>
    <button class='btn-menu' onclick={()=> showMenu = !showMenu}> <Menu/>  </button>
    {#if showMenu}
        <form method="POST" action="/dashboard?/signout"
            use:enhance ={() => {
                signout = true
            return async ({ update, result }) => {
                await update()
                signout = false	
                };
        }}>
        <button id="logout" type="submit" disabled={signout}> <LogOut/> </button>
        </form>
        <a href="/"> <House/> </a>
        <a href="/dashboard"> <UserCog/> </a>
        <a href="/chat"> <Msg/> </a>
        {#if data.user.role ==="admin"}
            <a href="/admin"> <Admin/> </a>
        {/if}
    {/if}
</nav>
{/if} -->

{#if data.user}
	<nav id="main-navbar">
		{#each MENU as link }
			<a class='link-nav' href={link.url}>{link.name.toUpperCase()}</a>
		{/each}
		{#if data.user.role ==="admin"}
            <a class='link-nav' href="/admin"> ADMIN </a>
        {/if}

	</nav>
{/if}

<style>
	/* nav {
	align-items: center;
	display : flex;
	flex-direction: column;
	padding: 10px;
	min-width: 300px;
	gap: 2px;
	justify-content: flex-start;
	justify-self: flex-start;
	}

	a, .btn-menu {
		border : var(--border-4);
		background-color: var(--color-text-2);
		color : azure;
		padding : 8px;
		border-radius : 15px;
		text-align: center;
	}

    a:hover{
		color : var(--color-bg-box);
		box-shadow: 0px 0px 5px var(--color-text-2);
	}

	#logout{
		background-color: crimson;
		color : white;
	}

	#logout:hover {
		box-shadow: 0px 0px 3px red;
	} */

	#main-navbar{
		display: flex;
		/* justify-content:stretch; */
		gap: 2px;
		background-color: var(--color-bg);
		margin-top: 3px;
		margin-bottom: 3px;
		border-radius: 10px;
		padding: 5px;
	}

	.link-nav{
		background-color: var(--color-text-2);
		padding: 10px;
		color: var(--color-bg);
		border-radius:10px;
		min-width: 70px;
		text-align: center;
		
	}

	.link-nav:first-child{
		margin-left: 1px;
	}

	.link-nav:hover{
		box-shadow: 0px 0px 15px maroon;
		color: peru;
	}

</style>