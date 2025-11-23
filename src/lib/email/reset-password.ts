
export const resetPassword = (url)=> {
    return `
        <p>Bonjour 👋,</p>
        <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
        <p><a href="${url}" style="
        background:#4f46e5;
        color:white;
        padding:10px 15px;
        border-radius:6px;
        text-decoration:none;
        ">Réinitialiser mon mot de passe</a></p>
        <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        `
}