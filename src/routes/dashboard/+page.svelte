<script lang="ts">
    // import type { PageData } from "./$types.js";
    let {data, form} = $props()
    import { enhance } from "$app/forms";


    let showChangePassword = $state(false)
    let showChangeEmail = $state(false)
    let changingPassword = $state(false)
    
    

</script>

<div id="dashboard-container">
  <div class="modifier">
    <button class="modify-button" onclick={()=>showChangePassword = !showChangePassword}> Changer de mot de passe</button>

    {#if showChangePassword}
      <form method="post" action="?/changePassword" 
      use:enhance ={(({formElement})=>{
        changingPassword = true
      return async ({result, update}) => {
          await update(); 
          changingPassword = false
          if (result?.data.success) {
            formElement.reset()
            console.log(result.data.message)
          }
        }
      })}
      >
      <div id="field">
        <label>
          Nouveau mot de passe  :
          <input type="password" name="newPassword" required />
        </label>
        <label>
          Répéter nouveau mot de passe :
          <input type="password" name="newPassword2" required />
        </label>
        
        <label>
        Ancien mot de passe :
          <input type="password" name="password" required />
        </label>
      </div>
      <button disabled={changingPassword}> Changer de mot de passe </button>
      
      {#if form?.error}
          <p style="color:red;">{form.error}</p>
      {/if}

      {#if form?.success}
        <p>{form.message}</p>
      {/if}
    </form> 
    {/if}

  </div>

  <div class="modifier">
    <button class="modify-button" onclick={()=>showChangeEmail = !showChangeEmail}> Changer d'adresse e-mail</button>

  </div>

  <div class="modifier">
    <button class="modify-button" onclick={()=>showChangeEmail = !showChangeEmail}> Supprimer le compte</button>

  </div>
  
  
</div>





<style>

  #dashboard-container{
    display: flex;
    flex-direction: column;
    padding: 5px;
    gap : 5px;
  }

  .modifier {
      display: flex;
      flex-direction: column;
      
    }
    
    form {
      padding: 15px;
      background-color: var(--color-bg-box);
      border-radius: 15px;
      align-items: center;
      display: flex;
      flex-direction: column;
      
    }
  
    #field {
      align-items: end;
      padding: 10px;
      display: flex;
      flex-direction: column;
    }
  
    input {
      margin: 2px;
      border-radius: 10px;
    }
  
  
    h1{
      font-size:xx-large;
    }

    .modify-button{
      background-color: beige;
    }

    .modify-button:focus-visible{
      border : var(--border-1)
    }
  
  </style>