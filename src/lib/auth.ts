import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";
import { db, usersCollection } from "./server/db/db.js";
import { ObjectId } from "mongodb";
import { sendEmail } from "./email/email.js";
import { verificationEmail } from "./email/verification-email.js";
import { resetPassword } from "./email/reset-password.js";

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  url: BETTER_AUTH_URL,
  
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 64,
    requireEmailVerification: true,

    sendResetPassword: async ({user, url, token}, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        html : resetPassword(url)
      });
    },
  
  },

  plugins: [
    username({
      minUsernameLength: 2
    }),
    sveltekitCookies(getRequestEvent)
  ],

  emailVerification: {
		sendVerificationEmail: async ({ user, url, token }) => {
			await sendEmail({
        to : user.email,
        subject : "Verify your email adress",
        text : `click the link to verify your email ${url}`,
        html : verificationEmail(url)
      })
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600 // 1 hour
	},

  user: {
    changeEmail : {
      enabled : true,
    },

    deleteUser: {
      enabled : true,
    },

    additionalFields: {
      role: {type: "string", defaultValue: "user", input: false},
      inGame: {type: "boolean", input: false},
      isActive : {type: "boolean", input: false},
      victories :  {type: "number", input: false},
      games :  {type: "number", input: false},
      score :  {type: "number", input: false},
      highestScore :  {type: "number", input: false},


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
                    victories : {tarot : 0, belote : 0, yams : 0, chess : 0}, 
                    games : {tarot : 0, belote : 0, yams : 0, chess : 0},
                    score : {tarot : 0, belote : 0, yams : 0},
                    highestScore : {tarot : 0, belote : 0, yams : 0},
                  }
            }
        },

        async after(user) {
          await usersCollection.updateOne(
            {_id: new ObjectId(user.id)},
            {$set : {
              tarot : {}, 
              belote : {},
              yams : {},
              chess : {}
            }}
          );
        }
      }
    }
  }
});
