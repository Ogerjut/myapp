import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";
import { db, usersCollection } from "./server/db/db.js";
import { ObjectId } from "mongodb";

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  url: BETTER_AUTH_URL,

  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 2
  },

  plugins: [
    username({
      minUsernameLength: 1
    }),
    sveltekitCookies(getRequestEvent)
  ],

  user: {
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
          console.log("user : ", user)
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
