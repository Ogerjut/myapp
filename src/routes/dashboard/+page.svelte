<script lang="ts">
    // import type { PageData } from "./$types.js";
    let {data, form} = $props()
    import { enhance } from "$app/forms";

    let showChangePassword = $state(false)
    let showChangeEmail = $state(false)
    let showDelete = $state(false)

    let changingPassword = $state(false)
    let changingEmail = $state(false)
    let deletingAccount = $state(false)
    
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
    
    {#if showChangeEmail}
    <form method="post" action="?/changeEmail" 
    use:enhance ={(({formElement})=>{
      changingEmail = true
    return async ({result, update}) => {
        await update(); 
        changingEmail = false
        if (result?.data.success) {
          formElement.reset()
          console.log(result.data.message)
        }
      }
    })}
    >
    <div id="field">
      <p id='mail-adress'>Adresse e-mail actuelle : <span>{data.user.email}</span></p>
      <label>
        Nouvelle adresse e-mail :
        <input type="email" name="newMail" required />
      </label>
      <label>
        Mot de passe :
        <input type="password" name="password" required />
      </label>
    </div>
    <button disabled={changingEmail}> Changer l'e-mail </button>
    
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
    <button class="modify-button" onclick={()=>showDelete = !showDelete}> Supprimer le compte</button>
    {#if showDelete}
    <form method="post" action="?/deleteAccount" 
    use:enhance ={(({formElement})=>{
      deletingAccount = true
    return async ({result, update}) => {
        await update(); 
        deletingAccount = false
        if (result?.data.success) {
          formElement.reset()
          console.log(result.data.message)
        }
      }
    })}
    >
    <div id="field">
      <label>
        Mot de passe :
        <input type="password" name="password" required />
      </label>
    </div>
    <button disabled={deletingAccount}> Supprimer le compte </button>
    
    {#if form?.error}
        <p style="color:red;">{form.error}</p>
    {/if}

    {#if form?.success}
      <p>{form.message}</p>
    {/if}
  </form> 
  {/if}

  </div>
  
  
</div>





<style>

  #dashboard-container{
    display: flex;
    flex-direction: column;
    padding: 5px;
    gap : 10px;
    max-width: 50%;
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
      align-items: end;
    }
  
    input {
      margin: 2px;
      border-radius: 10px;
    }
  
    .modify-button{
      background-color: var(--color-text);
      color : white
    }

    .modify-button:focus-visible{
      border : var(--border-1)
    }

    #mail-adress{
      align-self: center;
      padding-bottom: 10px;
      padding: 2px;
    }

    span{
      background-color: var(--color-bg);
      padding: 5px;
      border-radius: 10px;
    }
  
  </style>