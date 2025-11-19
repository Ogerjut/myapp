# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

 What's next? ───────────────────────────────────────────────────────────╮
│                                                                          │
│  📁 Project steps                                                        │
│                                                                          │
│    1: cd myapp                                                           │
│    2: npm run dev -- --open                                              │
│                                                                          │
│  To close the dev server, hit Ctrl-C                                     │
│                                                                          │
│  🧩 Add-on steps                                                         │
│                                                                          │
│    drizzle:                                                              │
│      - You will need to set DATABASE_URL in your production environment  │
│      - Check DATABASE_URL in .env and adjust it to your needs            │
│      - Run npm run db:push to update your database schema                │
│                                                                          │
│  Stuck? Visit us at https://svelte.dev/chat   