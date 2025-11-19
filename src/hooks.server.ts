import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { usersCollection } from "$lib/server/db/db";
import { ObjectId } from "mongodb";

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });
  
  event.locals.session = session?.session;
  event.locals.user = session?.user
  
  return svelteKitHandler({ event, resolve, auth, building });
}