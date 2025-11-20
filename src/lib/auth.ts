import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";
import { db, usersCollection } from "./server/db/db.js";
import { ObjectId } from "mongodb";
import { sendEmail } from "./email/email.js";

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  url: BETTER_AUTH_URL,
  
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 64,
    // requireEmailVerification: true,

    sendResetPassword: async ({user, url, token}, request) => {
      // sendEmail à définir et à importer
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        html : `
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
      `,
      });
    },
  
  },

  plugins: [
    username({
      minUsernameLength: 1
    }),
    sveltekitCookies(getRequestEvent)
  ],

  emailVerification: {
		sendVerificationEmail: async ({ user, url, token }) => {
			// Send verification email to user
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600 // 1 hour
	},

  user: {
    // changeEmail : {
    //   enabled : true,
    //   sendChangeEmailVerification : async({user, newEmail, url, token}, request)=>{
    //     await sendEmail({
    //       to : user.email,
    //       subject : 'Changement adresse email',
    //       text : 'Cliques sur le lien pour confirmer le changement'
    //     })
    //   }
    // },
    additionalFields: {
      role: {type: "string", defaultValue: "user", input: false},
      inGame: {type: "boolean", input: false},
      isActive : {type: "boolean", input: false},
      victories :  {type: "number", input: false},
      games :  {type: "number", input: false},
      score :  {type: "number", input: false},

    }
  },

  databaseHooks: {
    user: {
      create: {
        async before(user) {
            return {
                data: {
                    ...user,
                    isActive: true,
                    inGame: false,
                    victories : 0, 
                    games : 0,
                    score : 0,
                  }
            }
        },

        async after(user) {
          await usersCollection.updateOne(
            {_id: new ObjectId(user.id)},
            {$set : {
              tarot : {}
            }}
          );
        }
      }
    }
  }
});
