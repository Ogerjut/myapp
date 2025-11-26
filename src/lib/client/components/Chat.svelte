<script lang='ts'>
	import { enhance } from "$app/forms";
    let {data} = $props()

    let messages = $state(data.messages)
    let sending = $state(false)

</script>

<div id="chat-container">
    <h1>CHAT</h1>
    <div id="msg-container">
        {#each [...messages].reverse() as msg}
            <div class="message">
                <span class="author">{msg.author}</span>
                <span class="time">({new Date(msg.date).toLocaleTimeString()})</span> :
                <span class="content">{msg.content}</span>
            </div>
        {/each}
    </div>    

    <form action="?/sendMessage" method="post"
    use:enhance={(({formElement})=>{
        sending = true
      return async ({result, update}) => {
          await update(); 
          sending = false
          console.log(result)
          if (result?.data?.success) {
            console.log(result.data)
            formElement.reset()
            messages = result.data.messages
            
        
          }}})}
    >
        
        
        <input type="text" name="msg" placeholder="Ton message">
        <button disabled={sending} type="submit">Envoyer</button>
    </form>
    

</div>

<style>
    #chat-container{
        border-radius: 15px;
        background-color: var(--color-bg-box);
        display: flex;
        flex-direction: column;
        width: 75%;
        min-width: 50%;
        height: 400px;
        align-items: center;
        margin: 2px;
        box-shadow: var(--box-shadow-1);
        

    }

    #msg-container {
        display: flex;
        flex : 1;
        flex-direction: column;
        overflow-y: auto;
        align-self : stretch;
        font-size: small;
        margin: 2px;
    }

    h1{
        background-color: var(--color-text-2);
        align-self: stretch;
        color : white;
        text-align: center;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    
    }

    .message {
        word-wrap: break-word;
        word-break: break-word;
        white-space: pre-wrap;
        padding: 2px 4px;
    }

    form{
        margin: 1px;
        display : flex;
        align-self: stretch;
        margin: 2px;
    }

    input{
        border-bottom-left-radius: 14px;
        flex : 1
        
    }


    button{
        border-radius: 0;
        padding: 8px;
        box-shadow: 0px 0px 0px;
        border-bottom-right-radius: 14px;
    }

    .time {
        font-size: x-small;
    }

    .author{
        font-weight: bold;
    }
 



    

</style>