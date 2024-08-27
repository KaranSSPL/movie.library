## Getting Started

First, Add credentials of PostgreSQL database in two files:

`needed Database Name, Username, password`

1. for database seeding
   file path: `src\db\config\config.js`

2. for database connection
   file path: `src\lib\dbConnect.ts`

Run migration for PostgreSQL database:
Migration will run with Sequelize CLI with directory: src\db\config

```
npx sequelize-cli init
```

```
# or
yarn migrate
# or
pnpm migrate
# or
bun migrate
```

Run database seeding for default user:

```
npm run seed
# or
yarn seed
# or
pnpm seed
# or
bun seed

```

`Rollback Last Migration`

```
npm run migration:rollback
# or
yarn migration:rollback
# or
pnpm migration:rollback
# or
bun migration:rollback

```

`Rollback All Migrations`

```
npm run migration:rollback:all
# or
yarn migration:rollback:all
# or
pnpm migration:rollback:all
# or
bun migration:rollback:all
```

`Rollback Seed Data`

```
npm run seed:rollback
# or
yarn seed:rollback
# or
pnpm seed:rollback
# or
bun seed:rollback
```

Now all set next Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

use test user to access movie library:
email: example@example.com
password: test
