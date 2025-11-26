import { redirect, fail, error } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import type { Actions, PageServerLoad } from "./$types.js";
import { usersCollection } from "$lib/server/db/db.js"
import {ObjectId} from 'mongodb'

export const load: PageServerLoad = async ({ locals }) => {
  // Rediriger si pas de session
  console.log("user.role", locals.user.role)
  if (!locals.session) {
    throw redirect(302, "/");
  }
  if (locals.user.role != 'admin') {
    throw error(403, "Access denied");
  }
  return 
};