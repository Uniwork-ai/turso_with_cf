```
npm install
npm run dev
```

```
npm run deploy
```

### turso

login

```
turso auth login
```

get db url

```
turso db show --url uni-login
```

create auth token

```
turso db tokens create uni-login
```

### drizzle commands

for production, ~~use --config drizzle.prod.config.ts args~~ we use dotenv to load the .env file based on the environment

```
npx drizzle-kit generate
npx drizzle-kit migrate --name "create users table"
npx drizzle-kit studio
npx drizzle-kit push
```

### Application setup

- I used a global variable to store env and exported a helper function to access that env from anywhere in the app
- I used a global variable to store the db client and exported a helper function to access that client from anywhere in the app
- we can access the db using both drizzle and libsql client (turso)
- we have envs in 2 places in the application, one in the wrangler.toml and one in the .env file
  - we can use the wrangler.toml envs for production and the .env file for drizzle commands
  - in runtime we can only use the wrangler.toml envs. in build time we should use the .env file
- use dotenv to load the .env file based on the environment
