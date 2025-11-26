<script lang="ts">
  import { enhance } from "$app/forms";

  let { data } = $props();

  // Affichage des sections
  let showChangePassword = $state(false);
  let showChangeEmail = $state(false);
  let showDelete = $state(false);

  // Etats de chargement
  let changingPassword = $state(false);
  let changingEmail = $state(false);
  let deletingAccount = $state(false);

  // Etats spécifiques des formulaires
  let formPassword = $state(null);
  let formEmail = $state(null);
  let formDelete = $state(null);
</script>

<div id="dashboard-container">
<!-- Changer le mot de passe -->
<div class="modifier">
  <button class="modify-button" onclick={() => showChangePassword = !showChangePassword}>
    Changer de mot de passe
  </button>

  {#if showChangePassword}
    <form method="post" action="?/changePassword"
      use:enhance={({ formElement }) => {
        changingPassword = true;
        return async ({ result, update }) => {
          await update();
          changingPassword = false;
          formPassword = result?.data;
          if (result?.data?.success) formElement.reset();
        }
      }}
    >
      <div id="field">
        <label>
          Nouveau mot de passe :
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

      <button disabled={changingPassword}>Changer de mot de passe</button>

      {#if formPassword?.error}
        <p style="color:red;">{formPassword.error}</p>
      {/if}
      {#if formPassword?.success}
        <p>{formPassword.message}</p>
      {/if}
    </form>
  {/if}
</div>

<!-- Changer l'adresse e-mail -->
<div class="modifier">
  <button class="modify-button" onclick={() => showChangeEmail = !showChangeEmail}>
    Changer d'adresse e-mail
  </button>

  {#if showChangeEmail}
    <form method="post" action="?/changeEmail"
      use:enhance={({ formElement }) => {
        changingEmail = true;
        return async ({ result, update }) => {
          await update();
          changingEmail = false;
          formEmail = result?.data;
          if (result?.data?.success) formElement.reset();
        }
      }}
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

      <button disabled={changingEmail}>Changer l'e-mail</button>

      {#if formEmail?.error}
        <p style="color:red;">{formEmail.error}</p>
      {/if}
      {#if formEmail?.success}
        <p>{formEmail.message}</p>
      {/if}
    </form>
  {/if}
</div>

<!-- Supprimer le compte -->
<div class="modifier">
  <button class="modify-button" onclick={() => showDelete = !showDelete}>
    Supprimer le compte
  </button>

  {#if showDelete}
    <form method="post" action="?/deleteAccount"
      use:enhance={({ formElement }) => {
        deletingAccount = true;
        return async ({ result, update }) => {
          await update();
          deletingAccount = false;
          formDelete = result?.data;
          if (result?.data?.success) formElement.reset();
        }
      }}
    >
      <div id="field">
        <label>
          Mot de passe :
          <input type="password" name="password" required />
        </label>
      </div>

      <button disabled={deletingAccount}>Supprimer le compte</button>

      {#if formDelete?.error}
        <p style="color:red;">{formDelete.error}</p>
      {/if}
      {#if formDelete?.success}
        <p>{formDelete.message}</p>
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
gap: 10px;
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
display: flex;
flex-direction: column;
align-items: center;
}

#field {
display: flex;
flex-direction: column;
align-items: end;
padding: 10px;
}

input {
margin: 2px;
border-radius: 10px;
}

.modify-button {
background-color: var(--color-text);
color: white;
}

.modify-button:focus-visible {
border: var(--border-1);
}

#mail-adress {
align-self: center;
padding-bottom: 10px;
padding: 2px;
}

span {
background-color: var(--color-bg);
padding: 5px;
border-radius: 10px;
}
</style>
